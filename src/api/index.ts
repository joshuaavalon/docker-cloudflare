import _ from "lodash";

import { Auth, Domain, getZoneId, getZoneName, isZoneIdDomain } from "@/config";
import { log } from "@/log";

import { fetchZoneId } from "./zone";
import {
  createDnsRecord,
  DnsContext,
  DnsRecord,
  DnsRecordContext,
  getDomainName,
  isDnsRecordContext,
  listDnsRecords,
  matchIp,
  matchProxied,
  needCreate,
  needUpdate,
  updateDnsRecord
} from "./dns";
import { getApiResult } from "./response";

type UpdateDnsContext = {
  auth: Auth;
  api: string;
  domain: Domain;
  ip: string;
};

const getDomain = (context: UpdateDnsContext): Domain => context.domain;

type ZoneRequest = {
  auth: Auth;
  api: string;
  zoneName: string;
};

const mapZoneContext = (
  { auth, api }: UpdateDnsContext,
  zoneName: string
): ZoneRequest => ({
  auth,
  api,
  zoneName
});

const readZoneId = async (
  context: UpdateDnsContext
): Promise<{ zoneId: string }> => {
  const domain = getDomain(context);
  const zoneId = isZoneIdDomain(domain)
    ? getZoneId(domain)
    : await fetchZoneId(mapZoneContext(context, getZoneName(domain)));
  return { zoneId };
};

const mergeDnsContext = async (
  context: UpdateDnsContext
): Promise<DnsContext> => {
  const zoneId = await readZoneId(context);
  return _.merge(context, zoneId);
};

const createDnsRecordContext = (
  context: DnsContext,
  record: DnsRecord
): DnsRecordContext =>
  _.merge(context, {
    recordId: record.id,
    update: !_.every([matchIp(context)(record), matchProxied(context)(record)])
  });

const mergeContext = (context: DnsContext) => (
  record: DnsRecord | undefined
): DnsContext | DnsRecordContext =>
  _.isNil(record) ? context : createDnsRecordContext(context, record);

const mapDnsContext = (
  context: DnsContext,
  records: DnsRecord[]
): DnsContext | DnsRecordContext => {
  const record = _.first(records);
  return mergeContext(context)(record);
};

const createDnsContext = async (
  context: DnsContext
): Promise<DnsContext | DnsRecordContext> => {
  const res = await listDnsRecords(context);
  const result = await getApiResult(res);
  return mapDnsContext(context, result);
};

const updateOrCreate = async (
  context: DnsContext | DnsRecordContext
): Promise<void> => {
  const domainName = getDomainName(context);
  if (isDnsRecordContext(context)) {
    if (needUpdate(context)) {
      log(`Try to update record for  ${domainName}`);
      await updateDnsRecord(context);
    } else {
      log(`Skipped updating record for ${domainName}`);
    }
    return;
  }

  if (needCreate(context)) {
    log(`Try to create record for  ${domainName}`);
    await createDnsRecord(context);
  } else {
    log(`Skipped creating record for ${domainName}`);
  }
};

export const updateDns = async (context: UpdateDnsContext): Promise<void> => {
  const mergedContext = await mergeDnsContext(context);
  const dnsContext = await createDnsContext(mergedContext);
  return updateOrCreate(dnsContext);
};
