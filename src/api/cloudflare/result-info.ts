import { Type } from "@sinclair/typebox";
import type { Static } from "@sinclair/typebox";

export const resultInfo = Type.Object({
  count: Type.Number(),
  page: Type.Number(),
  per_page: Type.Number(),
  total_count: Type.Number()
});

export type ResultInfo = Static<typeof resultInfo>;
