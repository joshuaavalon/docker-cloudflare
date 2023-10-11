ARG BASE_IMAGE=node:18-alpine

FROM $BASE_IMAGE as builder

WORKDIR /app

COPY packages /app/packages/
COPY package.json tsconfig.json package-lock.json /app/

RUN npm ci && \
    npm run build

RUN mkdir /packages && \
    cp --parents -r dist /

FROM $BASE_IMAGE

WORKDIR /app

ENV NPM_CONFIG_PREFIX=/app/.npm
ENV CF_DNS__CONFIG=/app/config.yaml
ENV NODE_ENV=production
ENV CF_DNS__CRON='*/5 * * * *'
ENV NPM_CONFIG_UPDATE_NOTIFIER=false
ENV NPM_CONFIG_LOGLEVEL=warn

COPY --from=builder /packages /app/packages/
COPY package.json package-lock.json index.mjs /app/
COPY docker/root/ /

RUN chmod +x /app/cloudflare.sh /app/start.sh

RUN apk add --no-cache bash

SHELL ["/bin/bash", "-c"]

RUN npm ci

ENV ZONE=
ENV HOST=
ENV EMAIL=
ENV API=
ENV TTL=
ENV PROXY=
ENV DEBUG=
ENV FORCE_CREATE=
ENV RUNONCE=
ENV IPV6=

ENTRYPOINT ["/app/start.sh"]
CMD []
