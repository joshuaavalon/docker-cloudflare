import { Type } from "@sinclair/typebox";

import type { IpEchoFunction } from "@cloudflare-ddns/ip-echo-parser";

export const schema = Type.Object(
  {
    field: Type.String()
  },
  {
    $id: "https://joshuaavalon.github.io/docker-cloudflare/ip-echo-parser-ini/options.schema.json",
    additionalProperties: false
  }
);

export const parser: IpEchoFunction<typeof schema> = async (echo, opts) => {
  const { field } = opts;
  for (const line of echo.split("\n")) {
    const result = /(?<key>.+?)=(?<value>.+)/u.exec(line);
    if (result?.groups?.key === field) {
      return result.groups.value;
    }
  }
  throw new Error(`Cannot find field (${field})`);
};
