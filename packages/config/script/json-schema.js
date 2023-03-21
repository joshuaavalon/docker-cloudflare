import { URL } from "node:url";
import { writeFile } from "node:fs/promises";
import { Type } from "@sinclair/typebox";
import { configSchema } from "@cloudflare-ddns/config/schema";

const fileUrl = new URL("../lib/config.schema.json", import.meta.url);
await writeFile(fileUrl, JSON.stringify(Type.Strict(configSchema), null, 2), {
  encoding: "utf-8"
});
