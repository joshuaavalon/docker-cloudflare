import { createApi } from "./create-api/index.js";

interface Argument {
  zoneId: string;
}

interface Parameter {
  match?: "any" | "all";
  name?: string;
  order?: "type" | "name" | "content" | "ttl" | "proxied";
  page?: number;
  per_page?: number;
  content?: string;
  type?: string;
  proxied?: boolean;
  direction?: "asc" | "desc";
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

export const listDNSRecords = createApi<
  Result[],
  Parameter | undefined,
  undefined,
  Argument
>({
  path: req => `/zones/${req.zoneId}/dns_records`,
  method: "GET"
});
