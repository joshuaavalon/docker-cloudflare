ARG BASE_IMAGE=node:18-alpine
ARG OVERLAY_VERSION=v2.2.0.1

FROM $BASE_IMAGE as builder

ARG OVERLAY_VERSION
WORKDIR /app

COPY packages /app/packages/
COPY package.json tsconfig.json package-lock.json /app/

RUN npm ci && \
    npm run build && \
    rm -rf packages/*/lib/__tests__

RUN mkdir /packages && \
    cp --parents -r packages/*/lib / && \
    cp --parents packages/*/package.json /

FROM $BASE_IMAGE

ARG OVERLAY_VERSION
ARG OVERLAY_ARCH
ARG TARGETARCH

WORKDIR /app

ENV NPM_CONFIG_PREFIX=/app/.npm
ENV CF_DNS_CONFIG=/app/config.yaml
ENV NODE_ENV=production
ENV CF_DNS__CRON='*/5 * * * *'
ENV NPM_CONFIG_UPDATE_NOTIFIER=false

COPY --from=builder /packages /app/packages/
COPY package.json package-lock.json index.mjs /app/
COPY docker/root/ /

RUN chmod +x /app/cloudflare.sh

RUN apk add --no-cache bash

SHELL ["/bin/bash", "-c"]

RUN apk add --no-cache --virtual=build-dependencies curl tar && \
    if [[ "$TARGETARCH" == arm* ]]; then OVERLAY_ARCH=arm; else OVERLAY_ARCH="$TARGETARCH"; fi && \
    curl -L "https://github.com/just-containers/s6-overlay/releases/download/${OVERLAY_VERSION}/s6-overlay-${OVERLAY_ARCH}.tar.gz" | tar xz -C / && \
    apk del --purge build-dependencies

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

ENTRYPOINT ["/init"]
CMD []
