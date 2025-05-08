# Node.js package.json exports

Crossing the package boundary makes things complicated.

## Why care about `exports`?

We must understand how publishing an npm module works in order to make better decisions for our internal modules.

- The `exports` field superseceds the historic `main` (CJS) and `module` (ESM) fields
- Allow the definition of multiple entry points into a package.
- Hide all files not explicitly `export`-ed, making them private to the package.
- Serve different module systems and build environments through export conditions.
- Export conditions is the cannonical way to publish CJS + ESM packages on NPM

## Quick refresher on CJS vs ESM in Node.js

| ESM (`import`)                       | CJS (`require`)                        |
| ------------------------------------ | -------------------------------------- |
| `.mjs` or `.js` when `type:"module"` | `.cjs` or `.js` when `type:"commonjs"` |
| Top‑level `await` allowed            | Synchronous loader, no TLA             |
| `import`s are statically parsed      | `require()` is a normal function       |

## Shape of exports in a published package (complicated!)

```jsonc
{
  /* old style --------------------------------------------------------------- */
  "module": "./dist/index.legacy-esm.mjs",
  "main": "./dist/index.cjs",
  "types": "./dist/index.d.ts",

  "exports": {
    /* ensure best compatability by exposing package.json to importing packages */
    "./package.json": "./package.json",

    /* conditional exports ---------------------------------------------------- */
    "module-sync": "./dist/index.mjs",
    "module": "./dist/index.mjs",
    "import": "./dist/index.mjs",
    "default": "./dist/index.cjs",

    /* with TypeScript ------------------------------------------------------- */
    ".": {
      "module-sync": {
        "types": "./dist/index.mjs.d.ts",
        "default": "./dist/index.mjs",
      },
      "module": {
        "types": "./dist/index.mjs.d.ts",
        "default": "./dist/index.mjs",
      },
      "browser": {
        "import": {
          "types": "./dist/index.mjs.d.ts",
          "default": "./dist/index.browser.mjs",
        },
        "default": {
          "types": "./dist/index.cjs.d.ts",
          "default": "./dist/index.browser.cjs",
        },
      },
      "import": {
        "types": "./dist/index.mjs.d.ts",
        "default": "./dist/index.mjs",
      },
      "default": {
        "types": "./dist/index.cjs.d.ts",
        "default": "./dist/index.cjs",
      },
    },

    /* additional entry point ------------------------------------------------- */
    "./calculator": {
      "module-sync": {
        "types": "./dist/calculator.mjs.d.ts",
        "default": "./dist/calculator.mjs",
      },
      "module": {
        "types": "./dist/calculator.mjs.d.ts",
        "default": "./dist/calculator.mjs",
      },
      "import": {
        "types": "./dist/calculator.mjs.d.ts",
        "default": "./dist/calculator.mjs",
      },
      "default": {
        "types": "./dist/calculator.cjs.d.ts",
        "default": "./dist/calculator.cjs",
      },
    },
  },
}
```

- Subpaths (entry points) must start with `.`
- Wildcards (`"./*": "./dist/*"`) are powerful but leak internals. Do not use.

## Export conditions in Node 24

| #   | Condition     | Typical use                          |
| --- | ------------- | ------------------------------------ |
| 1   | `node-addons` | Native addon build                   |
| 2   | `node`        | Node-specific build                  |
| 3   | `module-sync` | ESM that can run through `require()` |
| 4   | `import`      | ESM entry                            |
| 5   | `require`     | CJS entry                            |
| 6   | `default`     | Fallback for unknown envs            |

- **Key order matters**—Node and bundlers walk top‑to‑bottom and picks the first match.
- Always finish with **`"default"`** to stay future‑proof.

## Other export conditions recognised by most bundlers

| #   | Condition      | Bundlers that assert it                          | Typical purpose / when it wins                                                    |
| --- | -------------- | ------------------------------------------------ | --------------------------------------------------------------------------------- |
| 1   | `module`       | Webpack, esbuild, Rollup                         | Prefer tree-shakable ESM variant even when the originating import was `require()` |
| 2   | `browser`      | Webpack, Vite, esbuild, Parcel, Metro            | Ship browser-safe shims & drop Node-only APIs                                     |
| 3   | `react-server` | Webpack (RSC preset), Vite + plugin-react-server | Deliver React-Server-Component-only code paths                                    |
| 4   | `react-native` | Metro (React Native), Parcel                     | Target React Native runtime; replaces historic `react-native` root field          |
| 5   | `development`  | Vite, Parcel, esbuild                            | Expose un-minified, debug-friendly build during dev mode                          |
| 6   | `production`   | Vite, Parcel, esbuild                            | Optimised, minified production artefact                                           |
| 7   | `worker`       | Webpack, Parcel, esbuild                         | Bundle intended to run in Web/Service Worker context (no DOM)                     |
| 8   | `electron`     | Webpack, Parcel                                  | Electron main/renderer specific build                                             |
| 9   | `deno`         | Parcel (and Deno’s own resolver)                 | For code that relies on Deno standard APIs instead of Node core modules           |

## Reiterating importance of order

- Custom conditions like `production/development` must be first.
- Custom environments like deno/react-server/electron must be next
- module-sync = best ESM option for node
- module = force better tree shaking in bundlers
- deno/react-native/react-server = special environments
- browser = browser-specific version must be after module
- import = ESM fallback for pre node-20
- default = fallback

## ANY change to `exports` MUST be treated as a SEMVER-MAJOR breaking change

Seriously. Things will break in unexpected ways.

## Dual Package Hazard

- Compiling and exporting both CJS and ESM can lead to 2 instances of the same class being instantiated
- `instanceof` checks fail between a `require()` and `import` call for the same package.
- Common workaround is that CJS code is the only real implementation, while ESM is just a wrapper that imports CJS
  - Major drawbacks in terms of build-time and publishing complexity
  - Worse treeshaking performance
- The future? ESM only!
  - With `require(esm)` being backported to Node 20 as of v20.19.0 (2025-03-13), ESM is easily supported in all LTS releases
  - Bundlers already can handle ESM-only code.

## TypeScript types between ESM and CJS **ARE NOT** the same.

Workaround in some cases

```ts
export default function myFunction() { ... }
// workaround available in some situations depending on TS config
module.exports = myFunction
```

### Are The Types Wrong?

https://arethetypeswrong.github.io/
