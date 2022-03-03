#!/usr/bin/env bash

pm2 start index.js -i max --name arg3 && pm2 save
