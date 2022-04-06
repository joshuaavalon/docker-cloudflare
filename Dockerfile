ARG BASE_IMAGE=node:16-alpine
ARG OVERLAY_VERSION=v2.2.0.1

FROM $BASE_IMAGE as builder

ARG OVERLAY_VERSION
WORKDIR /app

COPY packages /app/packages/
COPY package.json tsconfig.json package-lock.json /app/

RUN npm ci && \
    npm run build --workspaces -- --declaration false --sourceMap false && \
    rm -rf packages/*/lib/__tests__

RUN mkdir /packages && \
    cp --parents -r packages/*/lib / && \
    cp --parents packages/*/package.json /

FROM $BASE_IMAGE

ARG OVERLAY_VERSION
ARG OVERLAY_ARCH
ARG TARGETARCH

WORKDIR /app

ENV CLOUDFLARE_CONFIG=/app/config.yaml
ENV PUID=1001
ENV PGID=1001
ENV NODE_ENV=production
ENV CRON='0 */1 * * *'

COPY --from=builder /packages /app/packages/
COPY package.json package-lock.json /app/
COPY docker/root/ /

RUN chmod +x /app/cloudflare.sh

RUN apk add --no-cache bash

SHELL ["/bin/bash", "-c"]

RUN apk add --no-cache --virtual=build-dependencies curl tar && \
    if [[ "$TARGETARCH" == arm* ]]; then OVERLAY_ARCH=arm; else OVERLAY_ARCH="$TARGETARCH"; fi && \
    curl -L "https://github.com/just-containers/s6-overlay/releases/download/${OVERLAY_VERSION}/s6-overlay-${OVERLAY_ARCH}.tar.gz" | tar xz -C / && \
    apk del --purge build-dependencies

RUN npm install -g npm@latest && \
    npm ci

RUN apk add --no-cache shadow && \
    useradd -u 1001 -U -d /config -s /bin/false abc && \
    usermod -G users abc

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
