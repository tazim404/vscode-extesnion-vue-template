// @ts-ignore
import vue from "rollup-plugin-vue";
import css from "rollup-plugin-css-only";
// @ts-ignore
import alias from "@rollup/plugin-alias";
// @ts-ignore
import resolve from "@rollup/plugin-node-resolve";
// @ts-ignore
import commonjs from "rollup-plugin-commonjs";
// @ts-ignore
import replace from "@rollup/plugin-replace";
// @ts-ignore
import requireContext from "rollup-plugin-require-context";
// @ts-ignore
import { terser } from "rollup-plugin-terser";
// @ts-ignore
import nodePolyfills from "rollup-plugin-polyfill-node";
// @ts-ignore
import babel from "rollup-plugin-babel";
import path from "path";
import fs from "fs";
const production = !process.env.ROLLUP_WATCH;
export default fs
  .readdirSync(path.join(__dirname, "web", "pages"))
  .map((input) => {
    const name = input.split(".")[0].toLowerCase();
    return {
      input: `web/pages/${input}`,
      external: ["path"],
      output: {
        sourcemap: true,
        format: "iife",
        name: "app",
        file: `dist-web/${name}.js`,
      },
      plugins: [
        alias({
          entries: [{ find: "@", replacement: __dirname + "/web/" }],
        }),
        css(),
        requireContext(),
        vue({
          // @ts-ignore
          dev: !production,
          // @ts-ignore
          css: false,
        }),
        resolve({
          // @ts-ignore
          jsnext: true,
          main: true,
          browser: true,
          dedupe: ["vue"],
        }),
        commonjs(),
        replace({
          "process.env.NODE_ENV": production ? '"production"' : '"development"',
          preventAssignment: true,
        }),
        babel({
          exclude: "node_modules/**",
        }),
        nodePolyfills(),
        production && terser(),
      ],
      watch: {
        clearScreen: false,
      },
    };
  });