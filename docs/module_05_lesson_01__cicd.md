# Module 05 — CI/CD

## Quick definitions

- **CI**: Automate checks on every change. Prove the repo builds, types check, tests pass, and artifacts are reproducible.
- **CD**: Automate the path from a _known-good artifact_ to a _running release_ in a specific environment (dev/qa/prod across cloud, edge, mobile stores, etc.).

## Why We’ll Focus on **Continuous Integration** (not Continuous Delivery)

In this module we'll explore on **Continuous Integration (CI)** and only lightly touch **Continuous Delivery (CD)**.
Reason: **CI is universal**; **CD is platform- and org-specific**.

## Why CD isn’t our focus here

CD is highly dependent on:

- **Target platform** (k8s, serverless, edge runtimes, mobile stores, cloud providers).
- **Provider tooling** (AWS/GCP/Azure specifics, Vercel/Netlify, Argo/GitOps, etc).
- **Org constraints** (secrets management, approvals, change windows, SRE policies, compliance).
- **Runtime shape** (containers vs zip bundles vs static assets vs app stores).
- **Infra ownership** (Terraform/CDK/Pulumi layout, networking, IAM, cost/quotas).

Any **one true** CD path would either be toy-level or wrong for your organization.
By contrast, **CI primitives are nearly identical across stacks**, and mastering them pays off on every project.

## What we’ll cover _briefly_ from CD

We’ll handle **one portable delivery target: Docker image builds from a monorepo**.

## Scope of this module (expectations)

**We will:**

- Build a robust CI pipeline for monorepos
- Show the _monorepo-aware_ Docker build (in its own lesson).

**We won’t:**

- Teach a specific cloud’s deploy steps or IaC.
- Cover blue/green, canary, or rollback mechanics for a specific platform.
