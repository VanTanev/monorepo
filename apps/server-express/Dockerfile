# Setup a multi-stage Docker build for a Node.js application using pnpm.


# **Base stage**: Set up Node.js environment with pnpm
FROM node:24-slim@sha256:03eae3ef7e88a9de535496fb488d67e02b9d96a063a8967bae657744ecd513f2 AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable pnpm
RUN corepack install -g pnpm@latest-10


# **Fetch stage**: Install dependencies using pnpm with caching
FROM base AS fetch
# Copy only the files necessary to run `pnpm fetch` - this helps leverage Docker layer caching
COPY pnpm-lock.yaml pnpm-workspace.yaml ./
# We may need to copy patches if there are any local patches applied to dependencies
COPY patches patches
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm fetch --frozen-lockfile --ignore-scripts


# **Build stage**: Build the application
FROM fetch AS build
WORKDIR /app
COPY . .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --offline --frozen-lockfile --ignore-scripts
# "@apps/server-express" is the name of the workspace, defined in ./apps/server-express/package.json
RUN pnpm --filter=@apps/server-express... run build
RUN pnpm --filter=@apps/server-express deploy --prod /prod/app --legacy --ignore-scripts


# **App stage**: Final production image
FROM node:24-alpine@sha256:d1b3b4da11eefd5941e7f0b9cf17783fc99d9c6fc34884a665f40a06dbdfc94f AS app
WORKDIR /prod/app
COPY --from=build /prod/app /prod/app


# Expose the application port and set environment variables
EXPOSE 3000
ENV NODE_ENV=production
ENV PORT=3000
ENV LOG_LEVEL=info
ENV MY_APP_ID="@app/server-express"
CMD ["node", "--enable-source-maps", "dist/index.cjs"]
