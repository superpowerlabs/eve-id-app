#!/usr/bin/env bash

docker run -it --rm \
  --name offficiallly-com-dev \
  -p 8987 \
  -v $PWD:/usr/src/app \
  -v $PWD/log:/var/log/offficiallly-com \
  -e NODE_ENV=development \
  -e VIRTUAL_HOST=offficiallly.com.localhost,blueprint.offficiallly.com.localhost \
  -w /usr/src/app node:16 npm run start
