import {
  createDNSRecord,
  listDNSRecords,
  listZones,
  updateDNSRecords
} from "@cloudflare-ddns/api";
import { first } from "lodash-es";
import { parseZoneName } from "@cloudflare-ddns/config";
import { CloudflareApiError, CloudflareError } from "./error.js";

import type { Domain } from "@cloudflare-ddns/config";
import type { Context } from "./context.js";

interface Record {
  domain: Domain;
  ip: string;
}

const getZoneId = async (ctx: Context, record: Record): Promise<string> => {
  const { domain } = record;
  if (domain.zoneId) {
    return domain.zoneId;
  }
  const { auth, api: baseURL, timeout } = ctx.config;
  const { zoneName } = domain;
  const name = zoneName ? zoneName : parseZoneName(domain.name);
  const res = await listZones({
    auth,
    params: { name },
    baseURL,
    timeout
  });
  const { success, errors, result } = res;
  if (!success || !result) {
    throw new CloudflareApiError(errors);
  }
  const zoneId = first(result)?.id;
  if (!zoneId) {
    throw new CloudflareError("No match zone found");
  }
  return zoneId;
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
  const { auth, api: baseUrl, timeout } = ctx.config;
  const { name, type } = record.domain;
  const res = await listDNSRecords({
    auth,
    params: { name, type },
    zoneId,
    baseUrl,
    timeout
  });
  const { success, errors, result } = res;
  if (!success || !result) {
    throw new CloudflareApiError(errors);
  }
  return first(result);
};

const update = async (
  ctx: Context,
  record: Record,
  zoneId: string,
  dnsRecord: DNSRecord
): Promise<DNSRecord> => {
  const { auth, api: baseUrl, timeout } = ctx.config;
  const { name, type, proxied } = record.domain;
  const { ttl, id: recordId } = dnsRecord;
  const res = await updateDNSRecords({
    auth,
    data: { content: record.ip, name, type, proxied, ttl },
    zoneId,
    recordId,
    baseUrl,
    timeout
  });
  const { success, errors, result } = res;
  if (!success || !result) {
    throw new CloudflareApiError(errors);
  }
  return result;
};

const create = async (
  ctx: Context,
  record: Record,
  zoneId: string
): Promise<DNSRecord> => {
  const { auth, api: baseUrl, timeout } = ctx.config;
  const { name, type, proxied } = record.domain;
  const res = await createDNSRecord({
    auth,
    data: { content: record.ip, name, type, proxied, ttl: 1 },
    zoneId,
    baseUrl,
    timeout
  });
  const { success, errors, result } = res;
  if (!success || !result) {
    throw new CloudflareApiError(errors);
  }
  return result;
};

const updateOrCreate = async (
  ctx: Context,
  record: Record,
  zoneId: string,
  dnsRecord?: DNSRecord
): Promise<DNSRecord | undefined> => {
  const { logger } = ctx;
  const { ip, domain } = record;
  if (dnsRecord) {
    const { content } = dnsRecord;
    if (ip === content) {
      logger.info({ domain: domain.name }, "Skipped updating.");
    } else {
      logger.info({ domain: domain.name }, "Started updating.");
      return await update(ctx, record, zoneId, dnsRecord);
    }
  } else if (domain.create) {
    logger.info({ domain: domain.name }, "Started creating.");
    return await create(ctx, record, zoneId);
  } else {
    logger.info({ domain: domain.name }, "Skipped creating.");
  }
  return undefined;
};

export const updateDns = async (
  ctx: Context,
  record: Record
): Promise<DNSRecord | undefined> => {
  const zoneId = await getZoneId(ctx, record);
  const dnsRecord = await getDNSRecord(ctx, record, zoneId);
  return updateOrCreate(ctx, record, zoneId, dnsRecord);
};
