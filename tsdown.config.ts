import { defineConfig } from "tsdown";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    react: "src/react/index.tsx",
    functions: "src/functions/index.ts",
  },
});
