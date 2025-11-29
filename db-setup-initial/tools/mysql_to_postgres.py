#!/usr/bin/env python3
"""
Basic MySQL -> PostgreSQL conversion script for the provided dump.
This is a heuristic-based converter — it handles many common parts of phpMyAdmin dumps:
- Removes MySQL-specific commands
- Converts backticks to double quotes
- Converts types (tinyint, int, bigint, varchar, text, datetime, timestamp, enum)
- Converts AUTO_INCREMENT into SERIAL/BIGSERIAL and generates sequence set commands
- Converts DEFAULT CURRENT_TIMESTAMP and ON UPDATE CURRENT_TIMESTAMP (keeps default, drops ON UPDATE)
- Converts indexes/keys into Postgres syntax (partial)

Usage:
  python3 mysql_to_postgres.py /path/to/evaluation_mysql_dump.sql > iCoachie_postgres.sql

Note: This is not a perfect converter. Manually review the generated SQL for special cases, functions, triggers, stored procedures, or engine-specific options.
"""

import re
import sys
from pathlib import Path

INPUT_FILE = Path(sys.argv[1]) if len(sys.argv) > 1 else Path('evaluation_mysql_dump.sql')

def read_file(p):
    return p.read_text(encoding='utf-8', errors='ignore')

content = read_file(INPUT_FILE)

# Remove MySQL-specific directives
content = re.sub(r"/\*!40101 SET .*?\*/;\n", "", content, flags=re.S)
content = re.sub(r"/\*!.*?\*/;\n", "", content, flags=re.S)
content = re.sub(r"^SET SQL_MODE.*?;\n", "", content, flags=re.M)
content = re.sub(r"^SET @@SESSION.*?;\n", "", content, flags=re.M)
content = re.sub(r"^START TRANSACTION;\n", "BEGIN;\n", content, flags=re.M)
content = re.sub(r"^COMMIT;\n", "COMMIT;\n", content, flags=re.M)
content = re.sub(r"^SET time_zone.*?;\n", "", content, flags=re.M)
content = re.sub(r"^LOCK TABLES .*;\n", "", content, flags=re.M)
content = re.sub(r"^UNLOCK TABLES;\n", "", content, flags=re.M)

# Replace `db_name` statements; we'll create our own DB
content = re.sub(r"-- Database: `.*?`.*?--", "", content, flags=re.S)
content = re.sub(r"^CREATE DATABASE .*?;\n", "", content, flags=re.M)
content = re.sub(r"^USE `.*?`;\n", "", content, flags=re.M)

# Replace backticks with double quotes
content = content.replace('`', '"')

# Drop MySQL engine and charset statements at end of CREATE TABLE
content = re.sub(r"\)\s*ENGINE=.*?DEFAULT CHARSET=.*?;", ") ;", content, flags=re.I)
content = re.sub(r"\)\s*ENGINE=.*?;", ") ;", content, flags=re.I)

# Remove COLLATE markers and CHARACTER SET markers in column definitions
content = re.sub(r" CHARACTER SET [^ ,]*", "", content)
content = re.sub(r" COLLATE [^ ,]*", "", content)

# type mappings function

