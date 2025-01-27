import { test, expect } from "vitest";

import { createServer } from "./index";

test("tests work", () => {
  expect(createServer()).toBeDefined();
});
