import type { IpEchoFunction } from "@cloudflare-ddns/ip-echo-parser";

import optionsSchema from "./options.schema.json";

interface Options {
  field: string;
}

export const parser: IpEchoFunction<Options> = async (echo, opts) => {
  const { field } = opts;
  for (const line of echo.split("\n")) {
    const result = /(?<key>.+?)=(?<value>.+)/u.exec(line);
    if (result?.groups?.key === field) {
      return result.groups.value;
    }
  }
  throw new Error(`Cannot find field (${field})`);
};
export const schema = optionsSchema;
