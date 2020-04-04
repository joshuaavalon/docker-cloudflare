import _ from "lodash";

import { Webhook } from "./webhook";

export type RecordType = "A" | "AAAA";

type BaseDomain = {
  name: string;
  type: RecordType;
  proxied: boolean;
  create: boolean;
  webhook?: Webhook;
};

export type ZoneIdDomain = BaseDomain & { zoneId: string };
export type ZoneNameDomain = BaseDomain & { zoneName: string };
export type Domain = ZoneIdDomain | ZoneNameDomain;

export const isZoneIdDomain = (domain: Domain): domain is ZoneIdDomain =>
  _.has(domain, "zoneId");

export const getZoneId = (domain: ZoneIdDomain): string => domain.zoneId;
export const getZoneName = (domain: ZoneNameDomain): string => domain.zoneName;
export const getDomainName = (domain: Domain): string => domain.name;
export const getDomainType = (domain: Domain): RecordType => domain.type;
export const getDomainProxied = (domain: Domain): boolean => domain.proxied;
export const getCreate = (domain: Domain): boolean => domain.create;
export const getWebhook = (domain: Domain): Webhook | undefined =>
  domain.webhook;
export const isIPv4 = (domain: BaseDomain): boolean => domain.type === "A";
