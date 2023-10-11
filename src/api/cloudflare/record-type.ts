import { Type } from "@sinclair/typebox";

import type { Static } from "@sinclair/typebox";

export const recordType = Type.Union([
  Type.Literal("A"),
  Type.Literal("AAAA"),
  Type.Literal("CAA"),
  Type.Literal("CERT"),
  Type.Literal("CNAME"),
  Type.Literal("DNSKEY"),
  Type.Literal("DS"),
  Type.Literal("HTTPS"),
  Type.Literal("LOC"),
  Type.Literal("MX"),
  Type.Literal("NAPTR"),
  Type.Literal("NS"),
  Type.Literal("PTR"),
  Type.Literal("SMIMEA"),
  Type.Literal("SRV"),
  Type.Literal("SSHFP"),
  Type.Literal("SVCB"),
  Type.Literal("TLSA"),
  Type.Literal("TXT"),
  Type.Literal("URI")
]);

export type RecordType = Static<typeof recordType>;
