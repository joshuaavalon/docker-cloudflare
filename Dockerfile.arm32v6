FROM arm32v6/alpine:3.6

ADD cloudflare.sh /cloudflare.sh
ADD crontab /var/spool/cron/crontabs/root

ENV ZONE= \
    HOST= \
    EMAIL= \
    API= \
    TTL= \
    PROXY= \
    DEBUG= \
    FORCE_CREATE= \
    RUNONCE=

RUN apk add --update bash jq curl && \
    rm -rf /var/cache/apk/* && \
    chmod +x /cloudflare.sh

CMD /cloudflare.sh && \
    test -z "$RUNONCE" && crond -f
