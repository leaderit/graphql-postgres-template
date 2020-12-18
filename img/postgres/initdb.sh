#!/bin/sh

set -e

# Perform all actions as $POSTGRES_USER
export PGUSER="$POSTGRES_USER"

# Create the 'template_uuid' template db
"${psql[@]}" <<- 'EOSQL'
CREATE DATABASE template_uuid IS_TEMPLATE true;
EOSQL

# Load PostGIS into both template_database and $POSTGRES_DB
for DB in template_uuid "$POSTGRES_DB"; do
	echo "Loading UUID-OSSP extensions into $DB"
	"${psql[@]}" --dbname="$DB" <<-'EOSQL'
		CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
EOSQL
done
