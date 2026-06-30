# Setup a multi-stage Docker build for a Node.js application using pnpm.


# **Base stage**: Set up Node.js environment with pnpm
FROM node:22-slim@sha256:813a7480f28fdadac1f7f5c824bcdad435b5bc1322a5968bbbdef8d058f9dff4 AS base
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
FROM node:22-alpine@sha256:968df39aedcea65eeb078fb336ed7191baf48f972b4479711397108be0966920 AS app
WORKDIR /prod/app
COPY --from=build /prod/app /prod/app


# Expose the application port and set environment variables
EXPOSE 3000
ENV NODE_ENV=production
ENV PORT=3000
ENV LOG_LEVEL=info
ENV MY_APP_ID="@app/server-express"
CMD ["node", "--enable-source-maps", "dist/index.cjs"]
