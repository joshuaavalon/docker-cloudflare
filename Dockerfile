FROM alpine:3.6
MAINTAINER JoshuaAvalon

RUN apk add --update curl && \
    apk add --update bash && \
    apk add --update perl && \
    rm -rf /var/cache/apk/*

ADD cloudflare.sh /cloudflare.sh
RUN chmod +x /cloudflare.sh
ADD cron /var/spool/cron/crontabs/root

CMD /cloudflare.sh
CMD crond -f