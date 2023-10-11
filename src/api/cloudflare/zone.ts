import { Type } from "@sinclair/typebox";

import type { Static } from "@sinclair/typebox";

export const zone = Type.Object({
  name: Type.String({ maxLength: 253 }),
  id: Type.String({ maxLength: 32 })
});

export type Zone = Static<typeof zone>;
