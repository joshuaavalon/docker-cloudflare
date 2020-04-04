import _ from "lodash";

import { Auth } from "@/config";

import { resolveEndpoint } from "./endpoint";
import { get } from "./request";
import { Api, ApiResponse, getApiResult } from "./response";

type Zone = { id: string; name: string };

type ZoneContext = {
  auth: Auth;
  api: string;
  zoneName: string;
};

const getApi = (context: ZoneContext): string => context.api;
const getAuth = (context: ZoneContext): Auth => context.auth;
const getZoneName = (context: ZoneContext): string => context.zoneName;
const getZoneId = (zone: Zone): string => zone.id;

type ListZonesQuery = {
  name: string;
};
const createListZonesQuery = (context: ZoneContext): ListZonesQuery => ({
  name: getZoneName(context)
});

const getListZonesUrl = (context: ZoneContext): string => {
  const api = getApi(context);
  const query = createListZonesQuery(context);
  return resolveEndpoint(api, "zones", query);
};

/**
 * List zones with given name.
 *
 * Require permission: `#zone:read`
 *
 * @see https://api.cloudflare.com/#zone-list-zones
 */
export const listZones: Api<[ZoneContext], Zone[]> = context => {
  const auth = getAuth(context);
  const url = getListZonesUrl(context);
  return get(auth, url);
};

const firstZoneId = (res: ApiResponse<Zone[]>): string => {
  const result = getApiResult(res);
  const zone = _.first(result);
  if (!zone) {
    // This should never happen because Cloudflare return success = false if there is no matching domain
    throw new Error("No match zone found");
  }
  return getZoneId(zone);
};

/**
 * Fetch zone id by zone name.
 *
 * Requires `#zone:read`.
 */
export const fetchZoneId = async (context: ZoneContext): Promise<string> => {
  const zones = await listZones(context);
  return firstZoneId(zones);
};
