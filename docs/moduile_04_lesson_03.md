# Sharing TypeScript Code Within a Monorepo

## Problem Statement

When working in a monorepo with multiple apps, we want to extract common code into internal packages.

### Goals

- Write internal packages in TypeScript and share them across apps.
- Prioritize developer experience:

  - Editing shared code should feel as seamless as editing application code.
  - Changes to shared code should trigger live reloads during development.

- Be mindful of performance tradeoffs:
  - Avoid unnecessary builds or file watching.
  - Keep things fast during both development and production builds.

We’ll look at two main strategies for sharing code and weigh their pros and cons.

## Approach 1: Export TypeScript Directly and Let Consumers Handle Compilation

```jsonc
{
  "exports": {
    ".": "./src/index.ts",
    "./button": "src/button/index.tsx",
  },
}
```

## Approach 2: Build Shared Code Separately and Orchestrate Compilation Across Apps

> In the next lesson ;)
