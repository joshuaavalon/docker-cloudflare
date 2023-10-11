import type { ARecord, AaaaRecord } from "#api";
import type { Domain } from "#config";

export interface Record {
  domain: Domain;
  ip: string;
}

export type DNSRecord = AaaaRecord | ARecord;
