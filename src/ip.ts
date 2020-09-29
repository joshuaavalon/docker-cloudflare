import axios from "axios";
import { isIPv4, isIPv6 } from "net";
import _ from "lodash";

import { IpEcho, isIpJsonEcho } from "./config";
import { Context } from "./context";

export class FetchIpError extends Error {}

interface CheckIp {
  (ip: string): void;
}

const checkIPv4 = (ip: string): void => {
  if (!isIPv4(ip)) {
    throw new FetchIpError(`Not IPv4: ${ip}`);
  }
};

const checkIPv6 = (ip: string): void => {
  if (!isIPv6(ip)) {
    throw new FetchIpError(`Not IPv6: ${ip}`);
  }
};

const fetchJson = async (fields: string[], url: string): Promise<string> => {
  const res = await axios.get(url);
  return _.get(res.data, fields);
};

const fetchText = async (url: string): Promise<string> => {
  const res = await axios.get(url);
  return res.data;
};

const fetchIP = (checkIp: CheckIp) => async (
  ctx: Context,
  ipEchos: IpEcho[]
): Promise<string> => {
  for (const ipEcho of ipEchos) {
    const { url } = ipEcho;
    try {
      const ip = isIpJsonEcho(ipEcho)
        ? await fetchJson(ipEcho.fields, url)
        : await fetchText(url);
      checkIp(ip);
      return ip;
    } catch (e) {
      ctx.logger.warn(`Fail to fetch ip from ${url}. (${e.message})`);
    }
  }
  throw new FetchIpError("Cannot fetch any IPs!");
};

export const fetchIPv4 = fetchIP(checkIPv4);
export const fetchIPv6 = fetchIP(checkIPv6);
