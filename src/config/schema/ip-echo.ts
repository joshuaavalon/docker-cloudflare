import { Type } from "@sinclair/typebox";
import { schema as iniSchema } from "#ip-echo/ini/options.js";
import { schema as jsonSchema } from "#ip-echo/json/options.js";
import { schema as textSchema } from "#ip-echo/text/options.js";

import type { Static } from "@sinclair/typebox";

export const ipEchoSchema = Type.Union(
  [
    Type.Composite([
      iniSchema,
      Type.Object({
        type: Type.Literal("ini"),
        url: Type.String({ description: "Url of the IP echo service." })
      })
    ]),
    Type.Composite([
      jsonSchema,
      Type.Object({
        type: Type.Literal("json"),
        url: Type.String({ description: "Url of the IP echo service." })
      })
    ]),
    Type.Composite([
      textSchema,
      Type.Object({
        type: Type.Literal("text"),
        url: Type.String({ description: "Url of the IP echo service." })
      })
    ]),
    Type.Object({
      type: Type.Literal("custom"),
      url: Type.String({ description: "Url of the IP echo service." }),
      func: Type.Function([Type.String()], Type.String())
    })
  ],
  {
    title: "IpEcho",
    description: "IP echo service"
  }
);

export type IpEcho = Static<typeof ipEchoSchema>;
