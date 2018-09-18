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
 * Smaller size: 4MB vs 54MB
 * Able to update subdomain
 * Update when IP is changed

## Usage

### Running once interactively

```
docker run \
    -e RUNONCE=1 \
    -e ZONE=example.com \
    -e HOST=example.com \
    -e EMAIL=example@example.com \
    -e API=1111111111111111 \
    -e TTL=1 \
    -e PROXY=true \
joshuaavalon/cloudflare-ddns
```

### Running as a daemon

```
docker run \
    -d \
    -e ZONE=example.com \
    -e HOST=example.com \
    -e EMAIL=example@example.com \
    -e API=1111111111111111 \
    -e TTL=1 \
    -e PROXY=true \
joshuaavalon/cloudflare-ddns
```


## Parameters
`ZONE`: Domain, e.g. example.com.

`HOST`: DNS record to be updated, e.g. example.com, subdomain.example.com.

`EMAIL`: Cloudflare Email.

`API`: Cloudflare API key.

`TTL`: (OPTIONAL) Time to live for DNS record. Value of 1 is 'automatic'. Min value:120; Max value:2147483647. Default: `1`

`PROXY`: (OPTIONAL) Whether the record is receiving the performance and security benefits of Cloudflare. `true` to enable; `false` to disable. Default: `true`

`FORCE_CREATE`: (OPTIONAL) When set, a record will be created if one does not exist already.

`RUNONCE`: (OPTIONAL) When set, only a single update is attempted, and the script exists without setting up a cron process.

## Running on a raspberry pi

Unfortunately dockerhub doesn't support automatic builds for the ARM architecture so this container has to be built manually. Luckily the container is easy and quick to build.

To build simply clone this repo:

```
git clone https://github.com/joshuaavalon/docker-cloudflare.git
```

Then build the container using the alternate Dockerfile:

```
docker build \
    -f Dockerfile.arm32v6 \
    -t joshuaavalon/cloudflare-ddns:arm32v6
```

The newly built container can now be used by substituting `joshuaavalon/cloudflare-ddns` for `joshuaavalon/cloudflare-ddns:arm32v6` in the usage commands.
