ARG BASE_IMAGE=node:18-alpine

FROM $BASE_IMAGE as builder

WORKDIR /app

ENV NPM_CONFIG_UPDATE_NOTIFIER=false
ENV NPM_CONFIG_LOGLEVEL=warn

COPY src /app/src/
COPY package.json package-lock.json tsconfig.json rollup.config.js /app/

RUN npm ci && \
    npm run rollup

FROM $BASE_IMAGE
RUN apk add --no-cache bash

WORKDIR /app

ENV NPM_CONFIG_PREFIX=/app/.npm
ENV NPM_CONFIG_UPDATE_NOTIFIER=false
ENV NPM_CONFIG_LOGLEVEL=warn
ENV NODE_ENV=production
ENV CF_DNS__CONFIG=/app/config.yaml
ENV CF_DNS__CRON='*/5 * * * *'

COPY --from=builder /app/dist/ /app/dist/
COPY package.json package-lock.json /app/
COPY docker/root/ /

RUN npm i -D pino-pretty && \
    chmod +x /app/cloudflare.sh

SHELL ["/bin/bash", "-c"]
ENTRYPOINT ["/app/cloudflare.sh"]
CMD []
