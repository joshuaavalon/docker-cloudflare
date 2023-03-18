import { cosmiconfig } from "cosmiconfig";
import { verifySchema } from "@cloudflare-ddns/schema";
import { configSchema } from "#schema";

import type { Config } from "#schema";

export const readFileConfig = async (path: string): Promise<Config | null> => {
  const cc = cosmiconfig("cloudflare");
  let config: unknown;
  try {
    const result = await cc.load(path);
    config = result?.config;
  } catch {
    return null;
  }
  return verifySchema(configSchema, config);
};
