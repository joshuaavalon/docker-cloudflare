/**
 * https://developers.cloudflare.com/api/operations/zones-get
 */

import { Type } from "@sinclair/typebox";
import { apiQueryResponse, zone } from "./cloudflare/index.js";

import type { Static } from "@sinclair/typebox";
import type { PathFn } from "./type.js";

export const params = Type.Undefined();
export type Params = Static<typeof params>;

export const query = Type.Object({
  name: Type.Optional(Type.String({ minLength: 1, maxLength: 253 }))
});
export type Query = Static<typeof query>;

export const body = Type.Undefined();
export type Body = Static<typeof body>;

export const response = Type.Composite([
  apiQueryResponse,
  Type.Object({ result: Type.Array(zone) })
]);
export type Response = Static<typeof response>;

export const method = "GET";
export const pathFn: PathFn<Params> = () => "zones";
