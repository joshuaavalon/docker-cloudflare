import type { IpEchoFunction } from "@cloudflare-ddns/ip-echo-parser";

import optionsSchema from "./options.schema.json";

export const parser: IpEchoFunction = async echo => echo;
export const schema = optionsSchema;
