export const isDebug = (): boolean => process.env.NODE_ENV === "development";
export const getConfigFilePath = (): string =>
  process.env.CF_DNS__CONFIG || "config.yaml";
