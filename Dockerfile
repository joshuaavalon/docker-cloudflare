

ARG BASE_IMAGE=node:10-alpine

FROM $BASE_IMAGE as builder

WORKDIR /app

COPY src  /app/src
COPY package.json tsconfig.json /app/

RUN npm install && \
    npm run build

FROM $BASE_IMAGE

ENV CLOUDFLARE_CONFIG=/app/config.yaml \
    PUID=1001 \
    PGID=1001

WORKDIR /app

COPY --from=builder /app/lib /app/lib
COPY package.json /app/
COPY docker/root/ /

RUN npm install --production && \
    apk add --no-cache shadow && \
    chmod +x /app/cloudflare.sh && \
    chmod +x /app/init.sh && \
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

CMD /app/init.sh
