import _ from "lodash";
import { cosmiconfig } from "cosmiconfig";
import { verifySchema } from "@cloudflare-ddns/schema";

import { Auth, Domain, IpEcho, IpEchoParser } from "./type";
import schema from "./config.schema.json";

export interface UserConfig {
  api?: string;
  logLevel?: string;
  auth: Auth;
  domains: Domain[];
  ipv4?: IpEcho[];
  ipv6?: IpEcho[];
  echoParsers?: IpEchoParser[];
}

export const readEnvConfig = (): UserConfig => {
  const envConfig = {
    auth: {
      email: process.env.EMAIL,
      globalToken: process.env.API
    },
    domains: [
      {
        name: process.env.HOST,
        type: process.env.IPV6 === "true" ? "AAAA" : "A",
        zoneName: process.env.HOST,
        proxied: _.defaultTo(process.env.PROXY, "true") === "true",
        create: process.env.FORCE_CREATE === "true"
      }
    ]
  };
  return verifySchema<UserConfig>(schema, envConfig);
};

export const readUserConfig = async (path: string): Promise<UserConfig> => {
  const config = cosmiconfig("cloudflare");
  try {
    const result = await config.load(path);
    return verifySchema<UserConfig>(schema, result?.config);
  } catch (e) {
    console.warn(e);
    return readEnvConfig();
  }
};
