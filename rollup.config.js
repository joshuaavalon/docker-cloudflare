import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";

/** @type {import('rollup').RollupOptions} */
export default {
  input: "src/index.ts",
  output: {
    dir: "dist",
    format: "esm"
  },
  plugins: [
    typescript(),
    commonjs(),
    nodeResolve({ preferBuiltins: true }),
    json()
  ]
};
