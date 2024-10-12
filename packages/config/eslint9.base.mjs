import eslint9 from "@eslint9/js";
import tseslint from "typescript-eslint";
import shared from "./eslint.shared.mjs";

export default tseslint.config(eslint9.configs.recommended, ...shared);
