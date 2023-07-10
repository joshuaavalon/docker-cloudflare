#!/usr/bin/env bash

cd /app;
su - node;

if [ "$CF_DNS__LOG_TYPE" == "json" ]; then
  npm run --cache /home/node/.npm start:json;
else
  npm run --cache /home/node/.npm start:pretty;
fi
