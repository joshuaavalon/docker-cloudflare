#!/usr/bin/env bash

cd /app

if [ "$CF_DNS__LOG_TYPE" == "json" ]; then
  sudo -u node npm run --cache /home/node/.npm start:json;
else
  sudo -u node npm run --cache /home/node/.npm start:pretty;
fi
