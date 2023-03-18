import { isFunction } from "lodash-es";
import { pool } from "./pool.js";
import { TypeGuard } from "@sinclair/typebox/guard";

import type { Static, TSchema } from "@sinclair/typebox";

export interface IpEchoFunction<T extends TSchema> {
  (echo: string, opts: Static<T>): Promise<string>;
}

export interface IpEchoPackage<T extends TSchema> {
  parser: IpEchoFunction<T>;
  schema?: T;
}

function isObject(value: unknown): value is Record<keyof any, unknown> {
  if (typeof value !== "object") {
    return false;
  }

  if (Array.isArray(value)) {
    return false;
  }

  if (!value) {
    return false;
  }

  return true;
}

const isIpEchoFunction = <T extends TSchema>(
  parser: unknown
): parser is IpEchoFunction<T> => isFunction(parser);

export const isIpEchoPackage = <T extends TSchema>(
  pkg: unknown
): pkg is IpEchoPackage<T> => {
  if (!isObject(pkg)) {
    return false;
  }
  return isIpEchoFunction<T>(pkg["parser"]) && TypeGuard.TSchema(pkg["schema"]);
};

export const getParser = async (
  resolve: string
): Promise<IpEchoPackage<any>> => {
  const name = pool.get(resolve);
  const pkg = await import(name);
  if (!isIpEchoPackage(pkg)) {
    throw new Error(`${name} is not a valid package`);
  }
  return pkg;
};

export const registerParser = (resolve: string, alias?: string): void => {
  pool.register(resolve, alias);
};
