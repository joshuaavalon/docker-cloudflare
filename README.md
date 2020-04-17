# Cloudflare DDNS

[![GitHub Actions][actions-badge]][actions]
[![Docker Pulls][docker-pull]][docker]
[![Docker Stars][docker-star]][docker]
[![Docker Image Size][docker-size]][docker-tag]
[![Docker Layer][docker-layer]][docker-tag]
[![License][license-badge]][license]
[![semantic-release][semantic-release-badge]][semantic-release]

Cloudflare DDNS is a Docker image that update DNS records on Cloudflare on schedule.

```bash
docker run -d -v ./config.yaml:/app/config.yaml joshava/cloudflare-ddns
```

Read the full documentation [here][documentation].

[actions-badge]: https://github.com/joshuaavalon/docker-cloudflare/workflows/Main/badge.svg
[actions]: https://github.com/joshuaavalon/docker-cloudflare/actions
[docker]: https://hub.docker.com/r/joshava/cloudflare-ddns/
[docker-tag]: https://hub.docker.com/r/joshava/cloudflare-ddns/tags/
[docker-pull]: https://img.shields.io/docker/pulls/joshava/cloudflare-ddns.svg
[docker-star]: https://img.shields.io/docker/stars/joshava/cloudflare-ddns.svg
[docker-size]: https://img.shields.io/microbadger/image-size/joshava/cloudflare-ddns.svg
[docker-layer]: https://img.shields.io/microbadger/layers/joshava/cloudflare-ddns.svg
[license]: https://github.com/docker-cloudflare/blob/master/LICENSE
[license-badge]: https://img.shields.io/github/license/joshuaavalon/docker-cloudflare.svg
[documentation]: https://joshuaavalon.github.io/docker-cloudflare/
[semantic-release-badge]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-release]: https://github.com/semantic-release/semantic-release
