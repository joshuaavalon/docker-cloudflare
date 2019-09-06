#!/bin/sh

PUID=${PUID:-1001}
PGID=${PGID:-1001}

groupmod -o -g "$PGID" abc
usermod -o -u "$PUID" abc

chown abc:abc /app

/app/cloudflare.sh && test -z "$RUNONCE" && crond -f
