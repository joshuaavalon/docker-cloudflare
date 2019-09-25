import Ajv, { ErrorObject } from "ajv";
import { exists, readFile } from "fs";
import { promisify } from "util";
import { defaultTo, pipe, then } from "ramda";
import yaml from "js-yaml";
import { extname } from "path";

import { logWarn } from "@/log";

import { Auth } from "./auth";
import { Domain } from "./domain";
import { IpEcho } from "./ip";
import schema from "./config.schema.json";

const readFilePromise = promisify(readFile);
const existsPromise = promisify(exists);

class InvalidConfigError extends Error {
  public errors: ErrorObject[];
  public constructor(errors: ErrorObject[]) {
    super(`Invalid user config.\n${JSON.stringify(errors, null, 2)}`);
    this.errors = errors;
  }
}

export type UserConfig = {
  api?: string;
  auth: Auth;
  domains: Domain[];
  ipv4?: IpEcho[];
  ipv6?: IpEcho[];
};

const verifyConfig = (data: any): UserConfig => {
  const ajv = new Ajv();
  const validate = ajv.compile(schema);
  if (validate(data)) {
    return data;
  }
  throw new InvalidConfigError(validate.errors || []);
};

const readJsonConfig = pipe(
  (path: string) => readFilePromise(path, "utf8"),
  then(JSON.parse),
  then(verifyConfig)
);

const readYamlConfig = pipe(
  (path: string) => readFilePromise(path, "utf8"),
  then(yaml.safeLoad),
  then(verifyConfig)
);

const readEnvConfig = (): UserConfig => {
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
        proxied: defaultTo(process.env.PROXY, "true") === "true",
        create: process.env.FORCE_CREATE === "true"
      }
    ]
  };
  return verifyConfig(envConfig);
};

export const readUserConfig = async (path: string): Promise<UserConfig> => {
  const exist = await existsPromise(path);
  if (!exist) {
    logWarn(
      `Cannot find configuration file at "${path}". Try to load from environment variable.`
    );
    return readEnvConfig();
  }
  const ext = extname(path).toLowerCase();
  switch (ext) {
    case ".yaml":
    case ".yml":
      return readYamlConfig(path);
    case ".json":
      return readJsonConfig(path);
    default:
      throw new Error(`Unsupported file format: ${ext}`);
  }
};
