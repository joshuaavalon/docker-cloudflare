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

export const getApi = (config: Config): string => config.api;
export const getAuth = (config: Config): Auth => config.auth;
export const getDomains = (config: Config): Domain[] => config.domains;
export const getIPv4 = (config: Config): IpEcho[] => config.ipv4;
export const getIPv6 = (config: Config): IpEcho[] => config.ipv6;

export const defaultConfig: Omit<Config, "auth" | "domains"> = {
  api: "https://api.cloudflare.com/client/v4/",
  ipv4: [
    {
      type: "json",
      url: "https://api.ipify.org?format=json",
      fields: ["ip"]
    }
  ],
  ipv6: [
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
