# Cloudflare DDNS

[![GitHub Actions][actions-badge]][actions]
[![Docker Pulls][docker-pull]][docker]
[![Docker Stars][docker-star]][docker]
[![Docker Image Size][docker-size]][docker-tag]
[![Docker Layer][docker-layer]][docker-tag]
[![License][license-badge]][license]
[![semantic-release][semantic-release-badge]][semantic-release]

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
- [Frequently Asked Questions](#frequently-asked-questions)

## Getting Started

```bash
docker run -d -v ./config.yaml:/app/config.yaml joshava/cloudflare-ddns
```

The Docker image now supports multiple architecture. `arm32v6` will no longer be used.

Because of Docker Hub new limitation, you can now pull from `ghcr.io/joshuaavalon/cloudflare-ddns`.

## Guide

To get started, you must have the followings ready:

- One of the authentication methods
  - [API Token (Recommended)](#api-token)
  - [Global API Key](#global-api-key)
- [Zone ID (Optional)](#zone-id)

### Authentication

At August 30, 2019,[Cloudflare announces the general availability of API tokens][api-token-blog]. API tokens limit the privileges each token has. The reason behind is [principle of least privilege][least-privilege]. Thus, API tokens are the recommended way to handle authentication.

#### API Token

First, go to your profile page and access the API Tokens page. Click `Create Token`.

![API Tokens page](./guide/api-token.png)

Then, create a token with `#dns_records:edit` and `#zone:read` (optional).

> `#zone:read` is needed if you want to use zone name instead of zone id. If you copy and paste the zone id to configuration, `#zone:read` is not needed.

> The token can be limited to specific zones in `Zone Resources`.

![Create API token](./guide/create-token.png)

After that, click `Continue to summary` and `Create Token`. Note that the token needed to be copied, it will not be shown again after this. It can be deleted and create a new one anytime needed.

#### Global API Key

> Global API key is deprecated. Although it is still supported with Cloudflare API, this Docker image will deprecate it in favor of API token. The support for global API key will be removed in future release.

Go to your profile page and access the API Tokens page. Click `View` on Global API Key.

![API Tokens page](./guide/api-token.png)

#### Zone ID

Go to you domain overview page and scroll to the bottom. Copy the `Zone ID` in the API section.

![Zone ID](./guide/zone-id.png)

[api-token-blog]: https://blog.cloudflare.com/api-tokens-general-availability/
[least-privilege]: https://en.wikipedia.org/wiki/Principle_of_least_privilege

### Configuration

#### File

The configuration should be place at `/app/config.yaml`. It can be changed by defining `CLOUDFLARE_CONFIG` in environment variables.

This is the minimum configuration needed.

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

It supports YAML with `.yaml`, `.yml`, JSON with `.json` and JavaScript file that export a object. It can be validation through [JSON schema][schema]. There are many online validators, text editor (including VS Code) and IDE supports it.

- `api`: Default to `https://api.cloudflare.com/client/v4/`. This is the base API url. It should not be changed.
- `logLevel`: Default to `info`. Please refer to [Winston](https://github.com/winstonjs/winston#logging-levels).
- `auth`: It defines authentication with API. Use one of the following:
  - `scopedToken`: API token.
  - `email`: Cloudflare Email; `globalToken`: Global API key.
- `domains`: List of domains to be updated.
  - `name`: Domain name to be updated.
  - `type`: DNS record type. It should be `A` or `AAAA`.
  - `proxied`: Enable Cloudflare proxied or not.
  - `create`: `true` to create record if not exists.
  - `zoneId`: [Zone ID](./cloudflare.html#zone-id) of the record.
  - `zoneName`: It is not needed if `zoneId` is set. Root domain of the domain name. It requires `#zone:read` for API token.
  - `webhook`: _Optional._ Webhook for update
    - `run`: _Optional._ Fired before update run.
    - `success`: _Optional._ Fired after update success.
    - `failure`: _Optional._ Fired after update failure.
    - `formatter`: _Optional._ Only available via JS config.  
      `(status: string, data?: unknown) => Promise<Record<string, unknown> | undefined> | Record<string, unknown> | undefined`.  
      `status` can be `run`, `success`, `failure`.  
      `data` is `undefined` for `run`, Cloudflare response result for `success` and `CloudflareApiError` for `failure`.
- `ipv4` & `ipv6`: List of IP echo services to be used. It support JSON, INI and plain text response.

**JSON response**

```yaml
type: json
url: https://ipv4.example.com
fields:
  - a
  - b
```

```json
{
  "a": {
    "b": "192.168.1.1"
  }
}
```

**INI response**

```yaml
type: ini
url: https://1.1.1.1/cdn-cgi/trace
field: ip
```

```ini
ip=1.1.1.1
visit_scheme=https
```

- `fields`: It is the location of IP address in the response.

**Plain text response**

```yaml
type: text
url: https://ipv4.example.com
```

**Full Configuration**

```yaml
api: https://api.cloudflare.com/client/v4/
logLevel: info
auth:
  scopedToken: QPExdfoNLwndJPDbt4nK1-yF1z_srC8D0m6-Gv_h
domains:
  - name: foo.example.com
    type: A
    proxied: true
    create: true
    zoneId: JBFRZWzhTKtRFWgu3X7f3YLX
    webhook:
      run: https://example.com/webhook/start
      success: https://example.com/webhook/success
      failure: https://example.com/webhook/failure
ipv4:
  - type: json
    url: https://v4.ident.me/.json
    fields:
      - address
  - type: json
    url: https://api.ipify.org?format=json
    fields:
      - ip
ipv6:
  - type: json
    url: https://v6.ident.me/.json
    fields:
      - address
  - type: json
    url: https://api6.ipify.org?format=json
    fields:
      - ip
```

```js
const formatter = (status, data) => {
  if (status === "run") {
    return { content: "Updating DNS record." };
  } else {
    return { content: JSON.stringify(data) };
  }
};

const config = {
  api: "https://api.cloudflare.com/client/v4/",
  logLevel: "info",
  auth: {
    scopedToken: "QPExdfoNLwndJPDbt4nK1-yF1z_srC8D0m6-Gv_h"
  },
  domains: [
    {
      name: "foo.example.com",
      type: "A",
      proxied: true,
      create: true,
      zoneId: "JBFRZWzhTKtRFWgu3X7f3YLX",
      webhook: {
        run: "https://example.com/webhook/start",
        success: "https://example.com/webhook/success",
        failure: "https://example.com/webhook/failure",
        formatter
      }
    }
  ],
  ipv4: [
    {
      type: "json",
      url: "https://v4.ident.me/.json",
      fields: ["address"]
    },
    {
      type: "json",
      url: "https://api.ipify.org?format=json",
      fields: ["ip"]
    }
  ],
  ipv6: [
    {
      type: "json",
      url: "https://v6.ident.me/.json",
      fields: ["address"]
    },
    {
      type: "json",
      url: "https://api6.ipify.org?format=json",
      fields: ["ip"]
    }
  ]
};

module.exports = config;
```

#### Environment Variables

> Configuration through environment variables is legacy support. For all the new features, you need to use configuration file.

> If configuration file is found, environment variables are ignored.

| Parameters   | Default           | Description                                                                                                                |
| ------------ | ----------------- | -------------------------------------------------------------------------------------------------------------------------- |
| \*ZONE       |                   | Domain, e.g. `example.com`.                                                                                                |
| \*HOST       |                   | DNS record to be updated, e.g. `example.com`, `subdomain.example.com`.                                                     |
| \*EMAIL      |                   | Cloudflare Email                                                                                                           |
| \*API        |                   | Cloudflare API key                                                                                                         |
| PROXY        | true              | Whether the record is receiving the performance and security benefits of Cloudflare. `true` to enable; `false` to disable. |
| FORCE_CREATE |                   | When set, a record will be created if one does not exist already.                                                          |
| IPV6         |                   | When set, update IPv6 instead of IPv4.                                                                                     |
| PUID         |                   | User ID used by the script.                                                                                                |
| PGID         |                   | Group ID used by the script.                                                                                               |
| CRON         | \*\/5 \* \* \* \* | DDNS update schedule.                                                                                                      |

\* These parameters are required.

[schema]: ./src/config/config.schema.json

## Migration

To migrate from 1.X, there is nothing to needed to be updated. However, note that `RUNONCE` is not supported any more. You can override entry point instead. `TTL` is no longer supported as Cloudflare does not allow to change it anymore.

## Frequently Asked Questions

**Q. Why do you move your image from joshuaavalon/docker-cloudflare to joshava/cloudflare-ddns?**

A. There are several reasons for me to make this decision.

First, DockerHub automatic build service is bad. Not only it is slow, it does not support multiple build well.
The rebuild on upstream image updated does not even work. so I have to move to a CI service.

However, DockerHub does not support access token (seriously?) which means you have to put your DockerHub password on the CI service. I do not want to risk leaking my account password so I create a bot account for CI usage.

Furthermore, DockerHub personal account does not support collaborators. so, I have to create a organize account or convert my account to organize. Because I want to keep my current account, so I create `joshava` (because I am poor at naming things 🤷‍♂️).

**Q. How do I run this on Raspberry Pi?**

A. Use image with `arm32v6` tags.

**Q. Why do you stop using bash script?**

A. It will be too complex to implement all the new features in bash script.

**Q. Why do not you use \<other language\>?**

A. Other scripting language I know is TypeScript and Python. While Python is a good choice, I like static typings for type hint in IDE. Typing in Python is very incomplete and many libraries does not support it. On the other hand, there are much more JavaScript libraries that have TypeScript definitions.

**Q. Why do you support \<other format\> for configuration file?**

A. You can open a feature request. If many people votes for it, I may consider it.

[actions-badge]: https://github.com/joshuaavalon/docker-cloudflare/workflows/Main/badge.svg
[actions]: https://github.com/joshuaavalon/docker-cloudflare/actions
[docker]: https://hub.docker.com/r/joshava/cloudflare-ddns/
[docker-tag]: https://hub.docker.com/r/joshava/cloudflare-ddns/tags/
[docker-pull]: https://img.shields.io/docker/pulls/joshava/cloudflare-ddns.svg
[docker-star]: https://img.shields.io/docker/stars/joshava/cloudflare-ddns.svg
[docker-size]: https://img.shields.io/microbadger/image-size/joshava/cloudflare-ddns.svg
[docker-layer]: https://img.shields.io/microbadger/layers/joshava/cloudflare-ddns.svg
[license]: https://github.com/joshuaavalon/docker-cloudflare/blob/master/LICENSE
[license-badge]: https://img.shields.io/github/license/joshuaavalon/docker-cloudflare.svg
[documentation]: https://joshuaavalon.github.io/docker-cloudflare/
[semantic-release-badge]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-release]: https://github.com/semantic-release/semantic-release
