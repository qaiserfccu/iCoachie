#!/usr/bin/env python3
"""
Rebuild a PostgreSQL SQL file by combining the converted CREATE TABLE definitions
(kept in iCoachie_postgres.sql) and the original raw INSERT statements from the
MySQL dump, converted safely by replacing backticks with double quotes around
identifiers but leaving the values intact.

Output: iCoachie_postgres_fixed.sql
"""
import re
from pathlib import Path

root = Path('/Users/qaisu/Downloads/iCoachie')
converted = root / 'iCoachie_postgres.sql'
orig = root / 'evaluation_mysql_dump.sql'
fixed = root / 'iCoachie_postgres_fixed.sql'

conv_text = converted.read_text(encoding='utf-8', errors='ignore')
orig_text = orig.read_text(encoding='utf-8', errors='ignore')

# Extract the portion with CREATE TABLE definitions from converted
# We'll take everything until the first "INSERT INTO" occurrence in the converted file
insert_marker = '\nINSERT INTO '
marker_idx = conv_text.find(insert_marker)
if marker_idx == -1:
    # If not found, take entire file as header
    header = conv_text
else:
    header = conv_text[:marker_idx]

# Next: collect all INSERT INTO statements from the original dump.
# We'll preserve everything from "INSERT INTO `...`" to a following ";" (including multiline).
insert_stmt_pat = re.compile(r"INSERT INTO `(?P<table>[^`]+)`\s*\((?:[^)]+)\)\s*VALUES\s*(?P<vals>\(.*?\));", flags=re.I|re.S)
# re.S so that .* includes newlines. This may capture each individual INSERT statement.

insert_stmts = []
for m in insert_stmt_pat.finditer(orig_text):
    stmt = m.group(0)
    # Replace backticks around table name with double quotes (safe): only the main identifier, not data
    stmt = re.sub(r"INSERT INTO `(.*?)`", r"INSERT INTO \"\1\"", stmt)
    # Replace identifiers in column list backticks with double quotes
    stmt = re.sub(r"`([A-Za-z0-9_]+)`", r"\"\1\"", stmt)
    insert_stmts.append(stmt)

# Some dumps might contain multi-row inserts that we captured, but in case some inserts are very large, the regex may still find them.
# We'll just append all found insert statements in order.

# Now gather AUTO_INCREMENT lines for sequences
auto_inc_pat = re.compile(r"-- AUTO_INCREMENT for table `(.*?)`.*?MODIFY `(.*?)` .*?AUTO_INCREMENT.*?AUTO_INCREMENT=(\d+);", flags=re.I|re.S)
auto_incs = []
for m in auto_inc_pat.finditer(orig_text):
    tbl = m.group(1)
    col = m.group(2)
    seed = int(m.group(3))
    # create sequences to match
    auto_incs.append((tbl, col, seed))

# Write the fixed file
with open(fixed, 'w', encoding='utf-8') as f:
    f.write('-- Rebuilt Postgres SQL for iCoachie (fixed version)\n')
    f.write('-- Header and CREATE TABLE definitions from converted file\n')
    f.write(header)
    f.write('\n-- INSERT statements copied from original (converted to Postgres quoting)\n')
    for s in insert_stmts:
        # Make sure it ends with semicolon
        if not s.strip().endswith(';'):
            s = s.rstrip() + ';'
        f.write(s + '\n')
    # append sequence creation statements
    f.write('\n-- Sequences for AUTO_INCREMENT columns\n')
    for tbl, col, seed in auto_incs:
        seq_name = f"{tbl}_{col}_seq"
        f.write(f"DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relkind='S' AND relname='{seq_name}') THEN CREATE SEQUENCE {seq_name} START WITH {seed}; END IF; END$$;\n")
        f.write(f"ALTER TABLE \"{tbl}\" ALTER COLUMN \"{col}\" SET DEFAULT nextval('{seq_name}');\n")
        f.write(f"ALTER SEQUENCE {seq_name} OWNED BY \"{tbl}\".\"{col}\";\n")
        f.write(f"SELECT setval('{seq_name}', COALESCE(MAX(\"{col}\"), {seed})) FROM \"{tbl}\";\n")

print('Wrote fixed SQL to:', fixed)

