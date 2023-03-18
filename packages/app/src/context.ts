import type { Logger } from "pino";
import type { Config } from "@cloudflare-ddns/config";

export interface Context {
  logger: Logger;
  config: Config;
}
