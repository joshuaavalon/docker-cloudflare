import type { Static, TSchema } from "@sinclair/typebox";
import type { Context } from "#context";

export interface PathFn<T> {
  (params: T): string;
}

export interface ApiFn<
  TParams extends TSchema,
  TQuery extends TSchema,
  TBody extends TSchema,
  TResponse extends TSchema
> {
  (
    ctx: Context,
    params: Static<TParams>,
    query: Static<TQuery>,
    body: Static<TBody>
  ): Promise<Static<TResponse>>;
}