def map_type(col_def):
    orig = col_def
    c = col_def
    # tinyint(1) -> boolean
    c = re.sub(r"tinyint\(1\)( unsigned)?", "boolean", c, flags=re.I)
    # tinyint(n) -> smallint
    c = re.sub(r"tinyint\((\d+)\)( unsigned)?", "smallint", c, flags=re.I)
    # int|integer(11) -> integer
    c = re.sub(r"\bint\(\d+\) unsigned", "integer", c, flags=re.I)
    c = re.sub(r"\bint\(\d+\)", "integer", c, flags=re.I)
    # bigint -> bigint
    c = re.sub(r"bigint\(\d+\)", "bigint", c, flags=re.I)
    c = re.sub(r"int unsigned", "bigint", c, flags=re.I)
    # double/float -> double precision
    c = re.sub(r"\bdouble\b", "double precision", c, flags=re.I)
    c = re.sub(r"\bfloat\b", "double precision", c, flags=re.I)
    # datetime/timestamp
    c = re.sub(r"\bdatetime\b", "timestamp without time zone", c, flags=re.I)
    c = re.sub(r"\btimestamp\b", "timestamp without time zone", c, flags=re.I)
    # text is OK. Replace tinytext/mediumtext/longtext -> text
    c = re.sub(r"\btinytext\b|\bmediumtext\b|\blongtext\b", "text", c, flags=re.I)
    # mediumint -> integer
    c = re.sub(r"\bmediumint\(\d+\)\b", "integer", c, flags=re.I)
    # tinyint(3) etc already covered above
    # enum('a','b') -> varchar or text (we'll use text). Could add CREATE TYPE separately but keep as text.
    c = re.sub(r"enum\([^)]*\)", "text", c, flags=re.I)
    # remove unsigned
    c = re.sub(r" unsigned\b", "", c, flags=re.I)

    # DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -> DEFAULT CURRENT_TIMESTAMP
    c = re.sub(r"DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP", "DEFAULT CURRENT_TIMESTAMP", c, flags=re.I)

    return c

# Convert CREATE TABLE blocks and track auto-increment columns and indexes
from io import StringIO

output = StringIO()
output.write('-- Converted from MySQL dump to PostgreSQL by mysql_to_postgres.py\n')
output.write("-- Please review for special cases such as stored procedures and triggers.\n\n")
output.write("CREATE DATABASE \"iCoachie\" WITH ENCODING 'UTF8';\n")
output.write("\n-- Connect to database (psql meta-command)\n\\c \"iCoachie\"\n\n")

# split content into statements by 'CREATE TABLE' or 'INSERT INTO' or 'DROP TABLE' etc.
pattern = re.compile(r"(CREATE TABLE \".*?\"\s*\(.*?\);)|(^INSERT INTO \".*?;)|(^DROP TABLE .*?;)|(^ALTER TABLE .*?;)|(^--.*$)|(^/\*.*?\*/;)|(^SET .*?;)|(^LOCK TABLES .*?;)|(^UNLOCK TABLES;)", flags=re.I|re.M|re.S)

# Instead of splitting, we'll manually iterate to process CREATE TABLE blocks and INSERTs

# Find all CREATE TABLE blocks
create_blocks = []
for match in re.finditer(r"CREATE TABLE \"(.*?)\"\s*\((.*?)\)\s*;", content, flags=re.S|re.I):
    table_name = match.group(1)
    block = match.group(0)
    create_blocks.append((match.start(), match.end(), table_name, block))

# Sort blocks by start position
create_blocks.sort()

# We'll replace them with converted versions

last_idx = 0
cursor = 0

auto_sequences = []  # list of (table, column)
indexes = []  # list of (table, index_name, cols, unique)

# We'll iterate through the content and write preamble until create blocks; after conversion we'll process inserts

converted_tables = {}

