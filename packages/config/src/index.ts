import { readFileConfig } from "./file/index.js";
import { readEnvConfig } from "./env/index.js";

import type { Config } from "./schema/index.js";

export const readConfig = async (path: string): Promise<Config> => {
  const fileConfig = await readFileConfig(path);
  return fileConfig ? fileConfig : readEnvConfig();
};

export { parseZoneName } from "./utils.js";
export type {
  Config,
  Domain,
  WebhookFormatter,
  IpEcho
} from "./schema/index.js";
