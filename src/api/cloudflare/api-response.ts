import { Type } from "@sinclair/typebox";
import { message } from "./message.js";

import type { Static } from "@sinclair/typebox";

export const apiResponse = Type.Object({
  success: Type.Boolean(),
  errors: Type.Array(message),
  messages: Type.Array(message)
});

export type ApiResponse = Static<typeof apiResponse>;
