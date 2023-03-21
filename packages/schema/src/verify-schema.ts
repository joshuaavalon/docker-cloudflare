import { TypeCompiler } from "@sinclair/typebox/compiler";
import { Value } from "@sinclair/typebox/value";
import { SchemaViolationError } from "./schema-violation-error.js";

import type { Static, TSchema } from "@sinclair/typebox";

export const verifySchema = <T extends TSchema>(
  schema: T,
  data: unknown
): Static<T> => {
  const compiledSchema = TypeCompiler.Compile(schema);
  const withDefault = Value.Cast(schema, data);
  if (compiledSchema.Check(withDefault)) {
    return withDefault;
  }
  throw new SchemaViolationError([...compiledSchema.Errors(withDefault)]);
};
