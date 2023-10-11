import { Type } from "@sinclair/typebox";

export const schema = Type.Object({
  func: Type.Function([Type.String()], Type.String())
});
