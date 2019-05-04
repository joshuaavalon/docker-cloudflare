# Configuration

| Parameters   | Default | Description                                                                                                                                                                              |
| ------------ | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| \*ZONE       |         | Domain, e.g. `example.com`.                                                                                                                                                              |
| \*HOST       |         | DNS record to be updated, e.g. `example.com`, `subdomain.example.com`.                                                                                                                   |
| \*EMAIL      |         | Cloudflare Email                                                                                                                                                                         |
| \*API        |         | Cloudflare API key                                                                                                                                                                       |
| TTL          | 1       | Time to live for DNS record. Value of 1 is 'automatic'. Min value:120; Max value:2147483647.Time to live for DNS record. Value of 1 is 'automatic'. Min value:120; Max value:2147483647. |
| PROXY        | true    | Whether the record is receiving the performance and security benefits of Cloudflare. `true` to enable; `false` to disable.                                                               |
| FORCE_CREATE |         | When set, a record will be created if one does not exist already.                                                                                                                        |
| RUNONCE      |         | When set, only a single update is attempted, and the script exists without setting up a cron process.                                                                                    |
| IPV6         |         | When set, update IPv6 instead of IPv4.                                                                                                                                                   |

- These parameters are required.

## Example

### Running once interactively

```bash
docker run \
    -e RUNONCE=1 \
    -e ZONE=example.com \
    -e HOST=example.com \
    -e EMAIL=example@example.com \
    -e API=1111111111111111 \
    -e TTL=1 \
    -e PROXY=true \
joshava/cloudflare-ddns
```

### Running as a daemon

```bash
docker run \
    -d \
    -e ZONE=example.com \
    -e HOST=example.com \
    -e EMAIL=example@example.com \
    -e API=1111111111111111 \
    -e TTL=1 \
    -e PROXY=true \
joshava/cloudflare-ddns
```
