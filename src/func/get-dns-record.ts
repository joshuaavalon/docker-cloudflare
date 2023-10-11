import { first } from "lodash-es";

import type { CloudflareApi } from "#api";
import type { Context } from "#context";
import type { DNSRecord, Record } from "./type.js";

export async function getDnsRecord(
  ctx: Context,
  api: CloudflareApi,
  record: Record,
  zoneId: string
): Promise<DNSRecord | undefined> {
  const { name, type } = record.domain;
  const res = await api.listDnsRecords(
    ctx,
    { zoneId },
    { name, type },
    undefined
  );
  return first(res.result);
}
