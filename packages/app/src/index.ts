import { get, omit } from "lodash-es";
import axios from "axios";
import pino from "pino";
import { readConfig } from "@cloudflare-ddns/config";
import { registerParser } from "@cloudflare-ddns/ip-echo-parser";
import { fetchIPv4, fetchIPv6 } from "./ip.js";
import { updateDns } from "./api.js";
import { getConfigFilePath } from "./env.js";

import type { Config, Domain, WebhookFormatter } from "@cloudflare-ddns/config";
import type { Context } from "./context.js";

const updateDomain = async (ctx: Context, domain: Domain): Promise<unknown> => {
  const logger = ctx.logger.child({ method: "updateDomain" });
  logger.debug("Start");
  const { config } = ctx;
  const { ipv4, ipv6 } = config;
  const useIPv4 = domain.type === "A";
  const fetchIp = useIPv4 ? fetchIPv4 : fetchIPv6;
  const ipEchos = useIPv4 ? ipv4 : ipv6;
  const ip = await fetchIp(ctx, ipEchos);
  const result = await updateDns(ctx, { domain, ip });
  logger.info(`Updated ${domain.name} with ${ip}`);
  logger.debug("End");
  return result;
};

const requestWebhook = async (
  ctx: Context,
  url?: string,
  data?: unknown
): Promise<void> => {
  const logger = ctx.logger.child({ method: "requestWebhook" });
  logger.debug("Start", { url, data });
  if (!url) {
    logger.debug("End");
    return;
  }
  try {
    if (data) {
      await axios.post(url, data);
    } else {
      await axios.get(url);
    }
  } catch (err) {
    logger.warn("Fail to request webhook", { err, url, data });
  } finally {
    logger.debug("End");
  }
};

const updateDnsRecords = async (ctx: Context): Promise<void> => {
  const logger = ctx.logger.child({ method: "updateDnsRecords" });
  logger.debug("Start");
  const promises = ctx.config.domains.map(async domain => {
    const { webhook } = domain;
    const formatter: WebhookFormatter = webhook?.formatter ?? (() => undefined);
    try {
      logger.debug("Start", { method: "formatter", status: "run" });
      const runMessage = await formatter("run");
      logger.debug("End", { method: "formatter", status: "run" });
      await requestWebhook(ctx, webhook?.run, runMessage);
      logger.debug("updateDomain Start");
      const result = await updateDomain(ctx, domain);
      logger.debug("updateDomain End");
      logger.debug("Start", { method: "formatter", status: "success" });
      const successMessage = await formatter("success", result);
      logger.debug("End", { method: "formatter", status: "success" });
      await requestWebhook(ctx, webhook?.success, successMessage);
    } catch (err) {
      logger.debug("Start", { method: "formatter", status: "failure" });
      const failureMessage = await formatter("failure", err);
      logger.debug("End", { method: "formatter", status: "failure" });
      await requestWebhook(ctx, webhook?.failure, failureMessage);
      logger.error("Failed to update", { err, domain });
    }
  });
  await Promise.all(promises);
  logger.debug("End");
};

const printConfig = (ctx: Context): void => {
  const { config } = ctx;
  const logger = ctx.logger.child({ method: "printConfig" });
  const cloneConfig = omit(config, ["auth"]);
  logger.debug("Running with the following configuration", {
    config: cloneConfig
  });
};

const registerParsers = (ctx: Context, config: Config): void => {
  const logger = ctx.logger.child({ method: "registerParsers" });
  logger.debug("Start");
  config.echoParsers.forEach(({ resolve, alias }) => {
    logger.debug(`Register parser(${alias})`);
    registerParser(resolve, alias);
  });
  logger.debug("End");
};

interface MainOptions {
  processId: string;
}
export const main = async (opts: MainOptions): Promise<void> => {
  const { processId } = opts;
  const configPath = getConfigFilePath();
  const logLevel = process.env.CF_DNS__LOG_LEVEL ?? "info";
  const logger = pino.default({ level: logLevel }).child({ processId });
  const config = await readConfig(configPath);
  try {
    const ctx: Context = { config, logger };
    logger.info("Cloudflare DDNS start");
    registerParsers(ctx, config);
    printConfig(ctx);
    await updateDnsRecords(ctx);
  } catch (e) {
    logger.error(get(e, "message", e));
    process.exitCode = 1;
  } finally {
    logger.info("Cloudflare DDNS end");
  }
};
