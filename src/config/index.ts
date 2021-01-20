import { Config } from "./type";
import { readUserConfig } from "./userConfig";

const defaultConfig: Omit<Config, "auth" | "domains"> = {
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
  ]
};

export const readConfig = async (path: string): Promise<Config> => {
  const userConfig = await readUserConfig(path);
  return {
    api: userConfig.api || defaultConfig.api,
    logLevel: userConfig.logLevel || defaultConfig.logLevel,
    auth: userConfig.auth,
    domains: userConfig.domains,
    ipv4: userConfig.ipv4 || defaultConfig.ipv4,
    ipv6: userConfig.ipv6 || defaultConfig.ipv6
  };
};

export * from "./type";
export {
  ConfigError,
  InvalidConfigError,
  InvalidConfigFormatError,
  MissingConfigError
} from "./userConfig";
