import { env } from "node:process";
import Ajv from "ajv";
import { TypeCompiler } from "@sinclair/typebox/compiler";
import { cosmiconfig } from "cosmiconfig";
import readEnvVars from "read-env-vars";
import { SchemaViolationError } from "#error";
import { configSchema } from "./schema/index.js";

import type { Logger } from "pino";
import type { Config } from "./schema/index.js";

const schema = TypeCompiler.Compile(configSchema);
const configPath = env.CF_DNS__CONFIG ?? "config.yaml";

export const readConfig = async (rootLogger: Logger): Promise<Config> => {
  const logger = rootLogger.child({ module: "config" });
  const envConfig = readEnvVars("CF_DNS");
  let fileConfig: Record<string, unknown> = {};
  logger.debug({ envConfig, fileConfig }, "Read config");
  let mergedConfig: unknown;
  try {
    const cc = cosmiconfig("cloudflare");
    const result = await cc.load(configPath);
    if (result?.config) {
      fileConfig = result?.config;
    }
    logger.debug({ envConfig, fileConfig }, "Read config");
    mergedConfig = { ...fileConfig, ...envConfig };
  } catch (err) {
    logger.error({ err }, "Fail to read file config");
    throw new Error("Fail to read file config", { cause: err });
  }
  logger.debug({ mergedConfig }, "Merge config");
  const ajv = new Ajv.default({ useDefaults: true });
  const validate = ajv.compile<Config>(schema);
  if (validate(mergedConfig)) {
    return mergedConfig;
  }
  logger.debug(
    { config: mergedConfig, errors: validate.errors },
    "Fail to read merged config"
  );
  throw new SchemaViolationError(schema, mergedConfig);
};

export * from "./schema/index.js";
