import { Logger } from "winston";
import { Config } from "./config";

export interface Context {
  logger: Logger;
  config: Config;
}
