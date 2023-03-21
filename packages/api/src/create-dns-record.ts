import { axiosInstance, createRequestConfig } from "./base.js";

import type { Api } from "./base.js";

interface Argument {
  zoneId: string;
}

interface Data {
  content: string;
  type: string;
  name: string;
  ttl: number;
  proxied?: boolean;
  priority?: number;
}

interface Result {
  id: string;
  type: string;
  name: string;
  content: string;
  proxiable: boolean;
  proxied: boolean;
  ttl: number;
  locked: boolean;
  zone_id: string;
  zone_name: string;
  created_on: string;
  modified_on: string;
}

export const createDNSRecord: Api<Result, undefined, Data, Argument> = req => {
  const { zoneId, data, ...others } = req;
  return axiosInstance.post(
    `/zones/${zoneId}/dns_records`,
    data,
    createRequestConfig(others)
  );
};
