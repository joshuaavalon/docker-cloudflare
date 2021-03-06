import lodash from "lodash";

import { pool } from "./pool";

export interface IpEchoFunction<T = void> {
  (echo: string, opts: T): Promise<string>;
}

export interface IpEchoPackage<T = void> {
  parser: IpEchoFunction<T>;
  schema?: Record<string, unknown>;
}

const isIpEchoFunction = (parser: unknown): parser is IpEchoFunction =>
  lodash.isFunction(parser);

const isSchema = (schema: unknown): boolean =>
  lodash.isUndefined(schema) || lodash.isObject(schema);

export const isIpEchoPackage = (pkg: unknown): pkg is IpEchoPackage<any> => {
  if (!lodash.isObject(pkg)) {
    return false;
  }
  return isIpEchoFunction(pkg["parser"]) && isSchema(pkg["schema"]);
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
