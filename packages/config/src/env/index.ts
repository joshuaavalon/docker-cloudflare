import readEnvVars from "read-env-vars";
import { verifySchema } from "@cloudflare-ddns/schema";
import { configSchema } from "#schema";

import type { Config } from "#schema";

export const readEnvConfig = (): Config => {
  const config = readEnvVars("CF_DNS");
  return verifySchema(configSchema, config);
};
