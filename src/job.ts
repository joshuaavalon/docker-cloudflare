import "./typebox.js";
import { omit } from "lodash-es";
import { CloudflareApi } from "#api";
import { fetchIPv4, fetchIPv6 } from "./ip.js";
import { updateDns } from "#func";

import type { CronJobParams } from "cron";
import type { Logger } from "pino";
import type { Context } from "#context";
import type { Config, Domain } from "#config";

async function updateDomain(
  ctx: Context,
  cfg: Config,
  domain: Domain
): Promise<unknown> {
  const { logger } = ctx;
  const api = new CloudflareApi({
    baseUrl: cfg.api,
    apiToken: cfg.auth.scopedToken,
    timeout: cfg.timeout
  });
  const { ipv4, ipv6 } = cfg;
  const useIPv4 = domain.type === "A";
  const fetchIp = useIPv4 ? fetchIPv4 : fetchIPv6;
  const ipEchos = useIPv4 ? ipv4 : ipv6;
  const ip = await fetchIp(ctx, ipEchos);
  const result = await updateDns(ctx, api, { domain, ip });
  logger.info(`Updated ${domain.name} with ${ip}`);
  return result;
}

async function requestWebhook(
  ctx: Context,
  url?: string,
  data?: unknown
): Promise<void> {
  if (!url) {
    return;
  }
  const { logger } = ctx;
  try {
    if (data) {
      await fetch(url, { method: "POST", body: JSON.stringify(data) });
    } else {
      await fetch(url, { method: "GET" });
    }
  } catch (err) {
    logger.warn({ err }, `Fail to fetch ${url}`);
  }
}

async function updateDnsRecords(ctx: Context, cfg: Config): Promise<void> {
  const { logger } = ctx;
  const promises = cfg.domains.map(async domain => {
    const { webhook } = domain;
    const formatter = webhook?.formatter ?? (() => undefined);
    try {
      const runMessage = await formatter("run", {});
      await requestWebhook(ctx, webhook?.run, runMessage);
      const result = await updateDomain(ctx, cfg, domain);
      const successMessage = await formatter("success", result);
      await requestWebhook(ctx, webhook?.success, successMessage);
    } catch (err) {
      const failureMessage = await formatter("failure", err);
      await requestWebhook(ctx, webhook?.failure, failureMessage);
      logger.error({ err }, `Failed to update ${domain.name}`);
    }
  });
  await Promise.all(promises);
}

type TickFunc = CronJobParams<null, false>["onTick"];
export function onTick(logger: Logger, cfg: Config): TickFunc {
  return async () => {
    try {
      const ctx: Context = { logger };
      logger.info("Cloudflare DDNS start");
      const config = omit(cfg, ["auth"]);
      logger.debug({ config }, "Running with the following configuration");

      await updateDnsRecords(ctx, cfg);
    } catch (err) {
      logger.error({ err }, "Error");
      process.exitCode = 1;
    } finally {
      logger.info("Cloudflare DDNS end");
    }
  };
}
