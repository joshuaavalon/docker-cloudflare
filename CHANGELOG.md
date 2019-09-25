## [2.0.1](https://github.com/joshuaavalon/docker-cloudflare/compare/2.0.0...2.0.1) (2019-09-25)


### Bug Fixes

* **script:** Environment variable IPV6 does not generate valid configuration ([9ccb050](https://github.com/joshuaavalon/docker-cloudflare/commit/9ccb050)), closes [#28](https://github.com/joshuaavalon/docker-cloudflare/issues/28)

# [2.0.0](https://github.com/joshuaavalon/docker-cloudflare/compare/1.4.1...2.0.0) (2019-09-21)

### Bug Fixes

- **docker:** Fixes script path in cron ([4548627](https://github.com/joshuaavalon/docker-cloudflare/commit/4548627))

### Features

- **script:** Run script in configurable user and group ([9350cae](https://github.com/joshuaavalon/docker-cloudflare/commit/9350cae))
- **script:** Support configuration file, API token and multiple domain ([6f6ba16](https://github.com/joshuaavalon/docker-cloudflare/commit/6f6ba16))

### BREAKING CHANGES

- **script:** Depreciate Global API key. It will be removed in the future.
