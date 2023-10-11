import { Type } from "@sinclair/typebox";

import type { Static } from "@sinclair/typebox";

export const aaaaRecord = Type.Object({
  content: Type.String({ format: "ipv6" }),
  name: Type.String({ maxLength: 255 }),
  proxied: Type.Optional(Type.Boolean()),
  type: Type.Literal("AAAA"),
  id: Type.String({ maxLength: 32 }),
  ttl: Type.Optional(
    Type.Union([Type.Literal(1), Type.Number({ minimum: 60, maximum: 86400 })])
  )
});

export type AaaaRecord = Static<typeof aaaaRecord>;
