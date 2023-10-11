import type { IpEchoFunction } from "../type.js";
import type { schema } from "./options.js";

export const textParser: IpEchoFunction<typeof schema> = async (echo, opts) => {
  const { trim } = opts;
  return trim ? echo.trim() : echo;
};

export type TextParser = typeof textParser;
