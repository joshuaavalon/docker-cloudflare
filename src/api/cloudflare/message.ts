import { Type } from "@sinclair/typebox";

import type { Static } from "@sinclair/typebox";

export const message = Type.Object({
  code: Type.Boolean(),
  message: Type.String()
});

export type Message = Static<typeof message>;
