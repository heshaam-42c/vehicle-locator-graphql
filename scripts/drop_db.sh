#!/usr/bin/env bash
set -euo pipefail

# Interactive script to drop a MongoDB database using mongosh.
# Prompts for a MongoDB URI (defaults to localhost), the database name,
# requires typing the DB name to confirm, then runs mongosh to drop it.

if ! command -v mongosh >/dev/null 2>&1; then
  echo "Error: mongosh is not installed or not on PATH."
  echo "Install from https://www.mongodb.com/try/download/shell or use your package manager."
  exit 2
fi

MONGO_URI="${MONGO_URI:-mongodb://localhost:27017}"

if [[ -n "${1:-}" ]]; then
  DBNAME="$1"
else
  read -r -p "Database to drop: " DBNAME
fi

if [[ -z "${DBNAME// /}" ]]; then
  echo "No database name provided. Aborting."
  exit 1
fi

echo "Dropping database '${DBNAME}'..."
if mongosh "$MONGO_URI" --eval "db.getSiblingDB('$DBNAME').dropDatabase()"; then
  echo "Database '${DBNAME}' dropped successfully."
  exit 0
else
  echo "Failed to drop database '${DBNAME}'."
  exit 3
fi

# End of script