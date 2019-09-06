import fetch, { HeadersInit } from "node-fetch";
import { assoc, binary, ifElse, pipe } from "ramda";

import { Auth, GlobalAuth, isGlobalAuth, ScopedAuth } from "@/config";
import { toJson } from "@/fetch";

import { throwFailure } from "./response";

type SetHeaders = (header: HeadersInit) => HeadersInit;
const setScopedAuthHeaders = (auth: ScopedAuth): SetHeaders =>
  assoc("Authorization", `Bearer ${auth.scopedToken}`);

const setGlobalAuthHeaders = (auth: GlobalAuth): SetHeaders =>
  pipe(
    assoc("X-Auth-Email", auth.email),
    assoc("X-Auth-Key", auth.globalToken)
  );

const setAuthHeaders = ifElse(
  isGlobalAuth,
  setGlobalAuthHeaders,
  setScopedAuthHeaders
);

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

export const get = binary(createFetch("GET"));
export const post = createFetch("POST");
export const put = createFetch("PUT");
