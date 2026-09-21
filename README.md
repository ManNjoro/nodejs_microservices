# Node.js Microservices Project

A TypeScript-based microservice architecture built with Express, PostgreSQL, Kafka, and a shared internal package. The project exposes a central API gateway and splits business logic into focused services for authentication, task management, media uploads, and workflow queries.

## Overview

This workspace contains a modular monorepo with:

- `apps/api-gateway` - single entry point for client requests
- `apps/auth-service` - user registration, login, and identity validation
- `apps/task-service` - task creation, listing, lookup, and deletion
- `apps/media-service` - attachments for tasks and image upload handling
- `apps/workflow-service` - workflow lookups associated with tasks
- `packages/shared` - common utilities, logging, validation, auth helpers, and Kafka helpers
- `sql/` - PostgreSQL migration scripts
- `docker/docker-compose.yml` - Kafka container setup

## Architecture

The gateway sits in front of the internal services and forwards requests based on route prefixes.

```text
Client
  |
  v
API Gateway (port 3000)
  |----> Auth Service (port 3001)
  |----> Task Service (port 3002)
  |----> Media Service (port 3003)
  |----> Workflow Service (port 3004)
  |
  +----> PostgreSQL (via DATABASE_URL)
  +----> Kafka (dockerized broker on localhost:9092)
```

## Repository Structure

```text
.
├── apps/
│   ├── api-gateway/
│   ├── auth-service/
│   ├── media-service/
│   ├── task-service/
│   └── workflow-service/
├── packages/
│   └── shared/
├── docker/
│   └── docker-compose.yml
├── scripts/
│   └── db-migrate.ts
├── sql/
│   ├── 001_users.sql
│   ├── 002_tasks.sql
│   ├── 003_attachments.sql
│   └── 004_workflows.sql
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.base.json
└── README.md
```

## Prerequisites

Before running the project, make sure you have:

- Node.js 18+ or later
- npm
- Docker and Docker Compose
- PostgreSQL database available and reachable via `DATABASE_URL`

## Installation

From the project root:

```bash
npm install
```

## Environment Setup

Create a local `.env` file from the example:

```bash
cp .env.example .env
```

Then fill in the values in `.env` with your own configuration.

Example values from the project:

```env
DATABASE_URL=
LOG_LEVEL=info
PORT=3000
AUTH_PORT=3001
TASK_PORT=3002
MEDIA_PORT=3003
WORKFLOW_PORT=3004

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

AUTH_SERVICE_URL=http://localhost:3001
TASK_SERVICE_URL=http://localhost:3002
MEDIA_SERVICE_URL=http://localhost:3003
WORKFLOW_SERVICE_URL=http://localhost:3004

GATEWAY_SECRET=gateway-secret

AWS_ENDPOINT_URL_S3=""
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_REGION=""
STORAGE_BUCKET=""

KAFKA_BROKERS=localhost:9092
```

## Kafka Setup

This project includes a Docker Compose file for the Kafka broker:

```bash
npm run kafka:up
```

To stop it:

```bash
npm run kafka:down
```

To view logs:

```bash
npm run kafka:logs
```

## Database Setup

The repo includes SQL migration files under `sql/`. The migration runner is configured in `scripts/db-migrate.ts` and uses `DATABASE_URL` from your environment.

Example:

```bash
npm run db:migrate
```

You can also run a specific SQL file:

```bash
npm run db:migrate -- sql/002_tasks.sql
```

## Running the Services

From the root, the workspace exposes per-service scripts:

```bash
npm run dev:auth
npm run dev:task
npm run dev:media
npm run dev:workflow
npm run dev:gateway
```

Each service starts with `tsx watch src/index.ts` and exposes health endpoints.

### Health checks

- Gateway: `GET /health`
- Auth: `GET /health`
- Task: `GET /health`
- Media: `GET /health`
- Workflow: `GET /health`

## API Gateway and Route Mapping

The gateway is the main interface for clients and runs on port `3000`.

### Authentication routes

All auth endpoints are exposed under the gateway path `/auth`.

| Method | Route            | Description              |
| ------ | ---------------- | ------------------------ |
| `POST` | `/auth/register` | Register a new user      |
| `POST` | `/auth/login`    | Authenticate a user      |
| `GET`  | `/auth/me`       | Get current user profile |

### Task routes

All task endpoints are exposed under `/tasks` via the gateway.

| Method   | Route        | Description       |
| -------- | ------------ | ----------------- |
| `POST`   | `/tasks`     | Create a new task |
| `GET`    | `/tasks`     | List tasks        |
| `GET`    | `/tasks/:id` | Get a single task |
| `DELETE` | `/tasks/:id` | Delete a task     |

### Media routes

Attachment endpoints are routed under `/tasks/:taskId/attachments`.

| Method | Route                        | Description                 |
| ------ | ---------------------------- | --------------------------- |
| `POST` | `/tasks/:taskId/attachments` | Upload an image attachment  |
| `GET`  | `/tasks/:taskId/attachments` | List attachments for a task |

### Workflow routes

Workflow lookup routes are routed under `/tasks/:taskId/workflows`.

| Method | Route                      | Description               |
| ------ | -------------------------- | ------------------------- |
| `GET`  | `/tasks/:taskId/workflows` | List workflows for a task |

## Identity and Security

Requests from the gateway to downstream services use a shared secret check via `GATEWAY_SECRET`.

The app also expects identity headers on protected operations:

- `x-user-id`
- `x-user-role`

These headers are used by services to authorize task and attachment actions.

## Shared Package

The `packages/shared` workspace package centralizes cross-service functionality, including:

- logger utilities
- HTTP response helpers
- validation helper
- JWT token handling
- gateway secret middleware
- Kafka client/producer/consumer helpers
- database pool access

## Common Development Workflow

A typical run sequence for local development is:

```bash
npm install
cp .env.example .env
npm run kafka:up
npm run db:migrate
npm run dev:auth
npm run dev:task
npm run dev:media
npm run dev:workflow
npm run dev:gateway
```

Then access the system through the API gateway on `http://localhost:3000`.

## Notes

- The project is designed for local development and learning microservice patterns.
- Kafka and PostgreSQL are expected to be running before the dependent services operate reliably.
- Some routes and middleware values are intentionally simple and starter-oriented rather than production-hardened.
- The project uses TypeScript with `tsx` for live reload during development.

## License

This project is licensed under `ISC`.
