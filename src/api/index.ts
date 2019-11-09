import {
  allPass,
  head,
  ifElse,
  isNil,
  mergeRight,
  pipe,
  prop,
  then
} from "ramda";

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

const getDomain = prop<UpdateDnsContext, "domain">("domain");

const mapZoneContext = ({ auth, api }: UpdateDnsContext) => (
  zoneName: string
) => ({
  auth,
  api,
  zoneName
});

const readZoneId = (context: UpdateDnsContext): Promise<{ zoneId: string }> =>
  pipe(
    getDomain,
    ifElse(
      isZoneIdDomain,
      pipe(getZoneId, (value: string) => Promise.resolve(value)),
      pipe(getZoneName, mapZoneContext(context), fetchZoneId)
    ),
    then((zoneId: string) => ({ zoneId }))
  )(context);

const mergeDnsContext = async (
  context: UpdateDnsContext
): Promise<DnsContext> => {
  const zoneId = await readZoneId(context);
  return mergeRight(context, zoneId);
};

const createDnsRecordContext = (
  context: DnsContext,
  record: DnsRecord
): DnsRecordContext =>
  mergeRight(context, {
    recordId: record.id,
    update: !allPass([matchIp(context), matchProxied(context)])(record)
  });

const mergeContext = (context: DnsContext) => (
  record: DnsRecord | undefined
): DnsContext | DnsRecordContext =>
  isNil(record) ? context : createDnsRecordContext(context, record);

const mapDnsContext = (
  context: DnsContext,
  records: DnsRecord[]
): DnsContext | DnsRecordContext => pipe(head, mergeContext(context))(records);

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

export const updateDns = pipe(
  mergeDnsContext,
  then(createDnsContext),
  then(updateOrCreate)
);
