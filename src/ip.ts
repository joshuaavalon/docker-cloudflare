import { isIPv4, isIPv6 } from "node:net";
import { getParser } from "#ip-echo";

import type { IpEcho } from "#config";
import type { Context } from "#context";

const fetchIpEcho = async (ipEcho: IpEcho): Promise<string> => {
  const { url, type, ...opts } = ipEcho;
  const res = await fetch(url);
  const data = await res.text();
  const parser = getParser(type);
  return parser(data, opts as any);
};

const fetchIP =
  (checkIp: (ip: string) => boolean) =>
  async (ctx: Context, ipEchos: IpEcho[]): Promise<string> => {
    for (const ipEcho of ipEchos) {
      const { url } = ipEcho;
      try {
        const ip = await fetchIpEcho(ipEcho);
        if (!checkIp(ip)) {
          throw new Error(`Not valid IP (${ip})`);
        }
        return ip;
      } catch (err) {
        ctx.logger.warn({ err }, `Fail to fetch ip from ${url}.`);
      }
    }
    throw new Error("Cannot fetch any IPs!");
  };

export const fetchIPv4 = fetchIP(isIPv4);
export const fetchIPv6 = fetchIP(isIPv6);
