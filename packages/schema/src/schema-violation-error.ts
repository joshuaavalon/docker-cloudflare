import type { ValueError } from "@sinclair/typebox/value";

export class SchemaViolationError extends Error {
  public errors: ValueError[];
  public constructor(errors: ValueError[]) {
    const messages = errors.map(error => error.message).join("\n");
    super(`Failed to validate schema Errors:\n${messages}`);
    this.errors = errors;
  }
}
