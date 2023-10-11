import type { CloudflareApi } from "#api";
import type { Context } from "#context";
import type { DNSRecord, Record } from "./type.js";

async function update(
  ctx: Context,
  api: CloudflareApi,
  record: Record,
  zoneId: string,
  dnsRecord: DNSRecord
): Promise<DNSRecord> {
  const { name, type, proxied } = record.domain;
  const { ttl, id } = dnsRecord;
  const res = await api.updateDnsRecord(ctx, { zoneId, id }, undefined, {
    content: record.ip,
    name,
    type,
    proxied,
    ttl
  });
  return res.result;
}

const create = async (
  ctx: Context,
  api: CloudflareApi,
  record: Record,
  zoneId: string
): Promise<DNSRecord> => {
  const { name, type, proxied } = record.domain;
  const res = await api.createDnsRecord(ctx, { zoneId }, undefined, {
    content: record.ip,
    name,
    type,
    proxied,
    ttl: 1
  });
  return res.result;
};

export async function upsert(
  ctx: Context,
  api: CloudflareApi,
  record: Record,
  zoneId: string,
  dnsRecord?: DNSRecord
): Promise<DNSRecord | undefined> {
  const { logger } = ctx;
  const { ip, domain } = record;
  if (dnsRecord) {
    const { content } = dnsRecord;
    if (ip === content) {
      logger.info({ domain: domain.name }, "Skipped updating.");
    } else {
      logger.info({ domain: domain.name }, "Started updating.");
      return update(ctx, api, record, zoneId, dnsRecord);
    }
  } else if (domain.create) {
    logger.info({ domain: domain.name }, "Started creating.");
    return create(ctx, api, record, zoneId);
  } else {
    logger.info({ domain: domain.name }, "Skipped creating.");
  }
  return undefined;
}
