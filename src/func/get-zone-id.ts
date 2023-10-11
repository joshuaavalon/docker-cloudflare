import { first } from "lodash-es";

import type { CloudflareApi } from "#api";
import type { Context } from "#context";
import type { Record } from "./type.js";

function parseZoneName(domain: string): string {
  const parts = domain.split(".");
  if (parts.length < 2) {
    throw new Error(
      `Unable to parse zoneName from "${domain}". Please specific either zoneId or zoneName in configuration.`
    );
  }
  return `${parts[parts.length - 2]}.${parts[parts.length - 1]}`;
}

export async function getZoneId(
  ctx: Context,
  api: CloudflareApi,
  record: Record
): Promise<string> {
  const { domain } = record;
  if (domain.zoneId) {
    return domain.zoneId;
  }
  const { zoneName } = domain;
  const name = zoneName ? zoneName : parseZoneName(domain.name);
  const res = await api.listZones(ctx, undefined, { name }, undefined);
  const zoneId = first(res.result)?.id;
  if (!zoneId) {
    throw new Error("No match zone found");
  }
  return zoneId;
}
