import { Type } from "@sinclair/typebox";

import type { Static } from "@sinclair/typebox";

export const ipEchoParserSchema = Type.Object(
  {
    resolve: Type.String({ description: "Name of the JavaScript package." }),
    alias: Type.Optional(
      Type.String({
        description:
          "Alias of the JavaScript package. Must be unique from other parsers' alias and name."
      })
    )
  },
  {
    title: "IpEchoParser",
    description: "Parser that parses the response from IP echoing service.",
    additionalProperties: false
  }
);

export type IpEchoParser = Static<typeof ipEchoParserSchema>;
