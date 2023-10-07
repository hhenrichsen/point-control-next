FROM node:18-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN pnpm install -g turbo

FROM base as builder
WORKDIR /app

COPY . .
RUN pnpm dlx turbo prune --scope=@pointcontrol/web --docker

FROM base as installer
WORKDIR /app

COPY .gitignore .gitignore
COPY --from=builder /app/out/json .
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml

RUN pnpm install --frozen-lockfile
RUN npx playwright install --with-deps

COPY --from=builder /app/out/full/ .
RUN pnpm build

CMD pnpm test:e2e -- --update-snapshots