for start, end, table, block in create_blocks:
    # write content before this create block to output, but skip MySQL specific statements
    before = content[last_idx:start]
    # remove USE or CREATE DATABASE statements
    before = re.sub(r"^\s*USE \".*?\";\n", "", before, flags=re.M)
    before = re.sub(r"^\s*CREATE DATABASE .*?;\n", "", before, flags=re.M)
    # Copy other statements (like comments) prepped
    if before.strip():
        output.write('\n-- Skipped MySQL statements from source\n')
        # We could further filter but for simplicity we skip
    
    # Convert the CREATE TABLE block
    body = block
    # Extract all lines inside parentheses
    inner = re.search(r"CREATE TABLE \".*?\"\s*\((.*?)\)\s*;", body, flags=re.S|re.I).group(1)
    lines = []
    # split by commas but be careful: commas in enum and definitions. We'll split by lines
    for line in inner.split('\n'):
        line = line.rstrip().strip()
        if not line:
            continue
        lines.append(line.rstrip(','))

    cols_out = []
    pk_cols = []
    uniq_constraints = []
    for line in lines:
        # Handle PRIMARY KEY
        if re.match(r"PRIMARY KEY\s*\(\".*?\"\)", line, flags=re.I):
            # e.g., PRIMARY KEY ("id")
            pk = re.search(r"PRIMARY KEY\s*\((.*?)\)", line, flags=re.I).group(1)
            pk_cols.append(pk)
            # We'll include it later in table definition.
            continue
        # Handle UNIQUE KEY or UNIQUE INDEX
        m = re.match(r"UNIQUE KEY \"(.*?)\"\s*\((.*?)\)", line, flags=re.I)
        if m:
            ixname = m.group(1)
            cols = m.group(2)
            uniq_constraints.append((ixname, cols))
            continue
        # Handle KEY or INDEX lines - we convert to CREATE INDEX statements later
        m2 = re.match(r"KEY \"(.*?)\"\s*\((.*?)\)", line, flags=re.I)
        if m2:
            ixname = m2.group(1)
            cols = m2.group(2)
            indexes.append((table, ixname, cols, False))
            continue
        # Handle column definition lines - e.g., "id" int(11) NOT NULL AUTO_INCREMENT,
        mcol = re.match(r'"(?P<col>[^\"]+)"\s+(?P<rest>.*)', line)
        if mcol:
            col = mcol.group('col')
            rest = mcol.group('rest')
            original_rest = rest
            # type mapping
            rest = map_type(rest)
            # remove `DEFAULT gen_random_uuid()` style functions? Keep as is.
            # handle auto_increment
            if 'AUTO_INCREMENT' in original_rest.upper():
                # Use SERIAL if integer
                if re.search(r"bigint", rest, flags=re.I):
                    rest = re.sub(r"\bbigint\b.*", "bigserial", rest, flags=re.I)
                else:
                    rest = re.sub(r"\binteger\b.*", "serial", rest, flags=re.I)
                auto_sequences.append((table, col))
                # If rest still has NOT NULL or DEFAULT, remove duplicates in case
                rest = re.sub(r"\bAUTO_INCREMENT\b", "", original_rest, flags=re.I)
            # Clean charset or unsigned leftovers
            rest = re.sub(r"\bAUTO_INCREMENT\b", "", rest, flags=re.I)
            rest = re.sub(r"\b\(\d+\)\b", lambda m: m.group(0), rest)
            # Remove comments
            rest = re.sub(r"COMMENT\s+'.*'", "", rest, flags=re.I)
            # Ensure boolean default 0/1 becomes false/true
            mdef = re.search(r"DEFAULT\s+([0-9]+)", rest)
            if mdef and re.search(r"\bboolean\b", rest, flags=re.I):
                val = mdef.group(1)
                if val in ['1', '0']:
                    val2 = 'TRUE' if val == '1' else 'FALSE'
                    rest = re.sub(r"DEFAULT\s+([0-9]+)", f"DEFAULT {val2}", rest, flags=re.I)
            # Trim multiple spaces and return
            rest = re.sub(r"\s+", " ", rest).strip()
            if rest.endswith(','):
                rest = rest[:-1]
            cols_out.append((col, rest))
            continue
        # fallback: ignore other lines

    # Build new CREATE TABLE
    output.write(f"\n-- Creating table {table}\n")
    output.write(f"CREATE TABLE \"{table}\" (\n")
    for col, rest in cols_out:
        output.write(f"    \"{col}\" {rest},\n")
    # Add primary key if any
    if pk_cols:
        for pk in pk_cols:
            output.write(f"    PRIMARY KEY ({pk}),\n")
    for ux in uniq_constraints:
        ixname, cols = ux
        output.write(f"    CONSTRAINT \"{ixname}\" UNIQUE ({cols}),\n")
    # Remove trailing comma by overwriting last char: we'll write an explicit end
    output.seek(output.tell() - 2, 0)  # back up to delete last comma newline (works in memory)
    # But StringIO doesn't allow seeking like that safely - simpler to write by removing final " ,\n"
    # We'll do a new approach: collect lines and join

    # Rebuild with safer approach
    pass

# The above attempt to write with StringIO and seek is too complicated; we'll instead regenerate properly

