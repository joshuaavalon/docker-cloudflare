import { omit } from "ramda";
import fetch from "node-fetch";

import { fetchIPv4, fetchIPv6 } from "@/ip";
import { updateDns } from "@/api";
import {
  Config,
  Domain,
  getApi,
  getAuth,
  getDomainName,
  getDomains,
  getIPv4,
  getIPv6,
  getWebhook,
  isGlobalAuth,
  isIPv4,
  readConfig
} from "@/config";
import { getConfigFilePath } from "@/env";
import { log, logDebug, logError, logWarn } from "@/log";

const updateDomain = async (config: Config, domain: Domain): Promise<void> => {
  const useIPv4 = isIPv4(domain);
  const fetchIp = useIPv4 ? fetchIPv4 : fetchIPv6;
  const ipEchos = useIPv4 ? getIPv4(config) : getIPv6(config);
  const auth = getAuth(config);
  const api = getApi(config);
  const ip = await fetchIp(ipEchos);
  await updateDns({ ip, domain, auth, api });

  const domainName = getDomainName(domain);
  log(`Updated ${domainName} with ${ip}`);
};

const requestWebhook = async (url?: string): Promise<void> => {
  if (!url) {
    return;
  }
  try {
    await fetch(url);
  } catch (e) {
    logWarn(`Fail to fetch ${url}.\n${e.message}`);
  }
};

const updateDnsRecords = async (config: Config): Promise<void> => {
  const domains = await getDomains(config);
  const promises = domains.map(async domain => {
    const webhook = getWebhook(domain);
    try {
      await requestWebhook(webhook?.run);
      await updateDomain(config, domain);
      await requestWebhook(webhook?.success);
    } catch (e) {
      await requestWebhook(webhook?.failure);
      const domainName = getDomainName(domain);
      console.error(`Failed to update ${domainName}.\n${e.message}`);
      process.exitCode = 1;
    }
  });
  await Promise.all(promises);
};

const printConfig = (config: Config): void => {
  const cloneConfig = omit(["auth"], config);
  const configStr = JSON.stringify(cloneConfig, null, 2);
  logDebug(`Running with the following configuration:\n${configStr}`);
};

const warnGlobalApiKey = (config: Config): void => {
  const auth = getAuth(config);
  if (isGlobalAuth(auth)) {
    logWarn("Global API key is depreciated. Please use API token instead.");
  }
};

const main = async (): Promise<void> => {
  log("Cloudflare DDNS start");
  try {
    const configPath = getConfigFilePath();
    const config = await readConfig(configPath);
    printConfig(config);
    warnGlobalApiKey(config);
    await updateDnsRecords(config);
  } catch (e) {
    logError(e.message);
    // eslint-disable-next-line require-atomic-updates
    process.exitCode = 1;
  } finally {
    log("Cloudflare DDNS end");
  }
};

main();
