#!/bin/bash
source .env

export PGPASSWORD=$PG_PASSWORD
database="reviewsdb"

echo "Configuring database: $database"

dropdb -U node_user reviewsdb
createdb -U node_user reviewsdb

psql -U node_user reviewsdb < ./src/bin/sql/reviews.sql

echo "$database configured"