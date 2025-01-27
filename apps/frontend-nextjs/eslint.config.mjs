import { FlatCompat } from "@eslint/eslintrc";
import globals from "globals";
import tseslint from "typescript-eslint";

import base from "@monorepo/config/eslint9.base.mjs";

const compat = new FlatCompat({
  baseDirectory: process.cwd(),
});

export default tseslint.config(
  {
    name: "frontend-nextjs/ignores",
    ignores: [".next/**"],
  },
  {
    name: "frontend-nextjs/rules",
    extends: [...compat.extends("next/core-web-vitals"), ...base],
    languageOptions: {
      globals: globals.browser,
    },
  },
);
