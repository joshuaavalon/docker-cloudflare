import _ from "lodash";

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

const getApi = (context: DnsContext): string => context.api;
const getAuth = (context: DnsContext): Auth => context.auth;
const getZoneId = (context: DnsContext): string => context.zoneId;
const getRecordId = (context: DnsRecordContext): string => context.recordId;
const getRecordIp = (record: DnsRecord): string => record.content;
const getRecordProxied = (record: DnsRecord): boolean => record.proxied;

export const getDomainName = (context: DnsContext): string =>
  context.domain.name;

export const getDomainType = (context: DnsContext): string =>
  context.domain.type;

export const getDomainProxied = (context: DnsContext): boolean =>
  context.domain.proxied;

const getIp = (context: DnsContext): string => context.ip;
export const needUpdate = (context: DnsRecordContext): boolean =>
  context.update;

export const needCreate = (context: DnsContext): boolean =>
  context.domain.create;

const createListDnsRecordPath = (context: DnsContext): string => {
  const zoneId = getZoneId(context);
  return `zones/${zoneId}/dns_records`;
};

type DnsRecordQuery = {
  name: string;
  type: string;
};
const createListDnsRecordQuery = (context: DnsContext): DnsRecordQuery => {
  const name = getDomainName(context);
  const type = getDomainType(context);
  return {
    name,
    type
  };
};

const getListDnsRecordsUrl = (context: DnsContext): string => {
  const api = getApi(context);
  const path = createListDnsRecordPath(context);
  const query = createListDnsRecordQuery(context);
  return resolveEndpoint(api, path, query);
};

/**
 * List dns records with given domain inside a zone.
 *
 * Require permission: `#dns_records:read`
 *
 * @see https://api.cloudflare.com/#dns-records-for-a-zone-list-dns-records
 */
export const listDnsRecords: Api<[DnsContext], DnsRecord[]> = context => {
  const auth = getAuth(context);
  const url = getListDnsRecordsUrl(context);
  return get(auth, url);
};

const createUpdateDnsRecordPath = (context: DnsRecordContext): string => {
  const zoneId = getZoneId(context);
  const recordId = getRecordId(context);
  return `zones/${zoneId}/dns_records/${recordId}`;
};

const getUpdateDnsRecordUrl = (context: DnsRecordContext): string => {
  const api = getApi(context);
  const path = createUpdateDnsRecordPath(context);
  return resolveEndpoint(api, path);
};

type DnsRecordRequest = {
  proxied: boolean;
  content: string;
  name: string;
  type: string;
};
const asUpdateDnsRecordRequest = (context: DnsContext): DnsRecordRequest => {
  const proxied = getDomainProxied(context);
  const content = getIp(context);
  const name = getDomainName(context);
  const type = getDomainType(context);
  return {
    proxied,
    content,
    name,
    type
  };
};

/**
 * Update dns record with id
 *
 * Require permission: `#dns_records:edit`
 *
 * @see https://api.cloudflare.com/#dns-records-for-a-zone-update-dns-record
 */
export const updateDnsRecord: Api<[DnsRecordContext], DnsRecord> = context => {
  const auth = getAuth(context);
  const url = getUpdateDnsRecordUrl(context);
  const query = asUpdateDnsRecordRequest(context);
  return put(auth, url, query);
};

const createCreateDnsRecordPath = (context: DnsContext): string => {
  const zoneId = getZoneId(context);
  return `zones/${zoneId}/dns_records`;
};

const getCreateDnsRecordUrl = (context: DnsContext): string => {
  const api = getApi(context);
  const path = createCreateDnsRecordPath(context);
  return resolveEndpoint(api, path);
};

const asCreateDnsRecordRequest = (context: DnsContext): DnsRecordRequest => {
  const proxied = getDomainProxied(context);
  const content = getIp(context);
  const name = getDomainName(context);
  const type = getDomainType(context);
  return {
    proxied,
    content,
    name,
    type
  };
};

/**
 * Create dns record in zone
 *
 * Require permission: `#dns_records:edit`
 *
 * @see https://api.cloudflare.com/#dns-records-for-a-zone-create-dns-record
 */
export const createDnsRecord: Api<[DnsContext], DnsRecord> = context => {
  const auth = getAuth(context);
  const url = getCreateDnsRecordUrl(context);
  const query = asCreateDnsRecordRequest(context);
  return post(auth, url, query);
};

export const matchIp = (context: DnsContext) => (record: DnsRecord) =>
  getIp(context) === getRecordIp(record);

export const matchProxied = (context: DnsContext) => (record: DnsRecord) =>
  getDomainProxied(context) === getRecordProxied(record);

export const isDnsRecordContext = (
  context: DnsContext | DnsRecordContext
): context is DnsRecordContext => _.has(context, "recordId");
