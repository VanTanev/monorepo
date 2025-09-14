# Module 05 — CI/CD

## Why We’ll Focus on **Continuous Integration** (not Continuous Delivery)

In this module we'll explore on **Continuous Integration (CI)** and only lightly touch **Continuous Delivery (CD)**.
Reason: **CI is universal**; **CD is platform- and org-specific**.

### Quick definitions

- **CI**: Automate checks on every change. Prove the repo builds, types check, tests pass, and artifacts are reproducible.
- **CD**: Automate the path from a _known-good artifact_ to a _running release_ in a specific environment (dev/qa/prod across cloud, edge, mobile stores, etc.).

## Why CD isn’t our focus here

CD is highly dependent on:

- **Target platform** (k8s, serverless, edge runtimes, mobile stores, cloud providers).
- **Provider tooling** (AWS/GCP/Azure specifics, Vercel/Netlify, Argo/GitOps, etc).
- **Org constraints** (secrets management, approvals, change windows, SRE policies, compliance).
- **Runtime shape** (containers vs zip bundles vs static assets vs app stores).
- **Infra ownership** (Terraform/CDK/Pulumi layout, networking, IAM, cost/quotas).

Any **one true** CD path would either be toy-level or wrong for your organization.
By contrast, **CI primitives are nearly identical across stacks**, and mastering them pays off on every project.

## What we _will_ cover (CI pillars that generalize)

- **Deterministic installs**
  Lockfile discipline, Node/tooling versions, hermetic installs, reproducible envs.
- **Graph-aware orchestration**
  Build/test only what changed and its dependents; cache aggressively; avoid work on unaffected packages.
- **Fast, accurate feedback**
  Lint/typecheck/test on PRs; surface everything as annotations; fail fast but collect enough signal.
- **Cache strategy**
  pnpm store, Turbo local/remote cache, inputs/outputs/env hashing, avoiding accidental cache busts (incl. Renovate interaction).
- **Security & compliance gates**
  Audits, licenses, SBOM, secret scans, policies-as-code.
- **CI ergonomics**
  Matrices, concurrency, timeouts/retries, artifact lifecycles, branch protections.

These patterns apply on GitHub Actions, GitLab CI, CircleCI, Jenkins, Buildkite—_any_ CI.

## What we’ll cover _briefly_ from CD

We’ll handle **one portable delivery target: Docker image builds from a monorepo**.
There are **special monorepo considerations** (build context, pruning, inputs, artifact boundaries, reproducibility), and we’ll dedicate a separate lesson to doing this correctly.

## Scope of this module (expectations)

**We will:**

- Build a robust CI pipeline for monorepos (caching, graph-awareness, annotations, artifacts).
- Ensure builds are reproducible and promotable.
- Prepare artifacts and metadata that any CD system can consume.
- Show the _monorepo-aware_ Docker build (in its own lesson).

**We won’t:**

- Teach a specific cloud’s deploy steps or IaC.
- Cover blue/green, canary, or rollback mechanics for a specific platform.
- Implement app-store uploads for mobile or desktop auto-updates.

## Takeaways

- CI skills **transfer everywhere**; CD is **contextual**.
- We’ll perfect **artifact quality, speed, and signal** in CI.
- We’ll touch **Docker-from-monorepo** as the one CD-adjacent, portable build target—details in a dedicated lesson.
