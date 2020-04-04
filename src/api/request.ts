import fetch, { HeadersInit } from "node-fetch";
import _ from "lodash";

import { Auth, GlobalAuth, isGlobalAuth, ScopedAuth } from "@/config";
import { toJson } from "@/fetch";

import { throwFailure } from "./response";

type SetHeaders = (header: HeadersInit) => HeadersInit;
const setScopedAuthHeaders = (auth: ScopedAuth): SetHeaders => header =>
  _.set(header, "Authorization", `Bearer ${auth.scopedToken}`);

const setGlobalAuthHeaders = (auth: GlobalAuth): SetHeaders => header => {
  const newHeader = _.set(header, "X-Auth-Email", auth.email);
  return _.set(newHeader, "X-Auth-Key", auth.globalToken);
};
const setAuthHeaders = (auth: Auth): SetHeaders =>
  isGlobalAuth(auth) ? setGlobalAuthHeaders(auth) : setScopedAuthHeaders(auth);

const createHeaders = (auth: Auth): HeadersInit =>
  setAuthHeaders(auth)({
    "Content-Type": "application/json"
  });

const createFetch = (method: string) => (
  auth: Auth,
  url: string,
  data?: Record<string, any>
) =>
  fetch(url, {
    method,
    headers: createHeaders(auth),
    body: JSON.stringify(data)
  })
    .then(toJson)
    .then(throwFailure);

export const get = createFetch("GET");
export const post = createFetch("POST");
export const put = createFetch("PUT");
