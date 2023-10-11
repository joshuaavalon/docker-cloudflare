import type { IpEchoFunction } from "../type.js";
import type { schema } from "./options.js";

export const iniParser: IpEchoFunction<typeof schema> = async (echo, opts) => {
  const { field } = opts;
  for (const line of echo.split("\n")) {
    const result = /(?<key>.+?)=(?<value>.+)/u.exec(line);
    if (result?.groups?.key === field) {
      return result.groups.value;
    }
  }
  throw new Error(`Cannot find field (${field})`);
};

export type IniParser = typeof iniParser;
