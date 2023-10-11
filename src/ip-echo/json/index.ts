import { get, isString } from "lodash-es";

import type { IpEchoFunction } from "../type.js";
import type { schema } from "./options.js";

export const jsonParser: IpEchoFunction<typeof schema> = async (echo, opts) => {
  const { fields } = opts;
  const data = JSON.parse(echo);
  const ip = get(data, fields);
  if (!isString(ip)) {
    throw new Error(`Expect ${fields.join(".")} to be string. Actual: ${ip}`);
  }
  return ip;
};

export type JsonParser = typeof jsonParser;
