import { URL, URLSearchParams } from "node:url";
import { CloudflareApiError } from "./error.js";
import { joinUrl } from "./join-url.js";

import type { ApiRequest, ApiResponse } from "./type.js";

const defaultBaseUrl = "https://api.cloudflare.com/client/v4/";
const defaultHeaders: Record<string, string> = {
  "Content-Type": "application/json"
};

function getBaseUrl<TParam, TData, TArg>(
  req: ApiRequest<TParam, TData> & TArg
): string {
  const { baseUrl } = req;
  return baseUrl ?? defaultBaseUrl;
}

export interface CreateApiOptions<TParam, TData, TArg> {
  path: string | ((req: ApiRequest<TParam, TData> & TArg) => string);
  method: string;
}

export function createApi<
  TResult,
  TParam = undefined,
  TData = undefined,
  TArg = Record<string, unknown>
>(
  opts: CreateApiOptions<TParam, TData, TArg>
): (req: ApiRequest<TParam, TData> & TArg) => Promise<ApiResponse<TResult>> {
  const { path: pathFn, method } = opts;
  return async req => {
    const { params = {}, headers = {}, data, auth, timeout } = req;
    const baseUrl = getBaseUrl<TParam, TData, TArg>(req);
    const path = typeof pathFn === "string" ? pathFn : pathFn(req);
    const url = new URL(joinUrl(baseUrl, path));
    url.search = new URLSearchParams(params).toString();
    const authHeaders = { ...defaultHeaders };
    if (auth) {
      authHeaders.Authorization = `Bearer ${auth.scopedToken}`;
    }
    const res = await fetch(url.toString(), {
      method,
      headers: {
        ...authHeaders,
        ...headers
      },
      body: data ? JSON.stringify(data) : undefined,
      signal: timeout > 0 ? AbortSignal.timeout(timeout) : undefined
    });
    if (res.status !== 200) {
      const json = await res.json();
      const errors = Array.isArray(json.errors)
        ? json.errors
        : [JSON.stringify(json)];
      throw new CloudflareApiError(errors);
    }
    return res.json();
  };
}

export * from "./type.js";
