import { Type } from "@sinclair/typebox";
import { scopedAuthSchema } from "./scoped-auth.js";
import { domainSchema } from "./domain.js";
import { ipEchoSchema } from "./ip-echo.js";
import { ipEchoParserSchema } from "./ip-echo-parser.js";

import type { Static } from "@sinclair/typebox";

export const configSchema = Type.Object(
  {
    api: Type.String({
      description:
        'Cloudflare V4 API url. Default to "https://api.cloudflare.com/client/v4/".',
      default: "https://api.cloudflare.com/client/v4/"
    }),
    auth: scopedAuthSchema,
    domains: Type.Array(domainSchema, {
      description: "List of domains to be updated."
    }),
    ipv4: Type.Array(ipEchoSchema, {
      description: "List of IP echo service that returns IPv4.",
      default: [
        {
          type: "ini",
          url: "https://1.1.1.1/cdn-cgi/trace",
          field: "ip"
        },
        {
          type: "json",
          url: "https://api.ipify.org?format=json",
          fields: ["ip"]
        }
      ]
    }),
    ipv6: Type.Array(ipEchoSchema, {
      description: "List of IP echo service that returns IPv6.",
      default: [
        {
          type: "ini",
          url: "https://[2606:4700:4700::1111]/cdn-cgi/trace",
          field: "ip"
        },
        {
          type: "json",
          url: "https://api6.ipify.org?format=json",
          fields: ["ip"]
        }
      ]
    }),
    echoParsers: Type.Array(ipEchoParserSchema, {
      description:
        "List of IP echo parsers that parses the response from IP echoing service.",
      default: [
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
    })
  },
  {
    title: "Config",
    $id: "https://joshuaavalon.github.io/docker-cloudflare/config.schema.json",
    $schema: "http://json-schema.org/draft-07/schema#",
    description: "Configuration for docker-cloudflare",
    additionalProperties: false
  }
);

export type Config = Static<typeof configSchema>;
