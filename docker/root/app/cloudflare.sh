#!/usr/bin/env bash

cd /app;

if [ "$CF_DNS__LOG_TYPE" == "json" ]; then
  su node -c "npm run --cache /home/node/.npm start:json";
else
  su node -c "npm run --cache /home/node/.npm start:pretty";
fi
