import path from "path";

import { readFileConfig } from "../file-config";

const getConfigPath = (file: string): string =>
  path.join(__dirname, "..", "..", "data", file);

test("minimal.yaml", async () => {
  const cfgPath = getConfigPath("minimal.yaml");
  await readFileConfig(cfgPath);
});
