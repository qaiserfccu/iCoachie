# iCoachie PostgreSQL Import

This project contains a PostgreSQL-compatible SQL script generated from the provided MySQL dump `evaluation_mysql_dump.sql`.

Files:
- `iCoachie_postgres.sql` — Converted SQL file which creates database `iCoachie`, tables, inserts data, and sets sequences for auto-increment columns.
- `tools/mysql_to_postgres.py` — The Python conversion script used to generate the SQL. It's heuristic-based and may require manual review.

How to import into PostgreSQL (recommended):

1. Create (or reuse) a Postgres instance and be sure you can run `psql`.
2. Run the SQL file to create the database and objects (the SQL file creates the database). Example commands:

```bash
# Option A: Run inside psql as a superuser
psql -f iCoachie_postgres.sql

# Option B: If you prefer to create the DB manually, then connect and run the SQL
createdb iCoachie -E UTF8
psql -d iCoachie -f iCoachie_postgres.sql
```

Notes & Manual Checks (⚠️ important):
- The conversion is heuristic-based and may not be perfect. Review the resulting schema for:
  - `AUTO_INCREMENT` columns: these are converted to sequences where detected, but review if your application expects `SERIAL` types or `BIGSERIAL`.
  - `ENUM` types: converted to `TEXT` (not Postgres `ENUM`) — if you need strict validation consider creating `CREATE TYPE` for enum sets.
  - `tinyint(1)` is mapped to `boolean`, and other `tinyint` mapped to `smallint`.
  - `DATETIME` and `TIMESTAMP`: converted to `timestamp without time zone`. If you need timezone-aware timestamps, switch to `timestamp with time zone`.
  - `DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`: these values drop the `ON UPDATE` part in conversion; if your app expects this behavior, add a trigger to update timestamp on row update.
  - Indexes and constraints: Primary keys and some `UNIQUE` constraints are preserved. Other `KEY`/`INDEX` definitions are converted to `CREATE INDEX` commands at the bottom of the file (basic conversion — please review index names and uniqueness semantics).
  - Character sets/collations: The script sets the new DB encoding to `UTF8` and removes collation settings; if you require specific collations add them manually.
  - Stored procedures/triggers/events are not converted automatically. If the dump contains stored procedures or functions, review and manually port them to PL/pgSQL.

Troubleshooting:
- If `psql` fails due to encoding or locale, re-create the `iCoachie` DB with a specific LC_COLLATE/LC_CTYPE and re-run.

If you want, I can:
- Improve the converter script to transform `ENUM`, `ON UPDATE` to triggers, or attempt to preserve more MySQL features.
- Run a more thorough second pass to convert `KEY` lines into better `CREATE INDEX` statements including expression indexes and fill in unique flags.

If you'd like, tell me what level of fidelity (low/medium/high) you want for the conversion and I will iterate further.
