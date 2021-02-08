import type { IpEchoFunction } from "@cloudflare-ddns/ip-echo-parser";
import lodash from "lodash";

import optionsSchema from "./options.schema.json";

interface Options {
  fields: string[];
}

export const parser: IpEchoFunction<Options> = async (echo, opts) => {
  const { fields } = opts;
  const data = JSON.parse(echo);
  const ip = lodash.get(data, fields);
  if (!lodash.isString(ip)) {
    throw new Error(`Expect ${fields.join(".")} to be string. Actual: ${ip}`);
  }
  return ip;
};
export const schema = optionsSchema;
