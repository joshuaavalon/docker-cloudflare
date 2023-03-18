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
  const { config, logger } = ctx;
  const { ipv4, ipv6 } = config;
  const useIPv4 = domain.type === "A";
  const fetchIp = useIPv4 ? fetchIPv4 : fetchIPv6;
  const ipEchos = useIPv4 ? ipv4 : ipv6;
  const ip = await fetchIp(ctx, ipEchos);
  const result = await updateDns(ctx, { domain, ip });
  logger.info(`Updated ${domain.name} with ${ip}`);
  return result;
};

const requestWebhook = async (
  ctx: Context,
  url?: string,
  data?: unknown
): Promise<void> => {
  if (!url) {
    return;
  }
  const { logger } = ctx;
  try {
    if (data) {
      await axios.post(url, data);
    } else {
      await axios.get(url);
    }
  } catch (e) {
    logger.warn(`Fail to fetch ${url}.\n${get(e, "message", e)}`);
  }
};

const updateDnsRecords = async (ctx: Context): Promise<void> => {
  const { config, logger } = ctx;
  const promises = config.domains.map(async domain => {
    const { webhook } = domain;
    const formatter: WebhookFormatter = webhook?.formatter ?? (() => undefined);
    try {
      const runMessage = await formatter("run");
      await requestWebhook(ctx, webhook?.run, runMessage);
      const result = await updateDomain(ctx, domain);
      const successMessage = await formatter("success", result);
      await requestWebhook(ctx, webhook?.success, successMessage);
    } catch (e) {
      const failureMessage = await formatter("failure", e);
      await requestWebhook(ctx, webhook?.failure, failureMessage);
      logger.error(
        `Failed to update ${domain.name}. (${get(e, "message", e)})`
      );
    }
  });
  await Promise.all(promises);
};

const printConfig = (ctx: Context): void => {
  const { config, logger } = ctx;
  const cloneConfig = omit(config, ["auth"]);
  const configStr = JSON.stringify(cloneConfig, null, 2);
  logger.debug(`Running with the following configuration:\n${configStr}`);
};

const registerParsers = (config: Config): void => {
  config.echoParsers.forEach(({ resolve, alias }) =>
    registerParser(resolve, alias)
  );
};

export const main = async (): Promise<void> => {
  const configPath = getConfigFilePath();
  const logLevel = process.env.CF_DNS_LOG_LEVEL ?? "info";
  const logger = pino.default({ level: logLevel });
  const config = await readConfig(configPath);
  try {
    const ctx: Context = { config, logger };
    logger.info("Cloudflare DDNS start");
    registerParsers(config);
    printConfig(ctx);
    await updateDnsRecords(ctx);
  } catch (e) {
    logger.error(get(e, "message", e));
    process.exitCode = 1;
  } finally {
    logger.info("Cloudflare DDNS end");
  }
};
