#!/usr/bin/env python3
"""
Improved rebuild script:
- Extract full INSERT INTO statements from the original MySQL dump by scanning and
  collecting characters until a semicolon that is not inside any single-quoted string.
- Convert table/column identifiers backticks to PostgreSQL double quotes only in
  the header portion (before VALUES) to avoid touching values.
- Append sequences for AUTO_INCREMENT based on the original dump comments.

Output file: iCoachie_postgres_fixed_v2.sql
"""

import re
from pathlib import Path
import os

root = Path('/Users/qaisu/Downloads/iCoachie')
orig_path = root / 'evaluation_mysql_dump.sql'
converted_head_path = root / 'iCoachie_postgres.sql'
output_path = root / 'iCoachie_postgres_fixed_v2.sql'
out_dir = root / 'iCoachie_per_table_sql'
os.makedirs(out_dir, exist_ok=True)

orig_text = orig_path.read_text(encoding='utf-8', errors='ignore')
conv_text = converted_head_path.read_text(encoding='utf-8', errors='ignore')

def extract_header(conv_text):
    # Take everything until the first INSERT INTO converted file (if present)
    marker = '\nINSERT INTO '
    idx = conv_text.find(marker)
    if idx == -1:
        return conv_text
    return conv_text[:idx]

def iter_insert_statements(s):
    # Scan and yield each INSERT INTO `...` ...; statement exactly, preserving values
    i = 0
    n = len(s)
    while True:
        # Find next 'INSERT INTO' token
        m = s.find('INSERT INTO ', i)
        if m == -1:
            break
        start = m
        # now scan until we find a semicolon that is not inside a single-quoted string
        j = start
        in_sq = False
        esc = False
        while j < n:
            ch = s[j]
            if in_sq:
                if esc:
                    esc = False
                elif ch == "\\":
                    esc = True
                elif ch == "'":
                    in_sq = False
            else:
                if ch == "'":
                    in_sq = True
                elif ch == ';':
                    # end of statement
                    j += 1
                    break
            j += 1
        yield s[start:j]
        i = j

def convert_insert_header(stmt):
    # Locate the 'VALUES' keyword; only convert backticks in the portion before it
    # Keep values exactly as in original
    idx = stmt.upper().find('VALUES')
    if idx == -1:
        # no values? return as-is but replace backticks on table name
        stmt2 = re.sub(r"INSERT INTO `(?P<table>[^`]+)`", r'INSERT INTO "\g<table>"', stmt)
        stmt2 = re.sub(r"`([A-Za-z0-9_]+)`", r'"\1"', stmt2)
        return stmt2
    header = stmt[:idx]
    tail = stmt[idx:]
    header = re.sub(r"INSERT INTO `(?P<table>[^`]+)`", r'INSERT INTO "\g<table>"', header)
    header = re.sub(r"`([A-Za-z0-9_]+)`", r'"\1"', header)
    # Sanitize MySQL-style escapes inside single-quoted strings in the tail
    def sanitize_single_quoted_strings(s):
        out = []
        i = 0
        n = len(s)
        while i < n:
            ch = s[i]
            if ch == "'":
                # find closing quote (respecting backslash escapes)
                j = i + 1
                while j < n:
                    if s[j] == "\\":
                        # skip escape
                        j += 2
                        continue
                    if s[j] == "'":
                        j += 1
                        break
                    j += 1
                # content including surrounding quotes
                chunk = s[i:j]
                inner = chunk[1:-1]
                # Convert MySQL escapes to the actual characters
                raw = mysql_unescape(inner)
                # Re-encode for Postgres safe E'' literal
                pg_lit = pg_escape_e_string(raw)
                out.append(pg_lit)
                i = j
            else:
                out.append(ch)
                i += 1
        return ''.join(out)

    tail = sanitize_single_quoted_strings(tail)
    return header + tail


def mysql_unescape(s):
    r"""Convert MySQL-style C-like escapes into actual characters.
    Handles: \\ -> \\, \' -> ', \" -> ", \n, \r, \t, \0, \b, \Z
    """
    out = []
    i = 0
    n = len(s)
    while i < n:
        ch = s[i]
        if ch == "\\" and i + 1 < n:
            nxt = s[i+1]
            if nxt == 'n':
                out.append('\n')
            elif nxt == 'r':
                out.append('\r')
            elif nxt == 't':
                out.append('\t')
            elif nxt == '0':
                out.append('\0')
            elif nxt == 'b':
                out.append('\b')
            elif nxt == 'Z':
                out.append('\x1a')
            elif nxt == "'":
                out.append("'")
            elif nxt == '"':
                out.append('"')
            elif nxt == '\\':
                out.append('\\')
            else:
                # unknown escape, keep literal backslash and char
                out.append(nxt)
            i += 2
        else:
            out.append(ch)
            i += 1
    return ''.join(out)


def pg_escape_e_string(s):
    """Escape a raw Python string into a Postgres E'...' literal.
    We escape single quote as \' and backslash as \\.
    """
    # Replace backslash first
    s = s.replace('\\', '\\\\')
    # Escape single quote with backslash
    s = s.replace("'", "\\'")
    return "E'{}'".format(s)


def sanitize_dates(stmt):
    # Replace MySQL invalid dates with NULL
    stmt = stmt.replace("E'0000-00-00 00:00:00'", "NULL")
    stmt = stmt.replace("E'0000-00-00'", "NULL")
    return stmt


def make_date_columns_nullable(create_stmt):
    # Make timestamp columns nullable by removing NOT NULL
    create_stmt = re.sub(r'(timestamp without time zone)\s+NOT NULL', r'\1', create_stmt, flags=re.I)
    return create_stmt


