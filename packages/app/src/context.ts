import { Logger } from "@cloudflare-ddns/log";
import { Config } from "@cloudflare-ddns/config";

export interface Context {
  logger: Logger;
  config: Config;
}
