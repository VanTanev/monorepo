import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config.ts";
import base from "@monorepo/config/vitest.base.mjs";

export default mergeConfig(
  viteConfig,
  mergeConfig(
    base,
    defineConfig({
      test: {
        // project-specific test options go here
      },
    })
  )
);
