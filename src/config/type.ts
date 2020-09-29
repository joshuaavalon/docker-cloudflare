import _ from "lodash";

export interface GlobalAuth {
  /**
   * Cloudflare account email
   */
  email: string;
  /**
   * Cloudflare API Key
   */
  globalToken: string;
}

export interface ScopedAuth {
  /**
   * Cloudflare API token
   */
  scopedToken: string;
}

export type Auth = ScopedAuth | GlobalAuth;

export const isGlobalAuth = (auth: Auth): auth is GlobalAuth =>
  _.has(auth, "email");

export type RecordType = "A" | "AAAA";

export interface Webhook {
  run?: string;
  success?: string;
  failure?: string;
}

export interface BaseDomain {
  name: string;
  type: RecordType;
  proxied: boolean;
  create: boolean;
  webhook?: Webhook;
}

export interface ZoneIdDomain extends BaseDomain {
  zoneId: string;
}

export interface ZoneNameDomain extends BaseDomain {
  zoneName: string;
}

export type Domain = ZoneIdDomain | ZoneNameDomain;

export const isZoneIdDomain = (domain: Domain): domain is ZoneIdDomain =>
  _.has(domain, "zoneId");

export interface IpJsonEcho {
  type: "json";
  url: string;
  fields: string[];
}

export interface IpTextEcho {
  type: "text";
  url: string;
}

export type IpEcho = IpJsonEcho | IpTextEcho;

export const isIpJsonEcho = (ipEcho: IpEcho): ipEcho is IpJsonEcho =>
  ipEcho.type === "json";

export interface Config {
  /**
   * Cloudflare V4 API url
   */
  api: string;
  logLevel: string;
  auth: Auth;
  domains: Domain[];
  ipv4: IpEcho[];
  ipv6: IpEcho[];
}
