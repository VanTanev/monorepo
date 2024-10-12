import eslintConfigPrettier from "eslint-config-prettier";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
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
  }
);