# Re-start conversion in a cleaner way: gather create table statements and generate them properly.

def convert_create_table_block(table_name, block):
    inner = re.search(r"CREATE TABLE \".*?\"\s*\((.*?)\)\s*;", block, flags=re.S|re.I).group(1)
    lines = []
    for line in inner.split('\n'):
        line = line.strip()
        if not line:
            continue
        # remove trailing commas for easier handling
        if line.endswith(','):
            line = line[:-1]
        lines.append(line)

    col_defs = []
    pks = []
    constraints = []
    index_creates = []
    for line in lines:
        # PRIMARY KEY
        mPK = re.match(r"PRIMARY KEY\s*\((.*?)\)", line, flags=re.I)
        if mPK:
            pks.append(mPK.group(1).strip())
            continue
        # UNIQUE KEY
        mUK = re.match(r"UNIQUE KEY \"(.*?)\"\s*\((.*?)\)", line, flags=re.I)
        if mUK:
            name = mUK.group(1)
            cols = mUK.group(2)
            constraints.append((name, cols))
            continue
        # KEY
        mK = re.match(r"KEY \"(.*?)\"\s*\((.*?)\)", line, flags=re.I)
        if mK:
            name = mK.group(1)
            cols = mK.group(2)
            index_creates.append((table_name, name, cols))
            continue
        # If column def
        mcol = re.match(r'"(?P<col>[^\"]+)"\s+(?P<rest>.*)', line)
        if not mcol:
            # skip unknown lines (FULLTEXT, etc.) but comment them
            # We'll preserve as comment
            constraints.append(('__commented__', line))
            continue
        col = mcol.group('col')
        rest = mcol.group('rest')
        # Handle AUTO_INCREMENT
        is_auto = 'AUTO_INCREMENT' in rest.upper()
        rest = map_type(rest)
        # If tinyint(1) boolean default with 0/1 to false/true
        if re.search(r"\bboolean\b", rest, flags=re.I):
            rest = re.sub(r"DEFAULT\s+(')?0(')?", "DEFAULT FALSE", rest, flags=re.I)
            rest = re.sub(r"DEFAULT\s+(')?1(')?", "DEFAULT TRUE", rest, flags=re.I)
        if is_auto:
            # Replace any integer/serial mapping
            if re.search(r"bigint", rest, flags=re.I):
                rest = re.sub(r"bigint[^(, ]*", "bigserial", rest, flags=re.I)
            else:
                # Use serial
                rest = re.sub(r"integer[^(, ]*|int[^(, ]*", "serial", rest, flags=re.I)

        # Remove MySQL-specific DEFAULT expressions like COLLATE
        rest = re.sub(r"DEFAULT\s+\'\'", "DEFAULT ''", rest)
        rest = re.sub(r"COMMENT\s+'.*'", "", rest, flags=re.I)

        # Remove double spaces
        rest = re.sub(r"\s+", " ", rest).strip()

        col_defs.append((col, rest))

    # Build SQL
    sql_lines = [f"-- Table: {table_name}", f"CREATE TABLE \"{table_name}\" ("]
    for col, rest in col_defs:
        sql_lines.append(f"    \"{col}\" {rest},")
    # Add constraints
    if pks:
        for pk in pks:
            sql_lines.append(f"    PRIMARY KEY ({pk}),")
    for name, cols in constraints:
        if name == '__commented__':
            # This is not a real constraint; comment out
            sql_lines.append(f"    /* {cols} */ ,")
        else:
            sql_lines.append(f"    CONSTRAINT \"{name}\" UNIQUE ({cols}),")

    # remove last comma and close
    if sql_lines[-1].endswith(','):
        sql_lines[-1] = sql_lines[-1][:-1]
    sql_lines.append(") ;\n")

    return "\n".join(sql_lines), index_creates

output = StringIO()
output.write('-- Converted dump for iCoachie (Postgres syntax)\n')
output.write("CREATE DATABASE \"iCoachie\" WITH ENCODING 'UTF8';\n\n")
output.write("-- Connect using psql: \n-- psql -d iCoachie -f thisfile.sql\n\n")

