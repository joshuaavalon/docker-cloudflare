import type { TSchema } from "@sinclair/typebox";
import type { TypeCheck } from "@sinclair/typebox/compiler";
import type { ValueError } from "@sinclair/typebox/value";

export class SchemaViolationError extends Error {
  public data: unknown;
  public errors: ValueError[];

  public constructor(schema: TypeCheck<TSchema>, data: unknown) {
    const errors = [...schema.Errors(data)];
    const json = JSON.stringify({ data, errors }, null, 2);
    super(`Failed to validate schema Errors:\n${json}`);
    this.errors = errors;
  }
}
