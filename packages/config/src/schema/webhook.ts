import { Type } from "@sinclair/typebox";
import { WebhookFormatterType } from "./webhook-formatter.js";

import type { Static } from "@sinclair/typebox";

export const webhookSchema = Type.Object(
  {
    run: Type.Optional(
      Type.String({ description: "Fired before update run." })
    ),
    success: Type.Optional(
      Type.String({ description: "Fired after update success." })
    ),
    failure: Type.Optional(
      Type.String({ description: "Fired after update failure." })
    ),
    formatter: Type.Optional(
      WebhookFormatterType({
        instanceof: "function",
        description: "Format message"
      })
    )
  },
  {
    title: "Webhook",
    description: "Fired during the update.",
    additionalProperties: false
  }
);

export type Webhook = Static<typeof webhookSchema>;
