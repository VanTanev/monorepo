### Advanced import/export conditions with Preconstruct

**What import conditions are**

- ESM allows us to tell the runtime **which file to load** locally based on a `condition` such as `browser`, `development`, or an arbitrary string.
- These conditions are added under `package.json#imports` field.
- Node / Bundlers will then swap the right file at import time, depending on if the environment matches the condition

**Goal for this step**

> Improve our logger to have different behavior in `browser` and `development` environments.

We will write the following conditions

- `#is-development` → resolves to `true.ts` during local dev, otherwise `false.ts`.
- `#is-browser` → resolves to `true.ts` when running in a real browser, to `false.ts` on server-side, and to a tiny feature-detect helper (`is-browser.ts`) everywhere else.

```jsonc
"imports": {
  "#is-development": {
    "development": "./src/conditions/true.ts",
    "default":    "./src/conditions/false.ts"
  },
  "#is-browser": {
    "edge-light": "./src/conditions/false.ts",
    "workerd":    "./src/conditions/false.ts",
    "worker":     "./src/conditions/false.ts",
    "browser":    "./src/conditions/true.ts",
    "default":    "./src/conditions/is-browser.ts"
  }
}
```

With this in place we simply write:

```ts
import isBrowser from "#is-browser";
import isDev from "#is-development";
```

…and let the platform pick the correct answer in every environment.
