FROM alpine:3.6
MAINTAINER JoshuaAvalon

RUN apk add --update curl && \
    apk add --update bash && \
    apk add --update perl && \
    rm -rf /var/cache/apk/*

RUN mkdir /app

ADD cloudflare.sh /app

WORKDIR "/app"

CMD [ "sh", "cloudflare.sh" ]