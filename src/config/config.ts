import { prop } from "ramda";

import { Auth } from "./auth";
import { Domain } from "./domain";
import { IpEcho } from "./ip";
import { readUserConfig } from "./userConfig";

export type Config = {
  /**
   * Cloudflare V4 API url
   */
  api: string;
  auth: Auth;
  domains: Domain[];
  ipv4: IpEcho[];
  ipv6: IpEcho[];
};

export const getApi = prop<Config, "api">("api");
export const getAuth = prop<Config, "auth">("auth");
export const getDomains = prop<Config, "domains">("domains");
export const getIPv4 = prop<Config, "ipv4">("ipv4");
export const getIPv6 = prop<Config, "ipv6">("ipv6");

export const defaultConfig: Omit<Config, "auth" | "domains"> = {
  api: "https://api.cloudflare.com/client/v4/",
  ipv4: [
    {
      type: "json",
      url: "https://v4.ident.me/.json",
      fields: ["address"]
    },
    {
      type: "json",
      url: "https://api.ipify.org?format=json",
      fields: ["ip"]
    }
  ],
  ipv6: [
    {
      type: "json",
      url: "https://v6.ident.me/.json",
      fields: ["address"]
    },
    {
      type: "json",
      url: "https://api6.ipify.org?format=json",
      fields: ["ip"]
    }
  ]
};

export const readConfig = async (path: string): Promise<Config> => {
  const userConfig = await readUserConfig(path);
  return {
    api: userConfig.api || defaultConfig.api,
    auth: userConfig.auth,
    domains: userConfig.domains,
    ipv4: userConfig.ipv4 || defaultConfig.ipv4,
    ipv6: userConfig.ipv6 || defaultConfig.ipv6
  };
};
