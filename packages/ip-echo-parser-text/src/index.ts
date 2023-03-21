import { Type } from "@sinclair/typebox";

import type { IpEchoFunction } from "@cloudflare-ddns/ip-echo-parser";

export const schema = Type.Object(
  {
    trim: Type.Boolean({ default: false })
  },
  {
    $id: "https://joshuaavalon.github.io/docker-cloudflare/ip-echo-parser-text/options.schema.json",
    additionalProperties: false
  }
);

export const parser: IpEchoFunction<typeof schema> = async (echo, opts) => {
  const { trim } = opts;
  return trim ? echo.trim() : echo;
};
