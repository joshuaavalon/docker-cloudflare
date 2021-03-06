import { cosmiconfig } from "cosmiconfig";
import { verifySchema } from "@cloudflare-ddns/schema";

import type { Domain } from "./type";
import type { ConfigSchema, Domain as FileDomain } from "./schema";
import schema from "./config.schema.json";

export type FileConfig = Omit<ConfigSchema, "domains"> & {
  domains: Domain[];
};

const mapDomain = (domain: FileDomain): Domain => {
  const {
    name,
    type = "A",
    proxied = true,
    create = false,
    zoneId,
    zoneName,
    webhook = {}
  } = domain;
  const baseDomain = { name, type, proxied, create, webhook };
  if (zoneId) {
    return { ...baseDomain, zoneId };
  }
  if (zoneName) {
    return { ...baseDomain, zoneName };
  }
  // Get zone name from domain name
  const parts = name.split(".");
  if (parts.length < 2) {
    throw new Error(
      `Unable to parse zoneName from "${name}". Please specific either zoneId or zoneName in configuration.`
    );
  }
  const parsedZoneName = `${parts[parts.length - 2]}.${
    parts[parts.length - 1]
  }`;
  return { name, type, proxied, create, webhook, zoneName: parsedZoneName };
};

export const readFileConfig = async (path: string): Promise<FileConfig> => {
  const cc = cosmiconfig("cloudflare");
  const cfg = await cc.load(path);
  const fileCfg = verifySchema<ConfigSchema>(schema, cfg?.config);
  const { domains, ...others } = fileCfg;
  return { ...others, domains: domains.map(mapDomain) };
};
