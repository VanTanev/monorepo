import eslintConfigPrettier from "eslint-config-prettier";
import turboConfig from "eslint-config-turbo/flat";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  ...turboConfig,
  {
    name: "@monorepo/ignore",
    ignores: [
      // ignore config files
      "eslint.config.mjs",
      // ignore generated folders
      "**/dist/**",
    ],
  },
  ...tseslint.configs.recommendedTypeChecked,
  eslintConfigPrettier,
  {
    name: "@monorepo/base",
    languageOptions: {
      parserOptions: {
        warnOnUnsupportedTypeScriptVersion: false,
        // find the closest tsconfig.json for every file being linted
        projectService: true,
        // use the tsconfig.json in the current working directory
        tsconfigRootDir: process.cwd(),
      },
      globals: globals.node,
    },
  },
);
