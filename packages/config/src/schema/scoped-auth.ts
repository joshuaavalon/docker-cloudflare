import { Type } from "@sinclair/typebox";

import type { Static } from "@sinclair/typebox";

export const scopedAuthSchema = Type.Object(
  {
    scopedToken: Type.String({
      description:
        "API Token generated from the User Profile 'API Tokens' page."
    })
  },
  {
    title: "ScopedAuth",
    description: "Authentication used to interact with API.",
    additionalProperties: false
  }
);

export type ScopedAuth = Static<typeof scopedAuthSchema>;
