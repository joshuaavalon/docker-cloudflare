import { converge, equals, has, pipe, prop } from "ramda";

import { Auth, RecordType } from "@/config";

import { resolveEndpoint } from "./endpoint";
import { get, post, put } from "./request";
import { Api } from "./response";

export type DnsRecord = {
  id: string;
  name: string;
  type: string;
  content: string;
  proxied: boolean;
};

type Domain = {
  name: string;
  type: RecordType;
  proxied: boolean;
  create: boolean;
};

export type DnsContext = {
  auth: Auth;
  api: string;
  domain: Domain;
  zoneId: string;
  ip: string;
};

export type DnsRecordContext = DnsContext & {
  recordId: string;
  update: boolean;
};

const getApi = prop<DnsContext, "api">("api");
const getAuth = prop<DnsContext, "auth">("auth");
const getZoneId = prop<DnsContext, "zoneId">("zoneId");
const getRecordId = prop<DnsRecordContext, "recordId">("recordId");
const getRecordIp = prop<DnsRecord, "content">("content");
const getRecordProxied = prop<DnsRecord, "proxied">("proxied");
export const getDomainName = pipe(
  prop<DnsContext, "domain">("domain"),
  prop<Domain, "name">("name")
);
const getDomainType = pipe(
  prop<DnsContext, "domain">("domain"),
  prop<Domain, "type">("type")
);

const getDomainProxied = pipe(
  prop<DnsContext, "domain">("domain"),
  prop<Domain, "proxied">("proxied")
);

const getIp = prop<DnsContext, "ip">("ip");
export const needUpdate = prop<DnsRecordContext, "update">("update");
export const needCreate = pipe(
  prop<DnsContext, "domain">("domain"),
  prop<Domain, "create">("create")
);

const createListDnsRecordPath = pipe(
  getZoneId,
  (zoneId: string): string => `zones/${zoneId}/dns_records`
);

const createListDnsRecordQuery = converge(
  (name: string, type: RecordType) => ({
    name,
    type
  }),
  [getDomainName, getDomainType]
);

const getListDnsRecordsUrl = converge(resolveEndpoint, [
  getApi,
  createListDnsRecordPath,
  createListDnsRecordQuery
]);
/**
 * List dns records with given domain inside a zone.
 *
 * Require permission: `#dns_records:read`
 *
 * @see https://api.cloudflare.com/#dns-records-for-a-zone-list-dns-records
 */
export const listDnsRecords: Api<[DnsContext], DnsRecord[]> = converge(get, [
  getAuth,
  getListDnsRecordsUrl
]);

const createUpdateDnsRecordPath = converge(
  (zoneId: string, recordId: string): string =>
    `zones/${zoneId}/dns_records/${recordId}`,
  [getZoneId, getRecordId]
);

const getUpdateDnsRecordUrl = converge(resolveEndpoint, [
  getApi,
  createUpdateDnsRecordPath
]);

const asUpdateDnsRecordRequest = converge(
  (proxied: boolean, content: string, name: string, type: string) => ({
    proxied,
    content,
    name,
    type
  }),
  [getDomainProxied, getIp, getDomainName, getDomainType]
);

/**
 * Update dns record with id
 *
 * Require permission: `#dns_records:edit`
 *
 * @see https://api.cloudflare.com/#dns-records-for-a-zone-update-dns-record
 */
export const updateDnsRecord: Api<[DnsRecordContext], DnsRecord> = converge(
  put,
  [getAuth, getUpdateDnsRecordUrl, asUpdateDnsRecordRequest]
);

const createCreateDnsRecordPath = converge(
  (zoneId: string): string => `zones/${zoneId}/dns_records`,
  [getZoneId]
);

const getCreateDnsRecordUrl = converge(resolveEndpoint, [
  getApi,
  createCreateDnsRecordPath
]);

const asCreateDnsRecordRequest = converge(
  (proxied: boolean, content: string, name: string, type: RecordType) => ({
    proxied,
    content,
    name,
    type
  }),
  [getDomainProxied, getIp, getDomainName, getDomainType]
);

/**
 * Create dns record in zone
 *
 * Require permission: `#dns_records:edit`
 *
 * @see https://api.cloudflare.com/#dns-records-for-a-zone-create-dns-record
 */
export const createDnsRecord: Api<[DnsContext], DnsRecord> = converge(post, [
  getAuth,
  getCreateDnsRecordUrl,
  asCreateDnsRecordRequest
]);

export const matchIp = (context: DnsContext) => (record: DnsRecord) =>
  equals(getIp(context), getRecordIp(record));

export const matchProxied = (context: DnsContext) => (record: DnsRecord) =>
  equals(getDomainProxied(context), getRecordProxied(record));

export const isDnsRecordContext = (
  context: DnsContext | DnsRecordContext
): context is DnsRecordContext => has("recordId", context);
