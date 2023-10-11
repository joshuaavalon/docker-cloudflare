import { customParser } from "./custom/index.js";
import { iniParser } from "./ini/index.js";
import { jsonParser } from "./json/index.js";
import { textParser } from "./text/index.js";

import type { CustomParser } from "./custom/index.js";
import type { IniParser } from "./ini/index.js";
import type { JsonParser } from "./json/index.js";
import type { TextParser } from "./text/index.js";

export function getParser(type: "ini"): IniParser;
export function getParser(type: "json"): JsonParser;
export function getParser(type: "text"): TextParser;
export function getParser(type: "custom"): CustomParser;
export function getParser(
  type: "custom" | "ini" | "json" | "text"
): CustomParser | IniParser | JsonParser | TextParser;
export function getParser(type: string): never;
export function getParser(
  type: string
): CustomParser | IniParser | JsonParser | TextParser {
  switch (type) {
    case "ini":
      return iniParser;
    case "json":
      return jsonParser;
    case "text":
      return textParser;
    case "custom":
      return customParser;
  }
  throw new Error(`Unknown parser type ${type}`);
}
