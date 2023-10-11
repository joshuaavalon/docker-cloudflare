import { Type } from "@sinclair/typebox";

export const schema = Type.Object({
  fields: Type.Array(Type.String())
});
