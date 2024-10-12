import { defineConfig, mergeConfig } from "vitest/config";
import base from "@monorepo/config/vitest.base.mjs";

export default mergeConfig(
  base,
  defineConfig({
    test: {
      // project-specific test options go here
    },
  })
);
