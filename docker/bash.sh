#!/usr/bin/env bash

host=offficiallly-com

if [[ $1 != '' ]]; then
  host=$1
fi

docker exec -it $host bash
