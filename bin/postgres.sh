#!/usr/bin/env bash

# inside .env
# POSTGRES_USER=postgres
# POSTGRES_PASSWORD=iKANTknowIT
# POSTGRES_DB=eve_app
# PGDATA=`pwd`/pgdata

source .env && docker run -d \
    --name eve-postgres \
    --restart unless-stopped \
    -p 5434:5432 \
    -v $PGDATA:/var/lib/postgresql/data/pgdata \
    -e PGDATA=/var/lib/postgresql/data/pgdata \
    -e POSTGRES_PASSWORD=$POSTGRES_PASSWORD \
    -e POSTGRES_USER=$POSTGRES_USER \
    -e POSTGRES_DB=$POSTGRES_DB \
    postgres:13


