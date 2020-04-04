import { URL } from "url";

import { updateUrl } from "@/fetch";

export const resolveEndpoint = (
  api: string,
  path: string,
  query: Record<string, any> = {}
): string => {
  const url = new URL(path, api);
  updateUrl(url, query);
  return url.toString();
};
