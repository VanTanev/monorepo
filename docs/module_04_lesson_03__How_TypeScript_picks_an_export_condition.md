# How TypeScript Picks an `exports` Condition

> _Goal:_ Understand how `module` and `moduleResolution` compiler options in `tsconfig.json` cooperate to make TypeScript understand which `package.json#exports` condition will be matched, and load the appropriate types.

---

## Background refresher

1. `module` decides _how each file is emitted_ (ES `import/export`, CJS `require`/`module.exports`, or "leave it untouched").
2. `moduleResolution` decides _where to look_ for the symbol: classic Node rules, Node ≥ 16 dual‑graph rules, or the looser "bundler" rules.
3. When TypeScript walks a package's `exports` object it **always adds** the conditions `"types"` and `"default"`.
   The remaining conditions depend on the information from (1) + (2):
   - If the JS we are emitting is **ESM** ➡ the resolver adds the `"import"` condition (and, for Node‑style modes, `"node"`).
   - If the JS we are emitting is **CJS** ➡ the resolver adds the `"require"` condition (plus `"node"` where applicable).
   - Consult https://www.typescriptlang.org/docs/handbook/modules/theory.html#module-resolution

Put differently: _"What would Node (or your bundler) try first?"_
TypeScript asks the same question while loading the types for libraries you import.

---

## Popular option combinations

| #   | `module`                                                                                    | `moduleResolution`      | Target runtime / tool                  | Export conditions considered¹                                                                      |
| --- | ------------------------------------------------------------------------------------------- | ----------------------- | -------------------------------------- | -------------------------------------------------------------------------------------------------- |
| 1   | `preserve`                                                                                  | `bundler` (implied)     | Vite, esbuild, Bun, tsx, Turbopack     | per‑statement: (`import` → [`types`, `import`]) (`require` → [`types`, `require`])                 |
|     | `preserve` keeps the original syntax; bundlers read `.ts` directly.                         |                         |                                        |                                                                                                    |
| 2   | `esnext`                                                                                    | `bundler`               | Browser bundles where code is ESM‑only | Always [`types`, `import`]                                                                         |
|     | Slightly simpler than #1 -- no mixed module syntax.                                         |                         |                                        |                                                                                                    |
| 3   | `nodenext`                                                                                  | `nodenext` (implied)    | Node ≥ 20, libs meant for Node         | per-statement: (`import` → [`types`, `node`, `import`]) (`require` → [`types`, `node`, `require`]) |
|     | Mirrors Node's real dual‑graph rules; understands package `type:"module"`, `.mts/.cts` etc. |                         |                                        |                                                                                                    |
| 4   | `commonjs`                                                                                  | `node10` (alias `node`) | Legacy Node ≤ 12 or Jest‑only libs     | Always [`types`, `require`]                                                                        |
|     | **No support** for `exports` -- if the package omits legacy `main` field, resolution fails. |                         |                                        |                                                                                                    |

¹ Notes on conditions:

- `default` condition is always checked last so its omitted from the table for brevity.
- The final resolved order is always `['types', ...other conditions..., 'default']`

> Further reading: [https://www.typescriptlang.org/docs/handbook/modules/reference.html](https://www.typescriptlang.org/docs/handbook/modules/reference.html)

### Custom conditions

You can insert additional conditions for TS to add to the resolve stack by using `compilerOptions.customConditions`.
For example, `"customConditions": ["module"]` may in some arcane situations more accurately mimic how a bundler would resolve a badly authored npm package.
In 99% of the cases you don't need this, and touching it will lead to pain.

> https://www.typescriptlang.org/tsconfig/#customConditions

### Debugging resolution

When in doubt how TS resolves something, you can run `tsc --noEmit --traceResolution`. It prints the full resolve condition stack and file probes.

---

## Deep dive 1 -- `module: preserve` + `moduleResolution: bundler`

### Why this combo?

- `module: preserve` keeps your original syntax as is -- both ESM `import`/`export` **and** CommonJS `require()`/`export =` in the same file are legal. That matches how modern bundlers parse TypeScript: they run their own transforms later.
- `moduleResolution: bundler` imitates the union of classic Node rules (extensionless paths, directory modules) **and** the modern `exports`/`imports` fields.

### Resolution algorithm in practice

```ts
// index.ts (module: preserve)
// ESM → resolver adds ["import"]
import libA from "awesome-lib";

// CJS → resolver adds ["require"]
import libB = require("awesome-lib");
```

- Both statements add `"types"`, so the final stacks are `["types","import","default"]` and `["types","require","default"]` respectively.
- `"node"` **is not** added in bundler mode -- bundlers are usually not Node.

### Considerations

1. This is meant for use when a bundler will handle final code compilation
2. It implies that you run `tsc --noEmit` separately from your build process to check types
3. If you need custom rules added to the resolver (`browser`, `react-server`) you can add them via `compilerOptions.customConditions`

---

## Deep dive 2 -- `module: nodenext` + `moduleResolution: nodenext`

### Why this combo?

- It literally **models the current LTS Node rules** (and will keep evolving with Node).
- Gives you true dual‑format projects: `.cts` emits CJS, `.mts` emits ESM, plain `.ts` follows the surrounding `package.json#type` field.

### Resolution algorithm in practice

```ts
// server.mts  (ESM file)
import db from "my-db"; // resolver conditions → ["types","node","import"]
import user from './lib/user.ts'

// worker.cts (CJS file)
import db = require("my-db"); // resolver conditions → ["types","node","require"]
import user = require('./lib/user') // -> lib/user.ts
```

Key points:

1. `node` resolver condition is always present -- you are in Node‑land.
2. Extension‑less relative imports **only work** in files / positions that will emit `require()` (CJS). In pure ESM (`.mts`, or `type:"module"`) you must write the filename plus extension.
3. Node 22 can now `require()` an ESM export in sync code (flag `--experimental-require-module`, promoted to default in Node 23+) -- TypeScript 5.8+ allows it, but _only_ when the runtime supports it.
4. Use for your server / CLI node apps, or for writing libraries meant to be used in a node environment.

---

## Take‑aways

- Think of `module` as the **syntax emitter** -- it indirectly answers "Will my `import` be rewritten to something else?"
- `moduleResolution` is the **directory walker** -- It decides what branch to take in the export condition, and which `.d.ts` types definition to load.
- Together they form the **condition stack** that walks `exports` or `imports`.
- The two patterns to memorise:
  1. **`preserve + bundler`** -- for **apps** that use a bundler which consumes `.ts`.
  2. **`nodenext + nodenext`** -- for **libraries** or **servers** that must run directly on Node.js.
