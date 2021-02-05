

ARG BASE_IMAGE=node:lts-alpine
ARG OVERLAY_VERSION=v2.1.0.2

FROM $BASE_IMAGE as builder

ARG OVERLAY_VERSION
WORKDIR /app

COPY src  /app/src
COPY package.json tsconfig.json package-lock.json /app/

RUN npm ci && \
    npm run build

FROM $BASE_IMAGE

ARG OVERLAY_VERSION
ARG OVERLAY_ARCH
ARG TARGETARCH

WORKDIR /app

ENV CLOUDFLARE_CONFIG=/app/config.yaml \
    PUID=1001 \
    PGID=1001 \
    NODE_ENV=production

COPY --from=builder /app/lib /app/lib
COPY package.json package-lock.json /app/
COPY docker/root/ /

RUN apk add --no-cache bash
SHELL ["/bin/bash", "-c"]

RUN apk add --no-cache --virtual=build-dependencies curl tar && \
    if [[ "$TARGETARCH" == arm* ]]; then OVERLAY_ARCH=arm; else OVERLAY_ARCH="$TARGETARCH"; fi && \
    curl -L "https://github.com/just-containers/s6-overlay/releases/download/${OVERLAY_VERSION}/s6-overlay-${OVERLAY_ARCH}.tar.gz" | tar xz -C / && \
    apk del --purge build-dependencies

RUN npm ci && \
    chmod +x /app/cloudflare.sh

RUN apk add --no-cache shadow && \
    useradd -u 1001 -U -d /config -s /bin/false abc && \
    usermod -G users abc

ENV ZONE= \
    HOST= \
    EMAIL= \
    API= \
    TTL= \
    PROXY= \
    DEBUG= \
    FORCE_CREATE= \
    RUNONCE= \
    IPV6=

ENTRYPOINT ["/init"]
CMD []
