import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

import { ApiResponse, ListParameter } from "./model";

export const axiosInstance = axios.create({
  baseURL: "https://api.cloudflare.com/client/v4/",
  headers: {
    "Content-Type": "application/json"
  }
});

export interface GlobalAuth {
  /**
   * Cloudflare account email
   */
  email: string;
  /**
   * Cloudflare API Key
   */
  globalToken: string;
}

export interface ScopedAuth {
  /**
   * Cloudflare API token
   */
  scopedToken: string;
}

export type Auth = GlobalAuth | ScopedAuth;

const createAuthHeaders = (auth: Auth): Record<string, string> =>
  "scopedToken" in auth
    ? { Authorization: `Bearer ${auth.scopedToken}` }
    : { "X-Auth-Email": auth.email, "X-Auth-Key": auth.globalToken };

export type ApiRequest<TParam, TData> = {
  baseURL?: string;
  auth: Auth;
} & (TParam extends undefined
  ? { params?: ListParameter & TParam }
  : { params: ListParameter & TParam }) &
  (TData extends undefined ? { data?: TData } : { data: TData });

export const createRequestConfig = (
  req: ApiRequest<any, any>
): AxiosRequestConfig => {
  const { baseURL, params, auth } = req;
  return {
    baseURL,
    params,
    headers: createAuthHeaders(auth)
  };
};

export interface Api<
  TResult,
  TParam = undefined,
  TData = undefined,
  TArg = Record<string, unknown>
> {
  (req: ApiRequest<TParam, TData> & TArg): Promise<
    AxiosResponse<ApiResponse<TResult>>
  >;
}
