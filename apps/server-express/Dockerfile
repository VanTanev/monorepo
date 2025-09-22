FROM node:22.19.0-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable pnpm
RUN corepack install -g pnpm@latest-10

FROM base AS fetcher
COPY pnpm-lock.yaml pnpm-workspace.yaml ./
COPY patches patches
RUN pnpm fetch --ignore-scripts

FROM fetcher AS builder
WORKDIR /app
COPY . .
RUN pnpm install --offline --ignore-scripts --frozen-lockfile
RUN pnpm --filter=@apps/server-express... run build
RUN pnpm --filter=@apps/server-express deploy --prod /prod/app --legacy --ignore-scripts

FROM node:22.19.0-slim AS runner
WORKDIR /app
COPY --from=builder /prod/app .

EXPOSE 3000
ENV NODE_ENV=production
ENV PORT=3000
ENV LOG_LEVEL=info
ENV MY_APP_ID="@app/server-express"
CMD ["node", "--enable-source-maps", "dist/index.cjs"]
