#!/bin/sh

cd /app

if [ "$CF_DNS__LOG_TYPE" == "json" ]; then
  exec s6-setuidgid abc npm run start:json;
else
  exec s6-setuidgid abc npm run start:pretty;
fi
