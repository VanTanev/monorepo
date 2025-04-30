# A short preamble on ESM vs CJS

Node.js supports two parallel module systems:

| Abbrev. | Formal name        | Typical syntax             | File extensions                              |
| ------- | ------------------ | -------------------------- | -------------------------------------------- |
| ESM     | ECMAScript Modules | `import fs from "fs"`      | `.mjs`, `.js` (when `type:"module"`), `.mts` |
| CJS     | CommonJS Modules   | `const fs = require("fs")` | `.cjs`, `.js` (default), `.cts`              |

- Think of it as `import` (ESM) vs `require()` (CJS).
- The real differences go deeper—scope, evaluation order, live bindings, top-level `await`, and more.

## How does Node .js decide which system to use?

1. **File extension first**

   - `.mjs` → **ESM**
   - `.cjs` → **CJS**
   - TypeScript:\_ `.mts`/`.cts` follow the same rule and are emitted as `.mjs`/`.cjs`.

1. **Otherwise look at the nearest `package.json`**
   ```jsonc
   {
     // choose one
     "type": "module", // treat plain .js as ESM
     // "type": "commonjs" // (default) treat plain .js as CJS
   }
   ```

## CommonJS (CJS) Overview

- **Syntax**

  ```js
  // export
  function add(a, b) {
    return a + b;
  }
  module.exports = { add };

  // import
  const { add } = require("./math.cjs");
  ```

- **Characteristics**
  - Synchronous loading
  - `require()` is a function call and can happen in any part of the code
  - Exports are a mutable object `module.exports`
  - Global variables `__filename` and `__dirname`
  - No native `import`/`export` statements or `top-level await`.
  - Does not support import statements like `import fs from "node:fs"`
  - Does support `import()` calls like `const { default: fs } = await import('fs')`
  - In Node.js `>=22.0.0`, supports synchronous `require("esm-module")`.
  - In Node.js `<22.0.0`, ESM imports must use asynchronous `await import("esm-module")` imports

## ECMAScript Modules (ESM) Overview

- **Syntax**

  ```js
  // export named
  export function add(a, b) { return a + b; }

  // export default
  export default class Calculator { … }

  // import
  import { add } from './math.mjs';
  import Calculator from './calculator.mjs';
  ```

- **Characteristics**
  - Static `import` / `export` declarations - the import tree is known ahead of time
  - Imports MUST sepcify extension of file being imported.
  - Supports top-level `await`
  - `__filename` and `__dirname` do not exist
  - Instead, `import.meta.filename` and `import.meta.dirname` (nodejs `>=20.11.0`)
