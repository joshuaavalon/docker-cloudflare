import { createApi } from "./create-api/index.js";

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

export const updateDNSRecords = createApi<Result, undefined, Data, Argument>({
  path: req => `/zones/${req.zoneId}/dns_records/${req.recordId}`,
  method: "PUT"
});
