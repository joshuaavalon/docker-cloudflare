# Introduction

[![GitHub Actions][actions-badge]][actions]
[![Docker Pulls][docker-pull]][docker]
[![Docker Stars][docker-star]][docker]
[![Docker Image Size][docker-size]][docker-tag]
[![Docker Layer][docker-layer]][docker-tag]
[![License][license-badge]][license]
[![semantic-release][semantic-release-badge]][semantic-release]

Cloudflare DDNS is a Docker image that update DNS records on Cloudflare on schedule.

## Release

`master` branch will be built by GitHub Actions weekly and push to `latest` and `arm32v6` to receive latest security update from upstream images.

All arm32v6 images will have a `arm32v6` prefix on tags.

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
[semantic-release]: https://github.com/semantic-release/semantic-release
[semantic-release-badge]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
