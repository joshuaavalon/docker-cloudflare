import { isDebug } from "@/env";

const getCurrentTime = (): string => new Date().toISOString();
const formatLogMessage = (level: string, message: string): string => {
  const date = getCurrentTime();
  return `${date} [${level.padEnd(5)}]: ${message}`;
};
export const log = (message: string): void => {
  console.log(formatLogMessage("INFO", message));
};
export const logWarn = (message: string): void => {
  console.log(formatLogMessage("WARN", message));
};
export const logError = (message: string): void => {
  console.log(formatLogMessage("ERROR", message));
};
export const logDebug = (message: string): void => {
  if (isDebug()) {
    console.log(formatLogMessage("ERROR", message));
  }
};
