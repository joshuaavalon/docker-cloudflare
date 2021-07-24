import Ajv, { ErrorObject } from "ajv";
import addFormats from "ajv-formats";

import type { FuncKeywordDefinition } from "ajv";

export class SchemaViolationError extends Error {
  public errors: ErrorObject[];
  public constructor(errors: ErrorObject[]) {
    const messages = errors.map(error => error.message).join("\n");
    super(`Failed to validate schema Errors:\n${messages}`);
    this.errors = errors;
  }
}

const customType = {
  Function: Function
};

const instanceOfFunc: FuncKeywordDefinition = {
  keyword: "instanceOf",
  compile: function (schema) {
    return function (data) {
      return data instanceof customType[schema];
    };
  }
};

export const verifySchema = <T>(
  schema: Record<string, unknown>,
  data: unknown
): T => {
  const ajv = new Ajv();
  addFormats(ajv);
  ajv.addKeyword(instanceOfFunc);
  const validate = ajv.compile<T>(schema);
  if (validate(data)) {
    return data;
  }
  console.log({ data, schema });
  throw new SchemaViolationError(validate.errors || []);
};
