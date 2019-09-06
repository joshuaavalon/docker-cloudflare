import { has, prop, propEq } from "ramda";

export type RecordType = "A" | "AAAA";

type BaseDomain = {
  name: string;
  type: RecordType;
  proxied: boolean;
  create: boolean;
};

export type ZoneIdDomain = BaseDomain & { zoneId: string };
export type ZoneNameDomain = BaseDomain & { zoneName: string };
export type Domain = ZoneIdDomain | ZoneNameDomain;

export const isZoneIdDomain = (domain: Domain): domain is ZoneIdDomain =>
  has("zoneId", domain);

export const getZoneId = prop<ZoneIdDomain, "zoneId">("zoneId");
export const getZoneName = prop<ZoneNameDomain, "zoneName">("zoneName");
export const getDomainName = prop<Domain, "name">("name");
export const getDomainType = prop<Domain, "type">("type");
export const getDomainProxied = prop<Domain, "proxied">("proxied");
export const getCreate = prop<Domain, "create">("create");
export const isIPv4 = propEq("type", "A");
