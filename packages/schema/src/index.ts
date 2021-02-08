import Ajv, { ErrorObject } from "ajv";
import addFormats from "ajv-formats";

export class SchemaViolationError extends Error {
  public errors: ErrorObject[];
  public constructor(errors: ErrorObject[]) {
    const messages = errors.map(error => error.message).join("\n");
    super(`Failed to validate schema Errors:\n${messages}`);
    this.errors = errors;
  }
}

export const verifySchema = <T>(
  schema: Record<string, unknown>,
  data: unknown
): T => {
  const ajv = new Ajv();
  addFormats(ajv);
  const validate = ajv.compile<T>(schema);
  if (validate(data)) {
    return data;
  }
  throw new SchemaViolationError(validate.errors || []);
};
