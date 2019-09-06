import fetch, { Response } from "node-fetch";
import { identity, memoizeWith, path, pipe, tap, then, unary } from "ramda";
import { isIPv4, isIPv6 } from "net";
import { IpEcho, isIpJsonEcho } from "./config/ip";

const asJson = (response: Response): Promise<any> => response.json();
const asText = (response: Response): Promise<string> => response.text();
const throwIfFail = (response: Response): void => {
  if (!response.ok) {
    throw new Error("Fail to fetch IP");
  }
};

const fetchRequest = pipe(
  unary(fetch),
  then(tap(throwIfFail))
);

export const fetchJson = pipe(
  fetchRequest,
  then(asJson)
);

export const fetchText = pipe(
  fetchRequest,
  then(asText)
);

const checkIPv4 = (ip: string): void => {
  if (!isIPv4(ip)) {
    throw new Error(`Not IPv4: ${ip}`);
  }
};

const guardIPv4 = tap(checkIPv4);

const checkIPv6 = (ip: string): void => {
  if (!isIPv6(ip)) {
    throw new Error(`Not IPv6: ${ip}`);
  }
};

const guardIPv6 = tap(checkIPv6);

const fetchIPv4Json = (fields: string[], url: string): Promise<string> =>
  pipe(
    fetchJson,
    then(path(fields)),
    then(guardIPv4)
  )(url);

const fetchIPv6Json = (fields: string[], url: string): Promise<string> =>
  pipe(
    fetchJson,
    then(path(fields)),
    then(guardIPv6)
  )(url);

const fetchIPv4Text = pipe(
  fetchText,
  then(guardIPv4)
);

const fetchIPv6Text = pipe(
  fetchText,
  then(guardIPv6)
);

const cacheFetchJson = (fetchJson: FetchJson): FetchJson =>
  memoizeWith(
    (fields: string[], url: string) => JSON.stringify({ fields, url }),
    fetchJson
  );

const cacheFetchText = (fetchText: FetchText): FetchText =>
  memoizeWith(identity, fetchText);

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
