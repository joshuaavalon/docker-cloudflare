import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { assert } from "chai";
import dotenv from "dotenv";

import { readEnvConfig } from "../index.js";

const currentDir = dirname(fileURLToPath(import.meta.url));
const getConfigPath = (file: string): string =>
  join(currentDir, "..", "..", "..", "data", file);

describe("env-config", () => {
  it("minimal.env", async () => {
    const path = getConfigPath("minimal.env");
    dotenv.config({ path, override: true });
    const config = readEnvConfig();

    assert.strictEqual(config.auth?.scopedToken, "example", "scopedToken");
    assert.strictEqual(config.domains?.length, 1, "domains.length");
    const domain = config.domains?.[0];
    assert.exists(domain);
    if (!domain) {
      return;
    }
    assert.strictEqual(domain.name, "example.com", "domain.name");
    assert.strictEqual(domain.type, "A", "domain.type");
    assert.strictEqual(domain.proxied, true, "domain.proxied");
    assert.strictEqual(domain.create, false, "domain.create");
  });
});
