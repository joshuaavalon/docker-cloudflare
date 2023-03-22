# Migration

## From v2 to v3

### Authentication

- Global API key is no longer supported. Please use API token.

### Configuration

All environment variables now starts with `CF_DNS__`. See [configuration](./configuration.md) for details.

There should be no changes for file configuration.

From v3, you should use either environment variables or file configuration. They will no longer be merged. (Except `CF_DNS__CRON` and `CF_DNS__LOG_TYPE`)

## From v1 to v2

To migrate from 1.X, there is nothing to needed to be updated. However, note that `RUNONCE` is not supported any more. You can override entry point instead. `TTL` is no longer supported as Cloudflare does not allow to change it anymore.
