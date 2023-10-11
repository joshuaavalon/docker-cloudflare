import { URL } from "node:url";
import { writeFile } from "node:fs/promises";
import { Type } from "@sinclair/typebox";
import { configSchema } from "../dist/config/schema/index.js";

const fileUrl = new URL("../dist/config.schema.json", import.meta.url);
await writeFile(fileUrl, JSON.stringify(Type.Strict(configSchema), null, 2), {
  encoding: "utf-8"
});
