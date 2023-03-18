import { TypeSystem } from "@sinclair/typebox/system";

import type { SchemaOptions, TUnsafe } from "@sinclair/typebox";

// eslint-disable-next-line @typescript-eslint/naming-convention
export function StringEnum<T extends string[]>(
  values: [...T],
  options?: SchemaOptions
): TUnsafe<T[number]> {
  return TypeSystem.CreateType<T[number], StringEnumOptions<T>>(
    "StringEnum",
    (opts, value) => {
      for (const enumValue of opts.enum) {
        if (enumValue === value) {
          return true;
        }
      }
      return false;
    }
  )({ ...options, enum: values });
}

export interface StringEnumOptions<T extends string[]> extends SchemaOptions {
  enum: [...T];
}
