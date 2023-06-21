import {
  createDNSRecord,
  listDNSRecords,
  listZones,
  updateDNSRecords
} from "@cloudflare-ddns/api";
import { first } from "lodash-es";
import { parseZoneName } from "@cloudflare-ddns/config";
import { CloudflareApiError, CloudflareError, wrapError } from "./error.js";

import type { Domain } from "@cloudflare-ddns/config";
import type { Context } from "./context.js";

interface Record {
  domain: Domain;
  ip: string;
}

const getZoneId = async (ctx: Context, record: Record): Promise<string> => {
  const logger = ctx.logger.child({ method: "getZoneId" });
  logger.debug("Start");
  const { domain } = record;
  if (domain.zoneId) {
    logger.debug("End");
    return domain.zoneId;
  }
  const { auth, api: baseURL } = ctx.config;
  const { zoneName } = domain;
  const name = zoneName ? zoneName : parseZoneName(domain.name);
  try {
    const res = await listZones({
      auth,
      params: { name },
      baseURL
    });
    const { success, errors, result } = res.data;
    if (!success || !result) {
      throw new CloudflareApiError(errors);
    }
    const zoneId = first(result)?.id;
    if (!zoneId) {
      throw new CloudflareError("No match zone found");
    }
    return zoneId;
  } catch (e) {
    throw wrapError(e);
  } finally {
    logger.debug("End");
  }
};

interface DNSRecord {
  id: string;
  type: string;
  name: string;
  content: string;
  proxied: boolean;
  ttl: number;
}

const getDNSRecord = async (
  ctx: Context,
  record: Record,
  zoneId: string
): Promise<DNSRecord | undefined> => {
  const logger = ctx.logger.child({ method: "getDNSRecord" });
  logger.debug("Start");
  const { auth, api: baseURL } = ctx.config;
  const { name, type } = record.domain;
  try {
    const res = await listDNSRecords({
      auth,
      params: { name, type },
      zoneId,
      baseURL
    });
    const { success, errors, result } = res.data;
    if (!success || !result) {
      throw new CloudflareApiError(errors);
    }
    return first(result);
  } catch (e) {
    throw wrapError(e);
  } finally {
    logger.debug("End");
  }
};

const update = async (
  ctx: Context,
  record: Record,
  zoneId: string,
  dnsRecord: DNSRecord
): Promise<DNSRecord> => {
  const logger = ctx.logger.child({ method: "update" });
  logger.debug("Start");
  const { auth, api: baseURL } = ctx.config;
  const { name, type, proxied } = record.domain;
  const { ttl, id: recordId } = dnsRecord;
  try {
    const res = await updateDNSRecords({
      auth,
      data: { content: record.ip, name, type, proxied, ttl },
      zoneId,
      recordId,
      baseURL
    });
    const { success, errors, result } = res.data;
    if (!success || !result) {
      throw new CloudflareApiError(errors);
    }
    return result;
  } catch (e) {
    throw wrapError(e);
  } finally {
    logger.debug("End");
  }
};

const create = async (
  ctx: Context,
  record: Record,
  zoneId: string
): Promise<DNSRecord> => {
  const logger = ctx.logger.child({ method: "update" });
  logger.debug("Start");
  const { auth, api: baseURL } = ctx.config;
  const { name, type, proxied } = record.domain;
  try {
    const res = await createDNSRecord({
      auth,
      data: { content: record.ip, name, type, proxied, ttl: 1 },
      zoneId,
      baseURL
    });
    const { success, errors, result } = res.data;
    if (!success || !result) {
      throw new CloudflareApiError(errors);
    }
    return result;
  } catch (e) {
    throw wrapError(e);
  } finally {
    logger.debug("End");
  }
};

const updateOrCreate = async (
  ctx: Context,
  record: Record,
  zoneId: string,
  dnsRecord?: DNSRecord
): Promise<DNSRecord | undefined> => {
  const logger = ctx.logger.child({ method: "updateOrCreate" });
  logger.debug("Start");
  try {
    const { ip, domain } = record;
    if (dnsRecord) {
      const { content } = dnsRecord;
      if (ip === content) {
        logger.info("Skipped updating.", { domain: domain.name });
      } else {
        logger.info("Started updating.", { domain: domain.name });
        return await update(ctx, record, zoneId, dnsRecord);
      }
    } else if (domain.create) {
      logger.info("Started creating.", { domain: domain.name });
      return await create(ctx, record, zoneId);
    } else {
      logger.info("Skipped creating.", { domain: domain.name });
    }
    return undefined;
  } finally {
    logger.debug("End");
  }
};

export const updateDns = async (
  ctx: Context,
  record: Record
): Promise<DNSRecord | undefined> => {
  const logger = ctx.logger.child({ method: "updateDns" });
  try {
    logger.debug("Start");
    const zoneId = await getZoneId(ctx, record);
    const dnsRecord = await getDNSRecord(ctx, record, zoneId);
    return updateOrCreate(ctx, record, zoneId, dnsRecord);
  } finally {
    logger.debug("End");
  }
};
