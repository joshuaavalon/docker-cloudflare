import axios from "axios";
import { isIPv4, isIPv6 } from "net";
import _ from "lodash";

import { IpEcho } from "./config";
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

const fetchIni = async (field: string, url: string): Promise<string> => {
  const res = await axios.get(url);
  const ini: string = res.data;
  for (const line of ini.split("\n")) {
    const result = /(?<key>.+?)=(?<value>.+)/u.exec(line);
    if (result?.groups?.key === field) {
      return result.groups.value;
    }
  }
  throw new Error(`Cannot find field (${field})`);
};

const fetchIpEcho = (ipEcho: IpEcho): Promise<string> => {
  const { url } = ipEcho;
  switch (ipEcho.type) {
    case "json":
      return fetchJson(ipEcho.fields, url);
    case "text":
      return fetchText(url);
    case "ini":
      return fetchIni(ipEcho.field, url);
    default:
      throw new Error("Unknown type");
  }
};

const fetchIP = (checkIp: CheckIp) => async (
  ctx: Context,
  ipEchos: IpEcho[]
): Promise<string> => {
  for (const ipEcho of ipEchos) {
    const { url } = ipEcho;
    try {
      const ip = await fetchIpEcho(ipEcho);
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
