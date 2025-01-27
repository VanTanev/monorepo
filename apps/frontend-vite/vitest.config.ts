import { defineConfig, mergeConfig } from "vitest/config";

import base from "@monorepo/config/vitest.base.mjs";

import viteConfig from "./vite.config.ts";

export default mergeConfig(
  viteConfig,
  mergeConfig(
    base,
    defineConfig({
      test: {
        // project-specific test options go here
      },
    }),
  ),
);
