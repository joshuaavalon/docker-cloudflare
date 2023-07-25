import { isIPv4, isIPv6 } from "net";
import { getParser } from "@cloudflare-ddns/ip-echo-parser";
import { verifySchema } from "@cloudflare-ddns/schema";

import type { IpEcho } from "@cloudflare-ddns/config";
import type { Context } from "./context.js";

interface CheckIp {
  (ip: string): void;
}

const checkIPv4 = (ip: string): void => {
  if (!isIPv4(ip)) {
    throw new Error(`Not IPv4: ${ip}`);
  }
};

const checkIPv6 = (ip: string): void => {
  if (!isIPv6(ip)) {
    throw new Error(`Not IPv6: ${ip}`);
  }
};

const fetchIpEcho = async (ipEcho: IpEcho): Promise<string> => {
  const { url, type, ...opts } = ipEcho;
  const res = await fetch(url);
  const data = await res.text();
  const { parser, schema } = await getParser(type);
  const validOpts = schema ? await verifySchema(schema, opts) : opts;
  return parser(data, validOpts);
};

const fetchIP =
  (checkIp: CheckIp) =>
  async (ctx: Context, ipEchos: IpEcho[]): Promise<string> => {
    for (const ipEcho of ipEchos) {
      const { url } = ipEcho;
      try {
        const ip = await fetchIpEcho(ipEcho);
        checkIp(ip);
        return ip;
      } catch (err) {
        ctx.logger.warn(`Fail to fetch ip from ${url}.`, { err });
      }
    }
    throw new Error("Cannot fetch any IPs!");
  };

export const fetchIPv4 = fetchIP(checkIPv4);
export const fetchIPv6 = fetchIP(checkIPv6);
