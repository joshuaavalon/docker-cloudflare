# Cloudflare DDNS

[![GitHub Actions][actions-badge]][actions]
[![License][license-badge]][license]

Cloudflare DDNS is a Docker image that update DNS records on Cloudflare on schedule.

## Table of Content

- [Getting Started](#getting-started)
- [Guide](#guide)
  - [Authentication](#authentication)
    - [API Token](#api-token)
    - [Global API Key](#global-api-key)
    - [Zone ID](#zone-id)
  - [Configuration](#configuration)
    - [File](#file)
    - [Environment Variables](#environment-variables)
- [Migration](#migration)

## Getting Started

```bash
docker run -d -v ./config.yaml:/app/config.yaml ghcr.io/joshuaavalon/cloudflare-ddns:<TAG>
```

The Docker image now supports multiple architecture. `arm32v6` will no longer be used.
Because of Docker Hub removal of free team plan, `joshava/cloudflare-ddns` is no longer supported.

It is recommended to use tagged version instead of `latest`.

### Authentication

#### API Token

API Token is needed to set the DNS records.

See [API Token](./guide/api-token.md) on how to create it.

#### Global API Key

Global API is no longer supported. Please use [API token](#api-token).

#### Zone ID

Go to you domain overview page and scroll to the bottom. Copy the `Zone ID` in the API section.

![Zone ID](./guide/zone-id.png)

### Configuration

There are 2 types of configuration supported: environment variables or file.

Note that `CF_DNS__CRON` and `CF_DNS__LOG_TYPE` can only configure via environment variables because it is used before the application start.

From v3, you should use either environment variables or file configuration. They will no longer be merged. (Except `CF_DNS__CRON` and `CF_DNS__LOG_TYPE`)

You can verify your configuration with [JSON Schema](https://joshuaavalon.github.io/docker-cloudflare/config.schema.json)

For file configuration, the configuration should be place at `/app/config.yaml`. It can be changed by defining `CF_DNS__CONFIG` in environment variables.

```yaml
auth:
  scopedToken: QPExdfoNLwndJPDbt4nK1-yF1z_srC8D0m6-Gv_h
domains:
  - name: foo.example.com
    type: A
    proxied: true
    create: true
    zoneId: JBFRZWzhTKtRFWgu3X7f3YLX
```

See [configuration](./guide/configuration.md) for details.

## Migration

See [migration](./guide/migration.md) for details.

[actions-badge]: https://github.com/joshuaavalon/docker-cloudflare/workflows/Main/badge.svg
[actions]: https://github.com/joshuaavalon/docker-cloudflare/actions
[license]: https://github.com/joshuaavalon/docker-cloudflare/blob/master/LICENSE
[license-badge]: https://img.shields.io/github/license/joshuaavalon/docker-cloudflare.svg
