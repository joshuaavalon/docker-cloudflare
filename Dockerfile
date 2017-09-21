FROM alpine:3.6

ADD cloudflare.sh /cloudflare.sh
ADD cron /var/spool/cron/crontabs/root

RUN apk add --update curl && \
    rm -rf /var/cache/apk/* && \
    chmod +x /cloudflare.sh

CMD /cloudflare.sh && \
    crond -f