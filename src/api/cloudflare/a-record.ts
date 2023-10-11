import { Type } from "@sinclair/typebox";

import type { Static } from "@sinclair/typebox";

export const aRecord = Type.Object({
  content: Type.String({ format: "ipv4" }),
  name: Type.String({ maxLength: 255 }),
  proxied: Type.Optional(Type.Boolean()),
  type: Type.Literal("A"),
  id: Type.String({ maxLength: 32 }),
  ttl: Type.Optional(
    Type.Union([Type.Literal(1), Type.Number({ minimum: 60, maximum: 86400 })])
  )
});

export type ARecord = Static<typeof aRecord>;
