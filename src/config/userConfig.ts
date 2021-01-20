import Ajv, { ErrorObject } from "ajv";
import addFormats from "ajv-formats";
import _ from "lodash";
import { cosmiconfig } from "cosmiconfig";

import { Auth, Domain, IpEcho } from "./type";
import schema from "./config.schema.json";

export class ConfigError extends Error {}

export class MissingConfigError extends ConfigError {
  public path: string;
  public constructor(path: string) {
    super(
      "Cannot find configuration file.  Try to load from environment variable."
    );
    this.path = path;
  }
}

export class InvalidConfigError extends ConfigError {
  public errors: ErrorObject[];
  public constructor(errors: ErrorObject[]) {
    super("Invalid configuration file.");
    this.errors = errors;
  }
}

export class InvalidConfigFormatError extends ConfigError {
  public ext: string;
  public constructor(ext: string) {
    super("Unsupported file format.");
    this.ext = ext;
  }
}

export interface UserConfig {
  api?: string;
  logLevel?: string;
  auth: Auth;
  domains: Domain[];
  ipv4?: IpEcho[];
  ipv6?: IpEcho[];
}

const verifyConfig = (data: any): UserConfig => {
  const ajv = new Ajv();
  addFormats(ajv);
  const validate = ajv.compile<UserConfig>(schema);
  if (validate(data)) {
    return data;
  }
  throw new InvalidConfigError(validate.errors || []);
};

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
  return verifyConfig(envConfig);
};

export const readUserConfig = async (path: string): Promise<UserConfig> => {
  const config = cosmiconfig("cloudflare");
  try {
    const result = await config.load(path);
    return verifyConfig(result?.config);
  } catch (e) {
    console.warn(e);
    return readEnvConfig();
  }
};
