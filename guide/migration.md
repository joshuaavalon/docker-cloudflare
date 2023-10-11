# Migration

## From v3 to v4

### Docker

- Remove Debian image because it does not solve #79

### Configuration

- Both environment variables configuration and file configuration is used if present. They are not deep merged. Also environment variables configuration has higher priority.

- `echoParser` is no longer supported. Please use `custom` IP Echo Service. [See here](./ip-echo-service.md).

- `cosmiconfig` default to ESM if the project is ESM. If your configuration is Common JS, you should rename it to `.cjs`.

## From v2 to v3

### Authentication

- Global API key is no longer supported. Please use API token.

### Configuration

All environment variables now starts with `CF_DNS__`. See [configuration](./configuration.md) for details.

There should be no changes for file configuration.

From v3, you should use either environment variables or file configuration. They will no longer be merged. (Except `CF_DNS__CRON` and `CF_DNS__LOG_TYPE`)

## From v1 to v2

To migrate from 1.X, there is nothing to needed to be updated. However, note that `RUNONCE` is not supported any more. You can override entry point instead. `TTL` is no longer supported as Cloudflare does not allow to change it anymore.
