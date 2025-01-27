import eslint8 from "@eslint8/js";
import tseslint from "typescript-eslint";

import shared from "./eslint.shared.mjs";

export default tseslint.config(eslint8.configs.recommended, ...shared);
