import { createServer } from "./index";
import { test, expect } from "vitest";

test("tests work", () => {
  expect(createServer()).toBeDefined();
});
