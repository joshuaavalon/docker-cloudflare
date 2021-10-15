import _ from "lodash";
import axios from "axios";
import { isIPv4, isIPv6 } from "net";
import { IpEcho } from "@cloudflare-ddns/config";
import { getParser } from "@cloudflare-ddns/ip-echo-parser";
import { verifySchema } from "@cloudflare-ddns/schema";

import { Context } from "./context";

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
  const res = await axios.get<string>(url, { transformResponse: d => d });
  const { parser, schema } = await getParser(type);
  const validOpts = schema ? await verifySchema(schema, opts) : opts;
  return parser(res.data, validOpts);
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
      } catch (e) {
        ctx.logger.warn(
          `Fail to fetch ip from ${url}. (${_.get(e, "message", e)})`
        );
      }
    }
    throw new Error("Cannot fetch any IPs!");
  };

export const fetchIPv4 = fetchIP(checkIPv4);
export const fetchIPv6 = fetchIP(checkIPv6);
