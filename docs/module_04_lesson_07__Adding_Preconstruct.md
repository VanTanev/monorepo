# Adding Preconstruct to Our Monorepo

In this lesson, we’ll integrate **Preconstruct** into our monorepo setup.
It’s a build tool that wraps other tools (specifically Rollup and Babel) designed specifically for multi-package workspaces.

## Requirements

Here’s what we need from our bundler in this monorepo:

- It must **author `package.json` exports** for us.
- It must support **dev mode**, i.e. direct export of TypeScript source code.
- It must support **optimized production builds** that still correctly link back to source code in editors.
- It must support **custom export conditions**, including advanced cases like `browser`, `react-server`, `production`, and `development`.

## Why not just use Vite, esbuild, or tsup?

We already use tools like **Vite** and **Next.js**, which rely on **esbuild** and **webpack** under the hood.
These are excellent for apps, but not ideal for building shared packages across a monorepo.

Other package build tools like **bunchee**, **tsup**, and **tsdown** also exist, but:

- They lack good dev ergonomics when editing shared code.
- Most don't handle `package.json#exports` for us
- All three of the above do not emit declaration sourcemaps
- Handling of advanced cases is spotty.

## Why Preconstruct?

Preconstruct solves all of this with minimal setup:

- **Exports field generation**: It auto-generates `exports` in `package.json`, reducing risk of misconfiguration.
- **Dev mode `preconstruct dev`**: Symlinks dist files to source—no build step required.
- **Multiple entrypoints**: Easily define multiple exports per package.
- **Interfaces with Rollup + Babel**: It delegates bundling to these tools, ensuring compatibility and high-quality output
- **.d.ts and .d.ts source map support**: Editors still resolve and jump to source, even in production builds.

## Who uses Preconstruct

- XState (29k stars)
- react-select (28k starts)
- vanilla-extract (10k stars)

## What It Means Practically

- You write TypeScript like normal.
- Consumers import your internal packages like they would any npm package.
- Changes to shared code are instantly visible in apps, even before building.
- Production builds are fast and optimized, with proper type support.
