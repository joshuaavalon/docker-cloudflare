import { Response } from "node-fetch";
import _ from "lodash";
import { URL, URLSearchParams } from "url";

export const toJson = <T extends any>(response: Response): Promise<T> =>
  response.json();

export const toQueryString = (value: Record<string, any>): string =>
  new URLSearchParams(value).toString();

export const updateUrl = (url: URL, query: Record<string, any>): URL => {
  _.forEach(query, (value, key) => url.searchParams.set(key, value));
  return url;
};
