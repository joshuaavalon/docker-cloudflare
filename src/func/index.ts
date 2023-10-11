import { getZoneId } from "./get-zone-id.js";
import { getDnsRecord } from "./get-dns-record.js";
import { upsert } from "./upsert.js";

import type { CloudflareApi } from "#api";
import type { Context } from "#context";
import type { DNSRecord, Record } from "./type.js";

export async function updateDns(
  ctx: Context,
  api: CloudflareApi,
  record: Record
): Promise<DNSRecord | undefined> {
  const zoneId = await getZoneId(ctx, api, record);
  const dnsRecord = await getDnsRecord(ctx, api, record, zoneId);
  return upsert(ctx, api, record, zoneId, dnsRecord);
}
