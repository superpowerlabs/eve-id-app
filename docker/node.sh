#!/usr/bin/env bash

docker stop offficiallly-com
docker rm offficiallly-com

docker run -d \
  --name offficiallly-com \
  -p 8987 \
  --restart unless-stopped \
  -v $PWD:/usr/src/app \
  -v /vol/log/offficiallly-com_app:/var/log/offficiallly-com_app \
  -e NODE_ENV=production \
  -e VIRTUAL_HOST=offficiallly.com,blueprint.offficiallly.com \
  -e LETSENCRYPT_HOST=offficiallly.com,blueprint.offficiallly.com \
  -e LETSENCRYPT_EMAIL=offficiallly@sullo.co \
  -w /usr/src/app node:16 npm run start
