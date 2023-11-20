#!/usr/bin/env bash

chown node:node /app;

if [ "$CF_DNS__LOG_TYPE" == "json" ]; then
  su node -c "npm run --cache /home/node/.npm start:json";
else
  su node -c "npm run --cache /home/node/.npm start:pretty";
fi
