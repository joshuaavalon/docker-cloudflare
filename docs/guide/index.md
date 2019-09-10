# Getting Started

To get started, you must have the followings ready:

- One of the authentication methods
  - [API Token (Recommended)](./cloudflare.html#api-token)
  - [Global API Key](./cloudflare.html#global-api-key)
- [Zone ID (Optional)](./cloudflare.html#zone-id)

## Usage

First, Create a configuration file `config.yaml`.

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

::: tip
See the full configuration [here](./configuration.html).
:::

Then, run the following command.

```bash
docker run -d -v ./config.yaml:/app/config.yaml joshava/cloudflare-ddns
```
