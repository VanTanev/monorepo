import { defineConfig, defaultExclude } from "vitest/config";

export default defineConfig({
  test: {
    // Do not start in watch mode by default
    watch: false,
    // Do not run tests in isolated processes.
    // This substantially improves performance as long as your tests are not mutating global state
    isolate: false,
    exclude: defaultExclude.concat([
      // Ignore our build output folder
      "**/dist/**",
    ]),
  },
});
