import fetch, { RequestInfo, Response } from "node-fetch";
import _ from "lodash";
import { isIPv4, isIPv6 } from "net";
import { IpEcho, isIpJsonEcho } from "./config/ip";

const throwIfFail = (response: Response): void => {
  if (!response.ok) {
    throw new Error("Fail to fetch IP");
  }
};

const fetchRequest = async (url: RequestInfo): Promise<Response> => {
  const res = await fetch(url);
  throwIfFail(res);
  return res;
};

export const fetchJson = async (url: RequestInfo): Promise<any> => {
  const res = await fetchRequest(url);
  return res.json();
};

export const fetchText = async (url: RequestInfo): Promise<any> => {
  const res = await fetchRequest(url);
  return res.text();
};

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

const fetchIPv4Json = async (
  fields: string[],
  url: string
): Promise<string> => {
  const data = await fetchJson(url);
  const value = _.get(data, fields);
  checkIPv4(value);
  return value;
};

const fetchIPv6Json = async (
  fields: string[],
  url: string
): Promise<string> => {
  const data = await fetchJson(url);
  const value = _.get(data, fields);
  checkIPv6(value);
  return value;
};

const fetchIPv4Text = async (url: string): Promise<string> => {
  const value = await fetchText(url);
  checkIPv4(value);
  return value;
};

const fetchIPv6Text = async (url: string): Promise<string> => {
  const value = await fetchText(url);
  checkIPv6(value);
  return value;
};

const cacheFetchJson = (fetchJson: FetchJson): FetchJson =>
  _.memoize(fetchJson, (fields: string[], url: string) =>
    JSON.stringify({ fields, url })
  );

const cacheFetchText = (fetchText: FetchText): FetchText =>
  _.memoize(fetchText);

type FetchText = (url: string) => Promise<string>;
type FetchJson = (fields: string[], info: string) => Promise<string>;

const fetchIP = (fetchText: FetchText, fetchJson: FetchJson) => async (
  ipEchos: IpEcho[]
): Promise<string> => {
  let index = 0;
  while (index < ipEchos.length) {
    const ipEcho = ipEchos[index];
    const { url } = ipEcho;
    try {
      if (isIpJsonEcho(ipEcho)) {
        const { fields } = ipEcho;
        return await fetchJson(fields, url);
      }
      return await fetchText(url);
    } catch (e) {
      console.error(`Fail to fetch ip from ${url}. (${e.message})`);
    }
    index++;
  }
  throw new Error("Cannot fetch any IPs!");
};

export const fetchIPv4 = fetchIP(
  cacheFetchText(fetchIPv4Text),
  cacheFetchJson(fetchIPv4Json)
);
export const fetchIPv6 = fetchIP(
  cacheFetchText(fetchIPv6Text),
  cacheFetchJson(fetchIPv6Json)
);
