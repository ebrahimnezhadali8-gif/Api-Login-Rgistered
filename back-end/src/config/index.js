import dotenv from "dotenv";
dotenv.config();

import defaultConfig from "./default.js";
import development from "./development.js";
import production from "./production.js";
import test from "./test.js";

const env = process.env.NODE_ENV || "development";

const map = {
  development,
  production,
  test,
};

// merge 
const mergeDeep = (target, source) => {
  for (const key in source) {
    if (
      source[key] instanceof Object &&
      key in target
    ) {
      target[key] = mergeDeep(target[key], source[key]);
    } else {
      target[key] = source[key];
    }
  }
  return target;
};

const finalConfig = mergeDeep(
  JSON.parse(JSON.stringify(defaultConfig)),
  map[env] || {}
);

export default finalConfig;