import { Type } from "@sinclair/typebox";

import type { Static } from "@sinclair/typebox";

export const ipEchoSchema = Type.Object(
  {
    type: Type.String({ description: "Name or alias of an IP echo parser." }),
    url: Type.String({ description: "Url of the IP echo service." })
  },
  {
    title: "IpEcho",
    description: "IP echo service"
  }
);

export type IpEcho = Static<typeof ipEchoSchema>;
