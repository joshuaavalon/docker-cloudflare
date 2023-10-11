import type { IpEchoFunction } from "../type.js";
import type { schema } from "./options.js";

export const customParser: IpEchoFunction<typeof schema> = async (
  echo,
  opts
) => {
  const { func } = opts;
  return func(echo);
};

export type CustomParser = typeof customParser;
