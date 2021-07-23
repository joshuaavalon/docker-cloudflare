import _ from "lodash";
import axios from "axios";
import {
  Config,
  Domain,
  WebhookConfig,
  isGlobalAuth,
  readConfig
} from "@cloudflare-ddns/config";
import { createLogger } from "@cloudflare-ddns/log";
import { registerParser } from "@cloudflare-ddns/ip-echo-parser";

import { fetchIPv4, fetchIPv6 } from "./ip";
import { updateDns } from "./api";
import { Context } from "./context";
import { getConfigFilePath } from "./env";

const updateDomain = async (ctx: Context, domain: Domain): Promise<void> => {
  const { config, logger } = ctx;
  const { ipv4, ipv6 } = config;
  const useIPv4 = domain.type === "A";
  const fetchIp = useIPv4 ? fetchIPv4 : fetchIPv6;
  const ipEchos = useIPv4 ? ipv4 : ipv6;
  const ip = await fetchIp(ctx, ipEchos);
  await updateDns(ctx, { domain, ip });
  logger.info(`Updated ${domain.name} with ${ip}`);
};

const requestWebhook = async (ctx: Context, webhookConfig?: WebhookConfig): Promise<void> => {
  if (!webhookConfig) {
    return;
  }
  const { logger } = ctx;
  const { url, data } = webhookConfig;
  // Old behaviour - Send a GET request to the webhook URL
  if (!data) {
    try {
      await axios.get(url);
    } catch (e) {
      logger.warn(`Fail to fetch ${url}.\n${e.message}`);
    }
  // New behaviour - Send a POST request to the webhook URL with data in JSON format
  } else {
    try {
      await axios.post(url, data, { headers: { 'Content-Type': 'application/json' } });
    } catch (e) {
      logger.warn(`Failed to send ${data} to ${url}.\n${e.message}`);
    }
  }
};

const updateDnsRecords = async (ctx: Context): Promise<void> => {
  const { config, logger } = ctx;
  const promises = config.domains.map(async domain => {
    const { webhook } = domain;
    try {
      await requestWebhook(ctx, webhook?.run);
      await updateDomain(ctx, domain);
      await requestWebhook(ctx, webhook?.success);
    } catch (e) {
      await requestWebhook(ctx, webhook?.failure);
      logger.error(`Failed to update ${domain.name}. (${e.message})`);
    }
  });
  await Promise.all(promises);
};

const printConfig = (ctx: Context): void => {
  const { config, logger } = ctx;
  const cloneConfig = _.omit(config, ["auth"]);
  const configStr = JSON.stringify(cloneConfig, null, 2);
  logger.debug(`Running with the following configuration:\n${configStr}`);
};

const warnGlobalApiKey = (ctx: Context): void => {
  const { config, logger } = ctx;
  if (isGlobalAuth(config.auth)) {
    logger.warn("Global API key is depreciated. Please use API token instead.");
  }
};

const registerParsers = (config: Config): void => {
  config.echoParsers.forEach(({ resolve, alias }) =>
    registerParser(resolve, alias)
  );
};

const main = async (): Promise<void> => {
  const configPath = getConfigFilePath();
  const config = await readConfig(configPath);
  const logger = createLogger(config.logLevel);
  try {
    const ctx: Context = { config, logger };
    logger.info("Cloudflare DDNS start");
    registerParsers(config);
    printConfig(ctx);
    warnGlobalApiKey(ctx);
    await updateDnsRecords(ctx);
  } catch (e) {
    logger.error(e.message);
    process.exitCode = 1;
  } finally {
    logger.info("Cloudflare DDNS end");
  }
};

main();
