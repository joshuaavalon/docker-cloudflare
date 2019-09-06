import { construct, pipe } from "ramda";
import { URL } from "url";

import { updateUrl } from "@/fetch";

export const resolveEndpoint = (
  api: string,
  path: string,
  query: Record<string, any> = {}
): string =>
  pipe(
    construct(URL),
    updateUrl(query),
    (url: URL) => url.toString()
  )(path, api);
