import Ajv, { ErrorObject } from "ajv";
import addFormats from "ajv-formats";
import { exists, readFile } from "fs";
import { promisify } from "util";
import yaml from "js-yaml";
import { extname } from "path";
import _ from "lodash";

import { Auth, Domain, IpEcho } from "./type";
import schema from "./config.schema.json";

const readFilePromise = promisify(readFile);
const existsPromise = promisify(exists);

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

const readJsonConfig = async (path: string): Promise<UserConfig> => {
  const content = await readFilePromise(path, "utf8");
  const data = JSON.parse(content);
  return verifyConfig(data);
};

const readYamlConfig = async (path: string): Promise<UserConfig> => {
  const content = await readFilePromise(path, "utf8");
  const data = yaml.load(content);
  return verifyConfig(data);
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
  const exist = await existsPromise(path);
  if (!exist) {
    throw new MissingConfigError(path);
  }
  const ext = extname(path).toLowerCase();
  switch (ext) {
    case ".yaml":
    case ".yml":
      return readYamlConfig(path);
    case ".json":
      return readJsonConfig(path);
    default:
      throw new InvalidConfigFormatError(ext);
  }
};
