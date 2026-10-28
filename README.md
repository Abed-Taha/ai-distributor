# AI Distributor

## Project Structure

```text
ai-distributor/
├── apps/
│   ├── web/                 # Next.js frontend
│   └── api/                 # NestJS backend
├── packages/
│   ├── shared/              # Shared types and utilities
│   └── database/            # Database schema and configuration
├── docker/
│   ├── web.Dockerfile       # Next.js Docker configuration
│   ├── api.Dockerfile       # NestJS Docker configuration
│   └── docker-compose.yaml  # Docker services
├── .env.example
├── .gitignore
├── package.json
├── pnpm-lock.yaml
└── pnpm-workspace.yaml
```

## Prerequisites

- Node.js 22+
- pnpm 11+
- Docker Desktop
- Git

## Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment variables

Create your local environment file:

```bash
pnpm copy-env
```

Update `.env` with your local configuration and credentials.

### 3. Start the database

Make sure Docker Desktop is running, then start the Docker services:

```bash
pnpm docker:up
```

This starts the Next.js frontend, NestJS backend, and PostgreSQL database.

To build the Docker images and start the services:

```bash
pnpm docker:dev
```

Check service status:

```bash
docker compose --env-file .env -f docker/docker-compose.yaml ps
```

### 4. Start the application locally

Run the frontend and backend development servers:

```bash
pnpm dev
```

Alternatively, run each application separately:

```bash
pnpm dev:web
```

```bash
pnpm dev:api
```

Default development URLs:

- Frontend (Next.js): http://localhost:4200
- Backend (NestJS): http://localhost:3000
- PostgreSQL: `localhost:5432`

Actual ports depend on your environment and application configuration.

## Development Commands

| Command                   | Description                                               |
| ------------------------- | --------------------------------------------------------- |
| `pnpm install`            | Install workspace dependencies                            |
| `pnpm copy-env`           | Create `.env` from `.env.example` if missing              |
| `pnpm dev`                | Start the frontend and backend locally                    |
| `pnpm dev:web`            | Start the Next.js frontend only                           |
| `pnpm dev:api`            | Start the NestJS backend only                             |
| `pnpm docker:build`       | Rebuild Docker images without cache                       |
| `pnpm docker:up`          | Start Docker services in the background                   |
| `pnpm docker:dev`         | Build and start Docker services                           |
| `pnpm docker:logs`        | Follow Docker service logs                                |
| `pnpm docker:down`        | Stop and remove Docker containers and networks            |
| `pnpm docker:start`       | Start existing stopped containers                         |
| `pnpm docker:stop`        | Stop containers without removing them                     |
| `pnpm docker:restart`     | Restart Docker containers                                 |
| `pnpm docker:install:api` | Install API dependencies inside the running API container |
| `pnpm docker:install:web` | Install Web dependencies inside the running Web container |
| `pnpm docker:install`     | Install dependencies for both API and Web containers      |

## Environment Variables

Configure the following variables in your root `.env` file as needed.

| Variable                   | Description                                                             |
| -------------------------- | ----------------------------------------------------------------------- |
| `NODE_ENV`                 | Application environment                                                 |
| `WEB_HOST`                 | Frontend server host                                                    |
| `WEB_PORT`                 | Next.js frontend port                                                   |
| `NEXT_PUBLIC_API_BASE_URL` | Public API URL used by browser-side code                                |
| `API_HOST`                 | Backend server host                                                     |
| `API_PORT`                 | NestJS backend port                                                     |
| `POSTGRES_HOST`            | Database hostname                                                       |
| `POSTGRES_PORT`            | PostgreSQL port                                                         |
| `POSTGRES_DB`              | Database name                                                           |
| `POSTGRES_USER`            | Database username                                                       |
| `POSTGRES_PASSWORD`        | Database password                                                       |
| `DATABASE_URL`             | Database connection string                                              |
| `AUTH_SECRET`              | Authentication secret, if required by the authentication implementation |

### Environment configuration notes

- Use `localhost` for services accessed directly from your development machine.
- Use `postgres` as the database hostname for connections from containers on the Compose network.
- Use `http://api:3000` for server-to-server API requests from another Compose service, assuming the backend listens on port `3000`.
- Use `http://localhost:3000` for browser-side API requests during local development.

### Security

- Never commit `.env` or real credentials.
- Keep `.env.example` free of secrets.
- Never expose secrets through `NEXT_PUBLIC_` environment variables.
- Use strong credentials outside local development.

## Docker & Database

The Docker Compose setup runs the following services:

| Service          | Container name             | Default port |
| ---------------- | -------------------------- | ------------ |
| Next.js frontend | `ai-distributors-web`      | `4200`       |
| NestJS backend   | `ai-distributors-api`      | `3000`       |
| PostgreSQL       | `ai-distributors-postgres` | `5432`       |
| pgAdmin          | `ai-distributors-pgadmin`  | `5050`       |

Start the services:

```bash
pnpm docker:up
```

Open pgAdmin at `http://localhost:5050` and sign in with `PGADMIN_EMAIL` and `PGADMIN_PASSWORD` from `.env`. The `AI Distributor` PostgreSQL server is preconfigured.

Follow logs:

```bash
pnpm docker:logs
```

Stop and remove containers and networks:

```bash
pnpm docker:down
```

PostgreSQL data is persisted in a Docker named volume. Stopping or removing containers normally preserves the volume and its data.

To remove the database volume as well, use `docker compose down -v`. **This deletes the persisted database data**, so use it only when you intend to reset the database.

## Development Guidelines

- Use pnpm for dependency management.
- Keep shared types and utilities in `packages/shared`.
- Keep database-related code in `packages/database`.
- Keep frontend UI and routing in `apps/web`.
- Keep API endpoints and backend business logic in `apps/api`.
- Store local environment variables in `.env`.
- Do not commit build outputs, dependencies, or generated secrets.

## Code Quality

Run formatting, linting, and TypeScript checks before committing or opening a pull request.

| Command             | Description                                                                    |
| ------------------- | ------------------------------------------------------------------------------ |
| `pnpm format`       | Format supported files across the project using Prettier                       |
| `pnpm format:check` | Check formatting without modifying files                                       |
| `pnpm lint`         | Run linting across workspace packages that define a lint script                |
| `pnpm typecheck`    | Run TypeScript checks across workspace packages that define a typecheck script |

### Run checks locally

```bash
pnpm format
pnpm format:check
pnpm lint
pnpm typecheck
```

### GitHub Actions

Formatting checks, linting, and type checking should run automatically through GitHub Actions on every push and pull request when the CI workflow is configured.

Make sure Prettier is installed at the workspace root and each application or package defines the corresponding `lint` and `typecheck` scripts in its `package.json`. Packages without these scripts are skipped by the root workspace commands.