def extract_table_create(conv_text, table):
    # find CREATE TABLE "table" or CREATE TABLE `table` occurrence
    pattern = re.compile(r"CREATE TABLE\s+\"{}\".*?;\n".format(re.escape(table)), flags=re.S)
    m = pattern.search(conv_text)
    if m:
        return m.group(0)
    # fallback: find CREATE TABLE table without quotes
    pattern2 = re.compile(r"CREATE TABLE\s+{}.*?;\n".format(re.escape(table)), flags=re.S)
    m2 = pattern2.search(conv_text)
    if m2:
        return m2.group(0)
    return None

# 1) Header from converted CREATE TABLE statements
header = extract_header(conv_text)

# 2) Iterate over original file and collect cleaned INSERT statements
insert_stmts = []
insert_by_table = {}
def table_from_insert(stmt):
    # matches INSERT INTO "table" or INSERT INTO `table` or INSERT INTO table
    m = re.search(r"INSERT INTO\s+\"([^\"]+)\"", stmt, flags=re.I)
    if m:
        return m.group(1)
    m = re.search(r"INSERT INTO\s+`([^`]+)`", stmt, flags=re.I)
    if m:
        return m.group(1)
    m = re.search(r"INSERT INTO\s+([A-Za-z0-9_]+)", stmt, flags=re.I)
    if m:
        return m.group(1)
    return None

for stmt in iter_insert_statements(orig_text):
    # Only process if it's an INSERT INTO with backticks (MySQL style)
    if 'INSERT INTO `' not in stmt:
        # allow if it was double-quoted
        if 'INSERT INTO "' not in stmt:
            continue
    # Convert header (table/columns) backticks -> double quotes, values untouched
    converted_stmt = convert_insert_header(stmt)
    converted_stmt = sanitize_dates(converted_stmt)
    insert_stmts.append(converted_stmt)
    tbl = table_from_insert(converted_stmt)
    if tbl:
        insert_by_table.setdefault(tbl, []).append(converted_stmt)

# 3) Extract AUTO_INCREMENT hints
auto_inc_pat = re.compile(r"-- AUTO_INCREMENT for table `(?P<table>[^`]+)`.*?AUTO_INCREMENT=(?P<seed>\d+);", flags=re.I|re.S)
auto_incs = []
for m in auto_inc_pat.finditer(orig_text):
    tbl = m.group('table')
    seed = int(m.group('seed'))
    # Attempt to find AUTO_INCREMENT column from nearby MODIFY or table definition
    # Simple heuristic: look for 'MODIFY `col`' in the matched text
    matched_text = m.group(0)
    col_m = re.search(r"MODIFY `([^`]+)`", matched_text, flags=re.I)
    col = col_m.group(1) if col_m else None
    auto_incs.append((tbl, col, seed))

# Write output
with open(output_path, 'w', encoding='utf-8') as f:
    f.write('-- Rebuilt Postgres SQL for iCoachie (fixed v2)\n')
    f.write('-- Header/CREATE TABLE definitions from converted file\n\n')
    f.write(header)
    f.write('\n-- INSERT statements from original dump (headers converted to Postgres identifiers)\n')
    for s in insert_stmts:
        # Ensure terminated with semicolon and newline
        if not s.strip().endswith(';'):
            s = s.rstrip() + ';'
        f.write(s + '\n')

    # Append sequence creation statements
    f.write('\n-- Sequences for AUTO_INCREMENT columns\n')
    for tbl, col, seed in auto_incs:
        if col is None:
            continue
        seq_name = f"{tbl}_{col}_seq"
        f.write(f"DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relkind='S' AND relname='{seq_name}') THEN CREATE SEQUENCE {seq_name} START WITH {seed}; END IF; END$$;\n")
        f.write(f"ALTER TABLE \"{tbl}\" ALTER COLUMN \"{col}\" SET DEFAULT nextval('{seq_name}');\n")
        f.write(f"ALTER SEQUENCE {seq_name} OWNED BY \"{tbl}\".\"{col}\";\n")
        f.write(f"SELECT setval('{seq_name}', COALESCE(MAX(\"{col}\"), {seed})) FROM \"{tbl}\";\n")

print('Wrote fixed v2 SQL to:', output_path)

# 4) Write separate per-table SQL files
for tbl, inserts in insert_by_table.items():
    create_block = extract_table_create(conv_text, tbl)
    out_file = out_dir / f"{tbl}.sql"
    with open(out_file, 'w', encoding='utf-8') as pf:
        pf.write('-- Per-table SQL for {}\n'.format(tbl))
        if create_block:
            create_block = make_date_columns_nullable(create_block)
            pf.write(create_block + '\n')
        else:
            pf.write('-- WARNING: CREATE TABLE not found in converted header\n')
        for s in inserts:
            if not s.strip().endswith(';'):
                s = s.rstrip() + ';'
            pf.write(s + '\n')

        # sequences for this table only
        pf.write('\n-- Sequences for AUTO_INCREMENT columns (table-specific)\n')
        for t2, col2, seed2 in auto_incs:
            if t2 != tbl:
                continue
            if col2 is None:
                continue
            seq_name = f"{t2}_{col2}_seq"
            pf.write(f"DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relkind='S' AND relname='{seq_name}') THEN CREATE SEQUENCE {seq_name} START WITH {seed2}; END IF; END$$;\n")
            pf.write(f"ALTER TABLE \"{t2}\" ALTER COLUMN \"{col2}\" SET DEFAULT nextval('{seq_name}');\n")
            pf.write(f"ALTER SEQUENCE {seq_name} OWNED BY \"{t2}\".\"{col2}\";\n")
            pf.write(f"SELECT setval('{seq_name}', COALESCE(MAX(\"{col2}\"), {seed2})) FROM \"{t2}\";\n")
    print('Wrote per-table SQL for', tbl, '->', out_file)
