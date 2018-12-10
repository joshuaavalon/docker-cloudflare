# Cloudflare DDNS

[![Travis CI Build][travis-badge]][travis]
[![Docker Pulls][docker-pull]][docker] 
[![Docker Stars][docker-star]][docker] 
[![Docker Image Size][docker-size]][docker-tag] 
[![Docker Layer][docker-layer]][docker-tag]
[![License][license-badge]][license]

The is a simple docker using curl to update DNS record on [Cloudflare][cloudflare]. Inspired by [rasmusbe/cloudflare-update-record.sh][rasmusbe].

> The image have moved from [joshuaavalon/docker-cloudflare][joshuaavalon] to [joshava/cloudflare-ddns][docker].
You can read [here][details] for more details.

## Usage

```bash
docker run \
    -d \
    -e ZONE=example.com \
    -e HOST=foo.example.com \
    -e EMAIL=example@example.com \
    -e API=1111111111111111 \
joshava/cloudflare-ddns
```

## Release

`master` branch will be build by Travis CI weekly and push to `latest` and `arm32v6` to receive latest security update from upstream images.

All arm32v6 images will have a `arm32v6` prefix on tags.

## Documentation

Read the full documentation [here][documentation].

[travis-badge]: https://img.shields.io/travis/joshuaavalon/docker-cloudflare.svg
[travis]: https://travis-ci.org/joshuaavalon/docker-cloudflare/
[docker]: https://hub.docker.com/r/joshava/cloudflare-ddns/
[docker-tag]: https://hub.docker.com/r/joshava/cloudflare-ddns/tags/
[docker-pull]: https://img.shields.io/docker/pulls/joshava/cloudflare-ddns.svg
[docker-star]: https://img.shields.io/docker/stars/joshava/cloudflare-ddns.svg
[docker-size]: https://img.shields.io/microbadger/image-size/joshava/cloudflare-ddns.svg
[docker-layer]: https://img.shields.io/microbadger/layers/joshava/cloudflare-ddns.svg
[license]: https://github.com/docker-cloudflare/blob/master/LICENSE
[license-badge]: https://img.shields.io/github/license/joshuaavalon/docker-cloudflare.svg
[cloudflare]: https://www.cloudflare.com
[rasmusbe]: https://gist.github.com/rasmusbe/fc2e270095f1a3b41348/
[documentation]: https://joshuaavalon.github.io/docker-cloudflare/
[joshuaavalon]: https://hub.docker.com/r/joshuaavalon/cloudflare-ddns/
[details]: https://joshuaavalon.github.io/docker-cloudflare/faq/
