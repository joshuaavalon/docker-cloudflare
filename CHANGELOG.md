## [2.9.3](https://github.com/joshuaavalon/docker-cloudflare/compare/2.9.2...2.9.3) (2022-10-22)


### Bug Fixes

* restart container cause multiple cron entry. ([424f576](https://github.com/joshuaavalon/docker-cloudflare/commit/424f576292f4323f167ac25748f66bae37194e77)), closes [#65](https://github.com/joshuaavalon/docker-cloudflare/issues/65)

## [3.2.2](https://github.com/joshuaavalon/docker-cloudflare/compare/v3.2.1...v3.2.2) (2023-07-25)


### Bug Fixes

* Fix Cloudflare error json mapping ([fac0226](https://github.com/joshuaavalon/docker-cloudflare/commit/fac0226cff98fb495b451c430dcf7dea19a32314)), closes [#87](https://github.com/joshuaavalon/docker-cloudflare/issues/87)

## [3.2.1](https://github.com/joshuaavalon/docker-cloudflare/compare/v3.2.0...v3.2.1) (2023-07-22)


### Bug Fixes

* Replace axios with fetch and add timeout ([#85](https://github.com/joshuaavalon/docker-cloudflare/issues/85)) ([83c9ae2](https://github.com/joshuaavalon/docker-cloudflare/commit/83c9ae21eb8cb144aeca623b8f85e12a5f84cdaf))

## [3.2.0](https://github.com/joshuaavalon/docker-cloudflare/compare/v3.1.0...v3.2.0) (2023-07-10)


### Features

* Add Debian based image ([#81](https://github.com/joshuaavalon/docker-cloudflare/issues/81)) ([05aed37](https://github.com/joshuaavalon/docker-cloudflare/commit/05aed376809fec9c59f4beb664d232f5c7a8675f))

## [3.1.0](https://github.com/joshuaavalon/docker-cloudflare/compare/v3.0.1...v3.1.0) (2023-07-05)


### Features

* Remove s6-overlay ([2fc268f](https://github.com/joshuaavalon/docker-cloudflare/commit/2fc268f755b3d28e821154b0266e6d8f2884f376))

## [3.0.1](https://github.com/joshuaavalon/docker-cloudflare/compare/v3.0.0...v3.0.1) (2023-04-28)


### Bug Fixes

* Disable npm update message ([c525b68](https://github.com/joshuaavalon/docker-cloudflare/commit/c525b688d37b0f938ebf42c8b5a69bcf7bf04a9c))
* Fix [#77](https://github.com/joshuaavalon/docker-cloudflare/issues/77) ([216de04](https://github.com/joshuaavalon/docker-cloudflare/commit/216de045291c99c8149cbdb1318026692ec85bb4))

## [3.0.0](https://github.com/joshuaavalon/docker-cloudflare/compare/2.9.3...v3.0.0) (2023-04-15)


### ⚠ BREAKING CHANGES

* Update config schema
* Change environment variables naming
* Use ESM module & Node.js 18

### Features

* Change environment variables naming ([a9f35d1](https://github.com/joshuaavalon/docker-cloudflare/commit/a9f35d184e4c6c0149a00afa62c464672dc973e9))
* Replace winston with pino ([a9f35d1](https://github.com/joshuaavalon/docker-cloudflare/commit/a9f35d184e4c6c0149a00afa62c464672dc973e9))
* Support CF_DNS__LOG_TYPE for scripts ([dd87eab](https://github.com/joshuaavalon/docker-cloudflare/commit/dd87eabf07b3cc9e690f4d4723e11de73a833cc1))
* Update config schema ([a9f35d1](https://github.com/joshuaavalon/docker-cloudflare/commit/a9f35d184e4c6c0149a00afa62c464672dc973e9))


### Bug Fixes

* Update dependencies ([a9f35d1](https://github.com/joshuaavalon/docker-cloudflare/commit/a9f35d184e4c6c0149a00afa62c464672dc973e9))


### Code Refactoring

* Use ESM module & Node.js 18 ([a9f35d1](https://github.com/joshuaavalon/docker-cloudflare/commit/a9f35d184e4c6c0149a00afa62c464672dc973e9))

## [2.9.2](https://github.com/joshuaavalon/docker-cloudflare/compare/2.9.1...2.9.2) (2022-02-07)


### Bug Fixes

* update package-lock.json ([8b609f0](https://github.com/joshuaavalon/docker-cloudflare/commit/8b609f0f5633ee1e28feb4b8dad103819d1d54ce))

## [2.9.1](https://github.com/joshuaavalon/docker-cloudflare/compare/2.9.0...2.9.1) (2022-02-07)


### Bug Fixes

* update dependencies ([6551532](https://github.com/joshuaavalon/docker-cloudflare/commit/6551532eb65abd6c18fec752b9a7cd497d832cba))

# [2.9.0](https://github.com/joshuaavalon/docker-cloudflare/compare/2.8.0...2.9.0) (2021-12-20)


### Bug Fixes

* update dependencies ([a09a343](https://github.com/joshuaavalon/docker-cloudflare/commit/a09a343efcd421447d324f52186812bcf3daf4b7))


### Features

* add trim option to text response ([d7f6a57](https://github.com/joshuaavalon/docker-cloudflare/commit/d7f6a5712db5d34804e848132e993cf0ea96b4bc))

# [2.8.0](https://github.com/joshuaavalon/docker-cloudflare/compare/2.7.0...2.8.0) (2021-11-26)


### Bug Fixes

* update dependencies ([4d42bc8](https://github.com/joshuaavalon/docker-cloudflare/commit/4d42bc8d3659b3a1b3cd0dce4973b94be7d9d1c7))


### Features

* update dependencies to latest and node to 16 ([8dd11bc](https://github.com/joshuaavalon/docker-cloudflare/commit/8dd11bc71e52d9c0ec205a5428856d32991bd199))

# [2.7.0](https://github.com/joshuaavalon/docker-cloudflare/compare/2.6.0...2.7.0) (2021-07-31)


### Bug Fixes

* update dependencies ([a2e72f3](https://github.com/joshuaavalon/docker-cloudflare/commit/a2e72f33875bb0d269ce95a6ec216a3b89456207))


### Features

* add JSON formatter ([#52](https://github.com/joshuaavalon/docker-cloudflare/issues/52)) ([2e28af5](https://github.com/joshuaavalon/docker-cloudflare/commit/2e28af500d49861926800233e9d80a394d316554))

# [2.6.0](https://github.com/joshuaavalon/docker-cloudflare/compare/2.5.0...2.6.0) (2021-06-20)


### Bug Fixes

* crontab ([e11a937](https://github.com/joshuaavalon/docker-cloudflare/commit/e11a9374b4eedb5a2c5bdd2bc0919965c8e84a25))
* escape space ([6f22bbf](https://github.com/joshuaavalon/docker-cloudflare/commit/6f22bbff7d52ed76610a3ec761b4578dac05ec2c))
* update dependencies ([c3c5397](https://github.com/joshuaavalon/docker-cloudflare/commit/c3c5397347c06174d81b964c21c6c0b5e37cf99f))


### Features

* add CRON ([edf30a0](https://github.com/joshuaavalon/docker-cloudflare/commit/edf30a066dd8108795c1cd7e5c35ba904cc1b4a6))

# [2.5.0](https://github.com/joshuaavalon/docker-cloudflare/compare/2.4.0...2.5.0) (2021-03-06)


### Features

* configurable cron schedule ([#47](https://github.com/joshuaavalon/docker-cloudflare/issues/47)) ([ba9f0b2](https://github.com/joshuaavalon/docker-cloudflare/commit/ba9f0b24b116fb95296d08e895196c910fa59350))

# [2.4.0](https://github.com/joshuaavalon/docker-cloudflare/compare/2.3.0...2.4.0) (2021-03-06)


### Features

* migrate repository to npm 7 workspace ([#46](https://github.com/joshuaavalon/docker-cloudflare/issues/46)) ([10e1e18](https://github.com/joshuaavalon/docker-cloudflare/commit/10e1e182e87ce3d664722c7cbac3c032b6b90512))

# [2.3.0](https://github.com/joshuaavalon/docker-cloudflare/compare/2.2.11...2.3.0) (2021-01-23)


### Bug Fixes

* update package-lock.json ([32e4975](https://github.com/joshuaavalon/docker-cloudflare/commit/32e4975b5b006e6e03463cbd594e1290770ac7d9))


### Features

* add new ini echo ([deb4254](https://github.com/joshuaavalon/docker-cloudflare/commit/deb42546b21c1976774763c0765d78ebe8018765))
* use cosmiconfig to load config ([f606a24](https://github.com/joshuaavalon/docker-cloudflare/commit/f606a24a50a58ab17ef7c79b231c65d73f7da72f))

## [2.2.11](https://github.com/joshuaavalon/docker-cloudflare/compare/2.2.10...2.2.11) (2021-01-17)


### Bug Fixes

* add missing format after updating ajv ([04ffbb5](https://github.com/joshuaavalon/docker-cloudflare/commit/04ffbb59bed9c834711a58a5705b44f94a4eb8f2)), closes [#43](https://github.com/joshuaavalon/docker-cloudflare/issues/43)

## [2.2.10](https://github.com/joshuaavalon/docker-cloudflare/compare/2.2.9...2.2.10) (2021-01-14)


### Bug Fixes

* add package-lock.json ([213afd7](https://github.com/joshuaavalon/docker-cloudflare/commit/213afd703cbc87058e6494e72aaf19f5662fcdb5))

## [2.2.9](https://github.com/joshuaavalon/docker-cloudflare/compare/2.2.8...2.2.9) (2021-01-14)


### Bug Fixes

* build with npm ci ([ec6d4a0](https://github.com/joshuaavalon/docker-cloudflare/commit/ec6d4a028939265ee1d5167ac05e3d382d171747))

## [2.2.8](https://github.com/joshuaavalon/docker-cloudflare/compare/2.2.7...2.2.8) (2021-01-14)


### Bug Fixes

* update dependencies ([bd93587](https://github.com/joshuaavalon/docker-cloudflare/commit/bd93587515d77cbe6ccfecff57c98c1782f9b88c))

## [2.2.7](https://github.com/joshuaavalon/docker-cloudflare/compare/2.2.6...2.2.7) (2020-11-07)


### Bug Fixes

* change workflow to release event ([43950c4](https://github.com/joshuaavalon/docker-cloudflare/commit/43950c4f2c4ddde5de072e60dc1d7d1d0abc976a))

## [2.2.6](https://github.com/joshuaavalon/docker-cloudflare/compare/2.2.5...2.2.6) (2020-11-07)


### Bug Fixes

* Use person token ([b5b3b6e](https://github.com/joshuaavalon/docker-cloudflare/commit/b5b3b6ef47aff905dc4449e67791b00339501152))

## [2.2.5](https://github.com/joshuaavalon/docker-cloudflare/compare/2.2.4...2.2.5) (2020-11-07)


### Bug Fixes

* Run CI on tag release ([1dc4451](https://github.com/joshuaavalon/docker-cloudflare/commit/1dc44519c5f8eabb74650d851b61dfabb20e44fb))

## [2.2.4](https://github.com/joshuaavalon/docker-cloudflare/compare/2.2.3...2.2.4) (2020-11-07)


### Bug Fixes

* Update dependencies ([ad92c13](https://github.com/joshuaavalon/docker-cloudflare/commit/ad92c13318e3dffc54059596d01ea33d465217b1))

## [2.2.3](https://github.com/joshuaavalon/docker-cloudflare/compare/2.2.2...2.2.3) (2020-09-30)


### Bug Fixes

* update error handling ([243b50f](https://github.com/joshuaavalon/docker-cloudflare/commit/243b50f77f49e8539f181c384748cbda815cdbc7))

## [2.2.2](https://github.com/joshuaavalon/docker-cloudflare/compare/2.2.1...2.2.2) (2020-07-13)


### Bug Fixes

* remove ident.me from default configuration ([0695d01](https://github.com/joshuaavalon/docker-cloudflare/commit/0695d014529d94cea340f5d32d3a6d6d227927bc))
* update dependencies ([572cebd](https://github.com/joshuaavalon/docker-cloudflare/commit/572cebd46be73b081951f57e23d447b69ae615dd))

## [2.2.1](https://github.com/joshuaavalon/docker-cloudflare/compare/2.2.0...2.2.1) (2020-04-04)


### Bug Fixes

* **script:** replace ramda with lodash ([ee1338c](https://github.com/joshuaavalon/docker-cloudflare/commit/ee1338c8869af7fec3e7c4a33e1d2145c54ba46a))

# [2.2.0](https://github.com/joshuaavalon/docker-cloudflare/compare/2.1.1...2.2.0) (2020-04-04)


### Features

* **script:** update dependencies ([c6d108e](https://github.com/joshuaavalon/docker-cloudflare/commit/c6d108ef5148cbcd581d17ac15e7a2ff6d48bbe8))

## [2.1.1](https://github.com/joshuaavalon/docker-cloudflare/compare/2.1.0...2.1.1) (2019-11-09)


### Bug Fixes

* **script:** fix script keep restart on error ([20e3cdc](https://github.com/joshuaavalon/docker-cloudflare/commit/20e3cdcc1afb2c69b2498b461ef92193d922e28d))

# [2.1.0](https://github.com/joshuaavalon/docker-cloudflare/compare/2.0.2...2.1.0) (2019-11-09)


### Features

* **script:** add webhook ([#29](https://github.com/joshuaavalon/docker-cloudflare/issues/29)) ([5a22745](https://github.com/joshuaavalon/docker-cloudflare/commit/5a2274562862b62762996ab91ea0c082441b6477))

## [2.0.2](https://github.com/joshuaavalon/docker-cloudflare/compare/2.0.1...2.0.2) (2019-11-09)


### Bug Fixes

* **script:** suppress type check in libraries ([f57bf0d](https://github.com/joshuaavalon/docker-cloudflare/commit/f57bf0dd8962aac46b54fdb441aa6e6491f32cf3))

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
