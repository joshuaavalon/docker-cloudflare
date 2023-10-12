ARG BASE_IMAGE=node:20-alpine

FROM $BASE_IMAGE as builder

WORKDIR /app

ENV NPM_CONFIG_UPDATE_NOTIFIER=false
ENV NPM_CONFIG_LOGLEVEL=warn

COPY src /app/src/
COPY package.json tsconfig.json package-lock.json /app/

RUN npm ci && \
    npm run rollup

FROM $BASE_IMAGE

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

RUN chmod +x /app/cloudflare.sh /app/start.sh

RUN apk add --no-cache bash

SHELL ["/bin/bash", "-c"]

RUN npm ci

ENTRYPOINT ["/app/start.sh"]
CMD []
