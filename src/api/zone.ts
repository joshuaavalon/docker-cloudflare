import { always, converge, head, pipe, prop, tap, then } from "ramda";

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

const getApi = prop<ZoneContext, "api">("api");
const getAuth = prop<ZoneContext, "auth">("auth");
const getZoneName = prop<ZoneContext, "zoneName">("zoneName");
const getZoneId = prop<Zone, "id">("id");
const createListZonesQuery = pipe(getZoneName, (name: string) => ({ name }));

const getListZonesUrl = converge(resolveEndpoint, [
  getApi,
  always("zones"),
  createListZonesQuery
]);

/**
 * List zones with given name.
 *
 * Require permission: `#zone:read`
 *
 * @see https://api.cloudflare.com/#zone-list-zones
 */
export const listZones: Api<[ZoneContext], Zone[]> = converge(get, [
  getAuth,
  getListZonesUrl
]);

const firstZoneId: (res: ApiResponse<Zone[]>) => string = pipe(
  getApiResult,
  head,
  tap<Zone>((zone?: Zone) => {
    if (!zone) {
      // This should never happen because Cloudflare return success = false if there is no matching domain
      throw new Error("No match zone found");
    }
  }),
  getZoneId
);

/**
 * Fetch zone id by zone name.
 *
 * Requires `#zone:read`.
 */
export const fetchZoneId = pipe(listZones, then(firstZoneId));
