import { axiosInstance, createRequestConfig } from "./base.js";

import type { Api } from "./base.js";

interface Parameter {
  match?: "any" | "all";
  name?: string;
  order?: "name" | "status" | "account.id" | "account.name";
  "account.name"?: string;
  status?: string;
  "account.id"?: string;
  page?: number;
  per_page?: number;
  direction?: "asc" | "desc";
}

interface Result {
  id: string;
  name: string;
  original_name_servers: string[];
  original_registrar: string;
  original_dnshost: string;
  created_on: string;
  modified_on: string;
  activated_on: string;
  owner: {
    id: string;
    email: string;
    type: string;
  };
  account: {
    id: string;
    name: string;
  };
  permissions: string[];
  plan: {
    id: string;
    name: string;
    price: number;
    currency: string;
    frequency: string;
    is_subscribed: boolean;
    can_subscribe: boolean;
    legacy_id: string;
    legacy_discount: boolean;
    externally_managed: boolean;
  };
  status: string;
  paused: boolean;
  type: string;
  name_servers: string[];
}

export const listZones: Api<Result[], Parameter | undefined> = req =>
  axiosInstance.get("/zones", createRequestConfig(req));
