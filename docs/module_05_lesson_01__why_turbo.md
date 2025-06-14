# Why Use Turborepo Instead of Plain pnpm Scripts for Task Running

---

- **Parallelism & Ordering**

  - _pnpm_: Runs tasks **in dependency order** (topological) by default and can run them **in parallel** with `--parallel`.
  - _Turborepo_: Also respects topological order but lets you declare **task-to-task edges** (`dependsOn`) across packages, allowing for fine-grained graph building.

- **Cached Steps (a.k.a. Incremental Builds)**

  - _pnpm_: Executes each script every time. Any speed-up relies on whatever incremental logic the script itself has (e.g. TypeScript incremental flag).
  - _Turborepo_: Hashes each task’s inputs and outputs, re-running **only** the tasks whose hash changed. Cached artifacts can be reused locally _and_ remotely.

- **Remote Sharing**

  - _pnpm_: No built-in mechanism; every machine or CI job rebuilds.
  - _Turborepo_: Pushes/pulls cached outputs (Vercel Remote Cache or custom bucket) so teammates and CI share work.

- **Output Tracking**

  - _pnpm_: Doesn’t track what files a script produces.
  - _Turborepo_: You declare `outputs`; Turbo restores them automatically from cache.

- **Graph Inspection**

  - _pnpm_: No built-in visualization for workspaces or tasks.
  - _Turborepo_: `turbo run <task> --graph /tmp/task-graph.jpg` exports a JPG file visualizing the task dependency graph.

- **Extra Utilities**
  - _pnpm_: Plain npm-scripts plus filtering (`--filter`).
  - _Turborepo_: Extras like `turbo prune`, `turbo graph`, `turbo ls`, etc.

---

## TL;DR

- **Speed** – Task-level caching turns minutes of rebuilds into seconds.
- **Control** – `dependsOn` lets you model complex task graphs, not just package order.
- **Visibility** – One command outputs an inspectable graph.
- **Scale** – Remote cache means large teams & CI reuse work effortlessly.
