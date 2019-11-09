import { Response } from "node-fetch";
import { construct, forEachObjIndexed, pipe, tap } from "ramda";
import { URL, URLSearchParams } from "url";

export const toJson = <T extends any>(response: Response): Promise<T> =>
  response.json();

export const toQueryString = (value: Record<string, any>): string =>
  new URLSearchParams(value).toString();

export const updateUrl = (query: Record<string, any>): ((url: URL) => URL) =>
  tap((url: URL) =>
    forEachObjIndexed<Record<string, any>>(
      (value, key) => url.searchParams.set(key, value),
      query
    )
  );

export const createUrl = (
  query: Record<string, any>
): ((url: string) => string) =>
  pipe(construct(URL), updateUrl(query), (url: URL) => url.toString());
