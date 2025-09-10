import { defineConfig } from "tsdown";

export default defineConfig({
	entry: {
		main: "src/index.ts",
		react: "src/react/index.ts",
		functions: "src/functions/index.ts",
	},
});
