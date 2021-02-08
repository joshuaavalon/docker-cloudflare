import { Config } from "./type";

export const defaultConfig: Omit<Config, "auth" | "domains"> = {
  api: "https://api.cloudflare.com/client/v4/",
  logLevel: "info",
  ipv4: [
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
  ],
  ipv6: [
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
  ],
  echoParsers: [
    {
      resolve: "@cloudflare-ddns/ip-echo-parser-ini",
      alias: "ini"
    },
    {
      resolve: "@cloudflare-ddns/ip-echo-parser-json",
      alias: "ini"
    },
    {
      resolve: "@cloudflare-ddns/ip-echo-parser-text",
      alias: "text"
    }
  ]
};
