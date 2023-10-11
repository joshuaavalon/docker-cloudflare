# Configuration

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

## Options

`Env` is used for acronym that stands for environment variables below.

For `File`, `.` is used for nested keys.

`0` is stand for first items in array. You can replace it other numbers if you have more than 1 items.

### Cron

- Env: `CF_DNS__CRON`
- File: N/A
- Default: `*/5 * * * *`

Control the schedule of this application run.

Changed from `CRON` in v2.

### Log Type

- Env: `CF_DNS__LOG_TYPE`
- File: N/A
- Default: N/A

Set to `json` for JSON log output.

### API

- Env: `CF_DNS__API`
- File: `api`
- Default: `https://api.cloudflare.com/client/v4/`

Cloudflare v4 API endpoint.

### Timeout

- Env: `CF_DNS__TIMEOUT`
- File: `timeout`
- Default: 5000

Timeout for network request. Disable if timeout <= 0.

### Log Level

- Env: `CF_DNS__LOG_LEVEL`
- File: `logLevel`
- Default: `info`

### API Token

- Env: `CF_DNS__AUTH__SCOPED_TOKEN`
- File: `auth.scopedToken`
- Default: N/A

See [API token](./api-token.md) for details.

### Domain Name

- Env: `CF_DNS__DOMAINS_0__NAME`
- File: `domains[0].name`
- Default: N/A

Domain that needed to be updated.

### Domain Type

- Env: `CF_DNS__DOMAINS_0__TYPE`
- File: `domains[0].type`
- Default: `A`

DNS record type. It should be `A` or `AAAA`.

### Domain Proxied

- Env: `CF_DNS__DOMAINS_0__PROXIED`
- File: `domains[0].proxied`
- Default: `true`

Enable Cloudflare proxy or not.

### Domain Create

- Env: `CF_DNS__DOMAINS_0__CREATE`
- File: `domains[0].create`
- Default: `false`

`true` to create record if not exists.

### Domain Zone ID

- Env: `CF_DNS__DOMAINS_0__ZONE_ID`
- File: `domains[0].zoneId`
- Default: N/A

_Optional_. Zone ID of the domain to be updated.

If you do not provide zone ID, the API token needs `#zone:read` to obtain the zone ID.

See [API token](./api-token.md) for details.

### Domain Zone Name

- Env: `CF_DNS__DOMAINS_0__ZONE_NAME`
- File: `domains[0].zoneId`
- Default: N/A

_Optional_. Base domain of the domain to be updated.

It is not needed if `zoneId` is set. If you do not provide zone name, it will try to guess from the domain name.

### Domain Webhook Run

- Env: `CF_DNS__DOMAINS_0__WEBHOOK_0__RUN`
- File: `domains[0].webhook[0].run`
- Default: N/A

_Optional._ Fired before update run.

### Domain Webhook Success

- Env: `CF_DNS__DOMAINS_0__WEBHOOK_0__SUCCESS`
- File: `domains[0].webhook[0].success`
- Default: N/A

_Optional._ Fired after update success.

### Domain Webhook Failure

- Env: `CF_DNS__DOMAINS_0__WEBHOOK_0__FAILURE`
- File: `domains[0].webhook[0].failure`
- Default: N/A

_Optional._ Fired after update failure.

### Domain Webhook Formatter

- Env: N/A
- File: `domains[0].webhook[0].formatter`
- Default: N/A

_Optional._ Format message for webhook. Only JavaScript configuration is supported.

```typescript
export type WebhookFormatter = (
  status: string,
  response?: unknown
) => Promise<any> | any;
```

### IPv4 / IPv6 Echo Services

See [IP echo service](./ip-echo-service.md) for details.

### Echo Parsers

See [echo parser](./echo-parser.md) for details.

## Full Configuration

```yaml
api: https://api.cloudflare.com/client/v4/
timeout: 5000
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
  - type: ini
    url: https://1.1.1.1/cdn-cgi/trace
    fields:
      - ip
  - type: json
    url: https://api.ipify.org?format=json
    fields:
      - ip
ipv6:
  - type: ini
    url: https://[2606:4700:4700::1111]/cdn-cgi/trace
    fields:
      - ip
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

module.exports = {
  api: "https://api.cloudflare.com/client/v4/",
  timeout: 5000,
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
      url: "https://1.1.1.1/cdn-cgi/trace",
      fields: ["ip"]
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
      url: "https://[2606:4700:4700::1111]/cdn-cgi/trace",
      fields: ["ip"]
    },
    {
      type: "json",
      url: "https://api6.ipify.org?format=json",
      fields: ["ip"]
    }
  ]
};
```
