import { createApi } from "./create-api/index.js";

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

export const createDNSRecord = createApi<Result, undefined, Data, Argument>({
  path: req => `/zones/${req.zoneId}/dns_records`,
  method: "POST"
});
