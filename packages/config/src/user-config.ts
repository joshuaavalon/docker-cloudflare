import { Auth, Domain, IpEcho, IpEchoParser } from "./type";
import { readFileConfig } from "./file-config";
import { readEnvConfig } from "./env-config";

export interface UserConfig {
  api?: string;
  logLevel?: string;
  auth: Auth;
  domains: Domain[];
  ipv4?: IpEcho[];
  ipv6?: IpEcho[];
  echoParsers?: IpEchoParser[];
}

export const readUserConfig = async (path: string): Promise<UserConfig> => {
  try {
    return readFileConfig(path);
  } catch (e) {
    console.warn(e);
    return readEnvConfig();
  }
};
