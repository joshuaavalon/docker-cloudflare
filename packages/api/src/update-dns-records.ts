import { axiosInstance, createRequestConfig } from "./base.js";

import type { Api } from "./base.js";

interface Argument {
  zoneId: string;
  recordId: string;
}

interface Data {
  content: string;
  type: string;
  name: string;
  ttl: number;
  proxied?: boolean;
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

export const updateDNSRecords: Api<Result, undefined, Data, Argument> = req => {
  const { zoneId, recordId, data, ...others } = req;
  return axiosInstance.put(
    `/zones/${zoneId}/dns_records/${recordId}`,
    data,
    createRequestConfig(others)
  );
};
