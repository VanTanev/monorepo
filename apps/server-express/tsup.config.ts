import { defineConfig } from "tsup";

export default defineConfig({
  noExternal: ["@monorepo/logger"],
  sourcemap: true,
});
