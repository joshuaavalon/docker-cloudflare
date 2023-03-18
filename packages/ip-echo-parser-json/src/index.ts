import { Type } from "@sinclair/typebox";
import { get, isString } from "lodash-es";

import type { IpEchoFunction } from "@cloudflare-ddns/ip-echo-parser";

export const schema = Type.Object(
  {
    fields: Type.Array(Type.String())
  },
  {
    $id: "https://joshuaavalon.github.io/docker-cloudflare/ip-echo-parser-json/options.schema.json",
    additionalProperties: false
  }
);

export const parser: IpEchoFunction<typeof schema> = async (echo, opts) => {
  const { fields } = opts;
  const data = JSON.parse(echo);
  const ip = get(data, fields);
  if (!isString(ip)) {
    throw new Error(`Expect ${fields.join(".")} to be string. Actual: ${ip}`);
  }
  return ip;
};
