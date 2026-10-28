FROM node:22-alpine

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV CI=true

RUN npm install --global pnpm@11.20.0

WORKDIR /workspace

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/package.json
COPY apps/api/package.json ./apps/api/package.json
COPY packages ./packages

RUN pnpm config set fetch-timeout 1800000
RUN pnpm install --frozen-lockfile

COPY . .

ARG API_PORT=3000
ENV PORT=${API_PORT}
ENV CHOKIDAR_USEPOLLING=true

EXPOSE ${API_PORT}

CMD ["sh", "-c", "pnpm --filter api start:dev"]