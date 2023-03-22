# Echo Parser

If the [IP echo service](./ip-echo-service.md) you are using does not support text, ini, or JSON response type, you can implement you own echo parser.

Note that if you want to use custom parser, you may want to include the default parsers if you want to use the default IP echo services for backup.

`alias` will be lookup from IP echo service's `type`. `alias` must be unique.

This is the default configuration.

**Environment Variables**

```ini
CF_DNS__ECHO_PARSERS_0__RESOLVE=@cloudflare-ddns/ip-echo-parser-ini
CF_DNS__ECHO_PARSERS_0__ALIAS=ini
CF_DNS__ECHO_PARSERS_1__RESOLVE=@cloudflare-ddns/ip-echo-parser-json
CF_DNS__ECHO_PARSERS_1__ALIAS=json
CF_DNS__ECHO_PARSERS_2__RESOLVE=@cloudflare-ddns/ip-echo-parser-text
CF_DNS__ECHO_PARSERS_2__ALIAS=text
```

**YAML**

```yaml
echoParsers:
  - resolve: "@cloudflare-ddns/ip-echo-parser-ini"
    alias: ini
  - resolve: "@cloudflare-ddns/ip-echo-parser-json"
    alias: json
  - resolve: "@cloudflare-ddns/ip-echo-parser-text"
    alias: text
```

**JSON**

```json
{
  "echoParsers": [
    {
      "resolve": "@cloudflare-ddns/ip-echo-parser-ini",
      "alias": "ini"
    },
    {
      "resolve": "@cloudflare-ddns/ip-echo-parser-json",
      "alias": "json"
    },
    {
      "resolve": "@cloudflare-ddns/ip-echo-parser-text",
      "alias": "text"
    }
  ]
}
```

**JavaScript**

```js
// CommonJS only. ESM is not supported by cosmiconfig
module.exports = {
  echoParsers: [
    {
      resolve: "@cloudflare-ddns/ip-echo-parser-ini",
      alias: "ini"
    },
    {
      resolve: "@cloudflare-ddns/ip-echo-parser-json",
      alias: "json"
    },
    {
      resolve: "@cloudflare-ddns/ip-echo-parser-text",
      alias: "text"
    }
  ]
};
```

### Custom Echo Parser

You can take a look at `packages/ip-echo-parser-json`.

It needs to export `schema` and `parser`.

`schema` is `Type` from `@sinclair/typebox` which is used to verify configuration.
`parser` is a function that return the IP in string.
