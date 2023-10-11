import type { Static, TSchema } from "@sinclair/typebox";

export interface IpEchoFunction<T extends TSchema> {
  (echo: string, opts: Static<T>): Promise<string>;
}
