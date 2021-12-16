import type { IpEchoFunction } from "@cloudflare-ddns/ip-echo-parser";

import optionsSchema from "./options.schema.json";

interface Options {
  trim?: boolean;
}

export const parser: IpEchoFunction<Options> = async (echo, opts) => {
  const { trim = false } = opts;
  return trim ? echo.trim() : echo;
};

export const schema = optionsSchema;
