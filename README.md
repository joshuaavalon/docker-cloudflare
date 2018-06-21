# joshuaavalon/cloudflare-ddns
[![version](https://images.microbadger.com/badges/version/joshuaavalon/cloudflare-ddns.svg)](https://microbadger.com/images/joshuaavalon/cloudflare-ddns)
[![](https://images.microbadger.com/badges/image/joshuaavalon/cloudflare-ddns.svg)](https://microbadger.com/images/joshuaavalon/cloudflare-ddns)
![Docker Pulls](https://img.shields.io/docker/pulls/joshuaavalon/cloudflare-ddns.svg)
![Docker Stars](https://img.shields.io/docker/stars/joshuaavalon/cloudflare-ddns.svg?colorB=dfb317)
[![Docker Automated build](https://img.shields.io/docker/automated/joshuaavalon/cloudflare-ddns.svg)](https://hub.docker.com/r/joshuaavalon/cloudflare-ddns/)
[![Docker build](https://img.shields.io/docker/build/joshuaavalon/cloudflare-ddns.svg)](https://hub.docker.com/r/joshuaavalon/cloudflare-ddns/)
[![MIT](https://img.shields.io/github/license/joshuaavalon/docker-cloudflare.svg)](https://github.com/docker-cloudflare/blob/master/LICENSE)

The is a simple docker using curl to update DNS record on [Cloudflare](https://www.cloudflare.com). Inspired by [rasmusbe/cloudflare-update-record.sh](https://gist.github.com/rasmusbe/fc2e270095f1a3b41348/)

Compare to [nouchka/cloudflare-dyndns](https://hub.docker.com/r/nouchka/cloudflare-dyndns/) (4.0):
 * Smaller size: 3MB vs 54MB
 * Able to update subdomain
 * Update when IP is changed

## Usage
```
docker run  \
	-d \
	-e ZONE=example.com \
	-e HOST=example.com \
	-e EMAIL=example@example.com \
	-e API=1111111111111111 \
	-e TTL=1 \
	-e PROXY=true \
	--name cloudflare \
joshuaavalon/cloudflare-ddns
```

## Parameters
`ZONE`: Domain, e.g. example.com.

`HOST`: DNS record to be updated, e.g. example.com, subdomain.example.com.

`EMAIL`: Cloudflare Email.

`API`: Cloudflare API key.

`TTL`: (OPTIONAL) Time to live for DNS record. Value of 1 is 'automatic'. Min value:120; Max value:2147483647. Default: `1`

`PROXY`: (OPTIONAL) Whether the record is receiving the performance and security benefits of Cloudflare. `true` to enable; `false` to disable. Default: `true`
