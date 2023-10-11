/**
 * https://developers.cloudflare.com/api/operations/dns-records-for-a-zone-list-dns-records
 */

import { Type } from "@sinclair/typebox";
import {
  aRecord,
  aaaaRecord,
  apiQueryResponse,
  recordType
} from "./cloudflare/index.js";

import type { Static } from "@sinclair/typebox";
import type { PathFn } from "./type.js";

export const params = Type.Object({
  zoneId: Type.String({ minLength: 1, maxLength: 32 })
});
export type Params = Static<typeof params>;

export const query = Type.Object({
  name: Type.Optional(Type.String({ minLength: 1, maxLength: 255 })),
  type: Type.Optional(recordType)
});
export type Query = Static<typeof query>;

export const body = Type.Undefined();
export type Body = Static<typeof body>;

export const response = Type.Composite([
  apiQueryResponse,
  Type.Object({ result: Type.Array(Type.Union([aRecord, aaaaRecord])) })
]);
export type Response = Static<typeof response>;

export const method = "GET";
export const pathFn: PathFn<Params> = params =>
  `zones/${params.zoneId}/dns_records`;
