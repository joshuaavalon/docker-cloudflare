import { Type } from "@sinclair/typebox";
import { webhookSchema } from "./webhook.js";

import type { Static } from "@sinclair/typebox";

export const domainSchema = Type.Object(
  {
    name: Type.String({ description: "Domain name that to be updated." }),
    type: Type.Union([Type.Literal("A", Type.Literal("AAAA"))], {
      type: "string",
      description: "Dns record type. Default to A.",
      default: "A"
    }),
    proxied: Type.Boolean({
      description:
        "Whether the record is receiving the performance and security benefits of Cloudflare. Default to true.",
      default: true
    }),
    create: Type.Boolean({
      description: "Create record if it does not exits. Default to false.",
      default: false
    }),
    zoneId: Type.Optional(
      Type.String({ description: "Zone ID of the domain to be updated." })
    ),
    zoneName: Type.Optional(
      Type.String({ description: "Base domain of the domain to be updated." })
    ),
    webhook: Type.Optional(webhookSchema)
  },
  {
    title: "Domain",
    description: "Domain name that needed to be update",
    additionalProperties: false
  }
);

export type Domain = Static<typeof domainSchema>;
