export const isDebug = (): boolean => process.env.NODE_ENV === "development";
export const getConfigFilePath = (): string =>
  process.env.CLOUDFLARE_CONFIG || "config.yaml";
