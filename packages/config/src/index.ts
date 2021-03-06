import lodash from "lodash";

import { Config } from "./type";
import { readUserConfig } from "./user-config";
import { defaultConfig } from "./default-config";

export const readConfig = async (path: string): Promise<Config> => {
  const userConfig = await readUserConfig(path);
  return lodash.assignWith(userConfig, defaultConfig, (obj, src) =>
    lodash.isUndefined(obj) ? src : obj
  );
};

export * from "./type";
