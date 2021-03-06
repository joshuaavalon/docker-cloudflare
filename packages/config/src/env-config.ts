import { GlobalAuth, ZoneNameDomain } from "./type";

export interface EnvConfig {
  auth: GlobalAuth;
  domains: ZoneNameDomain[];
}

export const readEnvConfig = (): EnvConfig => {
  const {
    EMAIL: email = "",
    API: globalToken = "",
    HOST: name = "",
    IPV6: ipv6,
    ZONE: zoneName = "",
    PROXY: proxy = "true",
    FORCE_CREATE: forceCreate
  } = process.env;
  return {
    auth: { email, globalToken },
    domains: [
      {
        name,
        type: ipv6 === "true" ? "AAAA" : "A",
        zoneName,
        proxied: proxy === "true",
        create: forceCreate === "true",
        webhook: {}
      }
    ]
  };
};
