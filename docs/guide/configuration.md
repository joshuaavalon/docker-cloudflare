# Configuration

## File

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
    webhook:
      run: https://example.com/webhook/start
      success: https://example.com/webhook/success
      failure: https://example.com/webhook/failure
```

### Format

It supports YAML with `.yaml`, `.yml` and JSON with `.json`.

### Validation

It can be validation through [JSON schema][schema]. There are many online validators, text editor (including VS Code) and IDE supports it.

### Details

- `api`: Default to `https://api.cloudflare.com/client/v4/`. This is the base API url. It should not be changed.

- `auth`: It defines authentication with API. Use one of the following:
  - `scopedToken`: APK token.
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
- `ipv4` & `ipv6`: List of IP echo services to be used. It support JSON and plain text response.

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

- `fields`: It is the location of IP address in the response.

**Plain text response**

```yaml
type: text
url: https://ipv4.example.com
```

#### Full configuration

```yaml
api: https://api.cloudflare.com/client/v4/
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

## Environment Variables

::: tip
Configuration through environment variables is legacy support. For all the new features, you need to use configuration file.
:::

::: tip
If configuration file is found, environment variables are ignored.
:::

| Parameters   | Default | Description                                                                                                                |
| ------------ | ------- | -------------------------------------------------------------------------------------------------------------------------- |
| \*ZONE       |         | Domain, e.g. `example.com`.                                                                                                |
| \*HOST       |         | DNS record to be updated, e.g. `example.com`, `subdomain.example.com`.                                                     |
| \*EMAIL      |         | Cloudflare Email                                                                                                           |
| \*API        |         | Cloudflare API key                                                                                                         |
| PROXY        | true    | Whether the record is receiving the performance and security benefits of Cloudflare. `true` to enable; `false` to disable. |
| FORCE_CREATE |         | When set, a record will be created if one does not exist already.                                                          |
| IPV6         |         | When set, update IPv6 instead of IPv4.                                                                                     |
| PUID         |         | User ID used by the script.                                                                                                |
| PGID         |         | Group ID used by the script.                                                                                               |

\* These parameters are required.

[schema]: ../config.schema.json
