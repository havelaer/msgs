import { defineConfig } from "../src";
import * as functions from "../src/functions";

function uppercase(_ctx: any, _options: any, value: any) {
	return {
		type: "uppercase",
		toString: () => value.toUpperCase(), // needed for `format`
		toParts: () => [{ type: "string", value: value.toUpperCase() }], // needed for `formatToParts` / JSX
	};
}

export default defineConfig({
	locales: {
		"en-US": {},
		"nl-NL": {},
		"fr-FR": {},
	},
	defaultLocale: "en-US",
	options: {
		functions: {
			...functions,
			uppercase,
		},
	},
});
