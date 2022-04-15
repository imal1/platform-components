/*
 * @Author: imali
 * @Date: 2022-03-28 14:02:28
 * @LastEditTime: 2022-04-15 12:56:47
 * @LastEditors: imali
 * @Description:
 */
import vue from "rollup-plugin-vue";
import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import sass from "rollup-plugin-sass";
import { terser } from "rollup-plugin-terser";

export default {
	input: "src/index.js",
	output: {
		name: "platform-components",
		file: "bundle.js",
		format: "umd",
		globals: {
			vue: "Vue",
		},
	},
	plugins: [
		vue({
			css: true,
			compileTemplate: true,
		}),
		resolve(),
		sass({
			output: "style.css",
		}),
		commonjs(),
		babel({
			exclude: "**/node_modules/**",
			presets: ["@vue/babel-preset-jsx"],
		}),
		terser(),
	],
	external: ["vue", "lodash", "dayjs", "element-ui"],
};
