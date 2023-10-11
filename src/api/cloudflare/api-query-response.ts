import { Type } from "@sinclair/typebox";
import { apiResponse } from "./api-response.js";
import { resultInfo } from "./result-info.js";

import type { Static } from "@sinclair/typebox";

export const apiQueryResponse = Type.Composite([
  apiResponse,
  Type.Object({
    result_info: resultInfo
  })
]);

export type ApiQueryResponse = Static<typeof apiQueryResponse>;
