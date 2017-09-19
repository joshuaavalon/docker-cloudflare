FROM alpine:3.6
MAINTAINER JoshuaAvalon

RUN apk add --update curl && \
    rm -rf /var/cache/apk/*

ADD cloudflare.sh /app

WORKDIR "/app"

CMD [ "sh", "cloudflare.sh" ]