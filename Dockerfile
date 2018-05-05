FROM alpine:3.6

ADD cloudflare.sh /cloudflare.sh
ADD cron /var/spool/cron/crontabs/root

ENV ZONE=example.com \
    HOST=example.com \
    EMAIL=example@example.com \
    API=1111111111111111 \
    TTL=1 \
    PROXY=true \
    DEBUG=false

RUN apk add --update jq curl && \
    rm -rf /var/cache/apk/* && \
    chmod +x /cloudflare.sh

CMD /cloudflare.sh && \
    crond -f