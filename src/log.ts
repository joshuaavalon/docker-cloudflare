import { pipe } from "ramda";

import { isDebug } from "@/env";

const getCurrentTime = (): string => new Date().toISOString();
const formatLogMessage = (level: string) => (message: string) => {
  const date = getCurrentTime();
  return `${date} [${level.padEnd(5)}]: ${message}`;
};
export const log = pipe(formatLogMessage("INFO"), console.log);
export const logWarn = pipe(formatLogMessage("WARN"), console.warn);
export const logError = pipe(formatLogMessage("ERROR"), console.error);
export const logDebug = pipe(formatLogMessage("DEBUG"), (message: string) => {
  if (isDebug()) {
    console.log(message);
  }
});
