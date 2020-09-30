

ARG BASE_IMAGE=node:10-alpine
ARG OVERLAY_VERSION=v1.22.1.0
ARG OVERLAY_ARCH=amd64

FROM $BASE_IMAGE as builder

ARG OVERLAY_VERSION
ARG OVERLAY_ARCH
WORKDIR /app

COPY src  /app/src
COPY package.json tsconfig.json /app/

RUN npm install && \
    npm run build

FROM $BASE_IMAGE

ARG OVERLAY_VERSION
ARG OVERLAY_ARCH
WORKDIR /app

ENV CLOUDFLARE_CONFIG=/app/config.yaml \
    PUID=1001 \
    PGID=1001

COPY --from=builder /app/lib /app/lib
COPY package.json /app/
COPY docker/root/ /

RUN npm install --production && \
    apk add --no-cache --virtual=build-dependencies curl tar && \
    apk add --no-cache shadow && \
    curl -o /tmp/s6-overlay.tar.gz -L "https://github.com/just-containers/s6-overlay/releases/download/${OVERLAY_VERSION}/s6-overlay-${OVERLAY_ARCH}.tar.gz" && \
    tar xfz /tmp/s6-overlay.tar.gz -C / && \
    chmod +x /app/cloudflare.sh && \
    useradd -u 1001 -U -d /config -s /bin/false abc && \
    usermod -G users abc && \
    apk del --purge build-dependencies && \
    rm -rf /tmp/*

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
