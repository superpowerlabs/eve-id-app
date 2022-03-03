#!/usr/bin/env bash

docker exec -it leaderboard-postgres psql -h localhost -U postgres


#cat syn-nfts-app/.env | grep POSTGRES_PASSWORD
#psql -h ape-postgres.cluster-cwhpvz5qygqs.us-east-2.rds.amazonaws.com -p 5432 -U postgres -W
