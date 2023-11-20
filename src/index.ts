import "./typebox.js";
import { config as configEnv } from "dotenv";
import { env } from "node:process";
import { CronJob } from "cron";
import pino from "pino";
import { readConfig } from "#config";
import { onTick } from "./job.js";

async function main(): Promise<void> {
  configEnv();
  const logLevel = env.CF_DNS__LOG_LEVEL ?? "info";
  const logger = pino.default({ level: logLevel });
  const cron = env.CF_DNS__CRON ?? "*/5 * * * *";
  const cfg = await readConfig(logger);
  const job = new CronJob(cron, onTick(logger, cfg));
  job.start();
}

main();
