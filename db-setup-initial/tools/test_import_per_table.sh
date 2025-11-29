#!/usr/bin/env bash
set -euo pipefail

# Test import script for per-table SQL files
# Usage: ./tools/test_import_per_table.sh [db-name] [--force]
# Example: ./tools/test_import_per_table.sh iCoachie_test --force

DB_NAME=${1:-iCoachie_test}
FORCE=${2:-}
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PER_TABLE_DIR="$ROOT/iCoachie_per_table_sql"

if ! command -v psql >/dev/null 2>&1; then
  echo "psql not found in PATH. Please install PostgreSQL client and ensure psql is available."
  exit 1
fi

echo "Per-table SQL directory: $PER_TABLE_DIR"
if [ ! -d "$PER_TABLE_DIR" ]; then
  echo "Per-table dir not found: $PER_TABLE_DIR" >&2
  exit 2
fi

# Drop and recreate DB (optional) - use with care
if psql -U qaisu -h localhost -lqt | cut -d \| -f 1 | grep -qw "$DB_NAME"; then
  if [ "$FORCE" = "--force" ]; then
    echo "Dropping existing DB $DB_NAME"
    dropdb -U qaisu -h localhost "$DB_NAME"
  else
    echo "Database $DB_NAME already exists. Re-run with --force to drop and recreate (dangerous)."
    exit 3
  fi
fi

echo "Creating database $DB_NAME" 
createdb -U qaisu -h localhost "$DB_NAME"

# Import per-table SQL files one-by-one. Each file should contain CREATE TABLE and INSERTs.
# We temporarily disable FK constraints while importing to avoid dependency issues.

for sql in "$PER_TABLE_DIR"/*.sql; do
  tbl=$(basename "$sql" .sql)
  echo
  echo "========================"
  echo "Importing table: $tbl from file: $sql"
  echo "-------------------------"
  # Use psql to run the file in a single session with constraints disabled
  psql -U qaisu -h localhost -d "$DB_NAME" -c "SET session_replication_role = replica;" -f "$sql" -c "SET session_replication_role = DEFAULT;" -v ON_ERROR_STOP=1

  # validate row count (if table exists)
  set +e
  COUNT=$(psql -U qaisu -h localhost -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM \"$tbl\";" | tr -d '[:space:]')
  rc=$?
  set -e
  if [ $rc -eq 0 ]; then
    echo "Imported table $tbl with rows: $COUNT"
  else
    echo "Unable to determine count for $tbl (might not have been created)"
  fi
done

echo
echo "All per-table imports attempted. If no errors were shown, tables were created and filled." 

# Suggest running a final pass to create indexes/constraints if missing
echo "Next steps: Apply indexes, constraints, and run integrity checks as needed." 
