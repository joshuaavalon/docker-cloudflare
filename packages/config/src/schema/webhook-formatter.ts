import { TypeSystem } from "@sinclair/typebox/system";

import type { SchemaOptions } from "@sinclair/typebox";

export type WebhookFormatter = (
  status: string,
  response?: unknown
) => Promise<any> | any;

export const WebhookFormatterType = TypeSystem.CreateType<
  WebhookFormatter,
  SchemaOptions
>("WebhookFormatter", (opts, value) => value instanceof Function);
