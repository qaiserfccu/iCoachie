# Import testing instructions

This directory contains helper scripts to test importing the per-table SQL files created by `rebuild_postgres_sql_v2.py`.

Prerequisites:
- PostgreSQL server and client (psql, createdb, dropdb) on your machine.
- A user that can create databases.
- It's recommended to use a test database to avoid accidental corruption of production data.

Quick start example:

1) Generate per-table SQLs by running the rebuild script:

   python3 tools/rebuild_postgres_sql_v2.py

2) Create a test DB and import all per-table SQL files:

   ./tools/test_import_per_table.sh iCoachie_test --force

3) If you prefer to import a single table (e.g. `wp_level_program_chart`):

   psql -d icoachie_test -c "SET session_replication_role = replica; \i iCoachie_per_table_sql/wp_level_program_chart.sql; SET session_replication_role = DEFAULT;"

Notes and tips:
- The test script disables FK checks for the session by setting `session_replication_role = replica` during import, which can help avoid dependency ordering issues. After import, constraints should be validated.
- The script attempts to print row counts for each imported table.
- Sequence/auto-increment behaviors: the script tries to detect auto-increment metadata from the MySQL dump comments and create sequences for those columns. Please verify sequence values per table and set them accordingly if needed.
 - If you want more robust sequence handling: parse CREATE TABLE definitions in the original MySQL dump to detect `AUTO_INCREMENT` column names and explicitly create sequences and set defaults on those columns; you may also run `SELECT setval(seq, MAX(id))` afterwards.
 - Binary fields and BLOBs: Some MySQL BLOB fields may need special handling. If you encounter corrupted BLOB data, review the `mysql_unescape()` and `pg_escape_e_string()` functions in `rebuild_postgres_sql_v2.py` to ensure proper handling for byte sequences and character encodings.
- After successful imports, apply indexes and constraints from the converted `iCoachie_postgres.sql` header file, or run a script to re-apply them in the proper order.
 - If you encounter foreign key errors when applying constraints, import tables in dependency order, or temporarily disable FK checks (the test script does per-session disable during imports).
- If any import fails due to encoding, double-escaped strings, or unknown escape patterns, re-check `rebuild_postgres_sql_v2.py`'s escaping logic (`mysql_unescape` and `pg_escape_e_string`) and add more cases as needed.

If you'd like, I can further automate sequence detection and table dependency ordering (topological sort) to reliably import tables with FK constraints.

If you'd like, I can also:
- Add a file `tools/import_order.txt` with a computed topological ordering by reading FK constraints in the converted DDL.
- Enhance `rebuild_postgres_sql_v2.py` to detect `AUTO_INCREMENT` columns from the MySQL dump's CREATE TABLE blocks and add a more accurate sequence creation step.
