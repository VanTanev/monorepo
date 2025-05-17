import { test, expect } from "vitest";

import { createServer } from "./index.ts";

test("tests work", () => {
  expect(createServer()).toBeDefined();
});
