import { defineConfig, globalIgnores } from "eslint/config";
import reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores(["node_modules/**"]),
  ...tseslint.configs.recommended,
  reactHooks.configs.flat.recommended,
  {
    // The package is framework-agnostic: hosts and extensions inject links and texts.
    rules: {
      "no-restricted-imports": [
        "error",
        { patterns: ["next", "next/*", "next-intl", "next-intl/*", "@/*", "@zerpto/sdk"] },
      ],
    },
  },
]);