# Process create blocks
for start, end, table, block in create_blocks:
    sql, idxs = convert_create_table_block(table, block)
    output.write(sql)
    for idx in idxs:
        indexes.append(idx)

# Next: process the rest of the file to find INSERT INTO statements and write them with double quotes
# We'll take any `INSERT INTO `table` ...;` occurrences and simply replace backticks (already double quotes) and MySQL hex/escape handling

for m in re.finditer(r"INSERT INTO \"(.*?)\"\s*\((.*?)\)\s*VALUES\s*(\(.*?\));", content, flags=re.I|re.S):
    # This simplistic match handles many but may not capture multi-row inserts; improved handling follows
    pass

# A more robust approach: write inserts by scanning for lines starting with INSERT INTO
# Extract multi-line INSERT INTO statements
for m in re.finditer(r"(INSERT INTO \".*?\;)", content, flags=re.I|re.S):
    stmt = m.group(1)
    # MySQL uses escaped newlines; keep content as-is but ensure semicolon at end
    # Convert `NULL` and other MySQL constants keep them as-is
    # Replace any occurrences of double spaces
    stmt = stmt.replace('\r\n', '\n')
    output.write(stmt + '\n')

# After inserts, add sequence corrections
# Fix repeated timestamp mapping issue that could produce duplicate 'without time zone'
out_str = output.getvalue()
out_str = re.sub(r"timestamp without time zone without time zone", "timestamp without time zone", out_str)
out_str = re.sub(r"  +", " ", out_str)
output = StringIO()
output.write(out_str)
output.write('\n-- Set sequences for SERIAL columns to max(id)\n')
# For each auto-increment detected, generate setval using pg_get_serial_sequence
for table, col in auto_sequences:
    # Use pg_get_serial_sequence('"table"', 'col') to get the sequence and set it to max(col)
    output.write(f"SELECT setval(pg_get_serial_sequence('\"{table}\"', '{col}'), COALESCE(MAX(\"{col}\"), 1)) FROM \"{table}\";\n")

# Also pick up AUTO_INCREMENT hints from MODIFY statements (phpMyAdmin style) and create sequences for them
auto_increment_matches = []
for m in re.finditer(r"-- AUTO_INCREMENT for table \"(.*?)\".*?MODIFY \"(.*?)\" .*?AUTO_INCREMENT.*?AUTO_INCREMENT=(\d+);", content, flags=re.I|re.S):
    tbl = m.group(1)
    col = m.group(2)
    seed = int(m.group(3))
    auto_increment_matches.append((tbl, col, seed))

for tbl, col, seed in auto_increment_matches:
    seq_name = f"{tbl}_{col}_seq"
    output.write(f"DO $$ BEGIN IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relkind='S' AND relname='{seq_name}') THEN CREATE SEQUENCE {seq_name} START WITH {seed}; END IF; END$$;\n")
    output.write(f"ALTER TABLE \"{tbl}\" ALTER COLUMN \"{col}\" SET DEFAULT nextval('{seq_name}');\n")
    output.write(f"ALTER SEQUENCE {seq_name} OWNED BY \"{tbl}\".\"{col}\";\n")
    output.write(f"SELECT setval('{seq_name}', COALESCE(MAX(\"{col}\"), {seed})) FROM \"{tbl}\";\n")

# Add index creation statements
output.write('\n-- Index creation (converted from MySQL KEY definitions)\n')
for tb, name, cols in indexes:
    # ensure name isn't too long for Postgres; we will prefix with idx_
    idx_name = re.sub(r'[^a-zA-Z0-9_]', '_', name)
    cols_clean = ",".join([f'\"{c.strip()}\"' for c in cols.split(',')])
    output.write(f"CREATE INDEX IF NOT EXISTS \"idx_{idx_name}\" ON \"{tb}\" ({cols_clean});\n")

# Save output
saved = INPUT_FILE.parent / 'iCoachie_postgres.sql'
with open(saved, 'w', encoding='utf-8') as f:
    f.write(output.getvalue())

print(f"Converted SQL written to: {saved}")
