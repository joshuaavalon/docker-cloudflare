#!/bin/sh

cd /app

if [ "$CF_DNS__LOG_TYPE" == "json" ]; then
  exec s6-setuidgid node npm run --cache /home/node/.npm start:json;
else
  exec s6-setuidgid node npm run --cache /home/node/.npm start:pretty;
fi
