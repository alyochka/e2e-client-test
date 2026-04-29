# E2E Client Test

End-to-end test project demonstrating [Orval](https://orval.dev/) — a tool that transforms OpenAPI specs into type-safe TypeScript clients, mocks, and validators.

## Overview

This project consists of two [AdonisJS](https://adonisjs.com/) applications that demonstrate a full contract-first API workflow:

- **`api-pets`** — A pets API server with Bearer token authentication, SQLite persistence, pagination, and auto-generated OpenAPI spec via `@foadonis/openapi`.
- **`api-bypass`** — A client app that dynamically fetches the OpenAPI spec from `api-pets`, generates a type-safe TypeScript client via Orval (split by tag, with MSW mocks), and proxies requests through an auth-aware axios interceptor.

## Architecture

```
┌──────────────┐   dynamic fetch    ┌───────────────┐
│  api-pets    │ ─────────────────► │ petstore.json │
│  (AdonisJS)  │   (OpenAPI spec)   │               │
│  SQLite DB   │                    │               │
│  Bearer Auth │                    └───────┬───────┘
└──────────────┘                            │
                                     Orval generates
                                     (workspace mode)
                                          │
                        ┌─────────────────┼─────────────────┐
                        ▼                 ▼                 ▼
                ┌───────────┐    ┌─────────────┐   ┌─────────────┐
                │generated/  │    │  mocks/     │   │ custom-     │
                │ (split by  │    │  (MSW)      │   │ instance.ts │
                │  tag)      │    │             │   │ (axios +    │
                │            │    │             │   │  auth)      │
                └─────┬─────┘    └─────────────┘   └──────┬──────┘
                      │                                    │
                      ▼                                    ▼
              ┌───────────────┐                    ┌───────────────┐
              │  api-bypass   │◄───────────────────│ Bearer token  │
              │  (AdonisJS)   │   proxied requests │ forwarded     │
              │  + Orval client                    │ from headers  │
              └───────────────┘                    └───────────────┘
```

## Features

### api-pets
- **Bearer token authentication** — Login endpoint returns a 64-char hex token stored in a `sessions` table
- **SQLite database** — Separate dev/test databases with full migration + seeding support
- **Pagination** — `GET /pets` supports `?page=&perPage=` query params
- **Rich Pet model** — status enum, nested owner info, tags array (JSON), optional notes
- **OpenAPI decorators** — `@ApiOperation`, `@ApiResponse`, `@ApiBody` for auto spec generation
- **Interactive docs** — Scalar UI at `/docs`

### api-bypass
- **Dynamic OpenAPI fetching** — `npm run generate:client` pulls live spec from `api-pets`
- **Orval workspace mode** — Two outputs: API client (split by tag) + MSW mocks
- **Custom axios instance** — Interceptor injects Bearer token from env or forwarded headers
- **Auth proxy** — Controllers forward authorization headers to the generated client
- **Mock discovery** — `GET /mocks` lists all generated MSW handlers from the spec

## Project Structure

```
e2e-client-test/
├── api-pets/                              # Pets API server
│   ├── app/
│   │   ├── controllers/                   # AuthController, PetsController
│   │   ├── middleware/                    # BearerAuthMiddleware
│   │   ├── models/                        # Pet, User, Session, ErrorResponse
│   │   └── validators/                    # auth.ts, pet.ts
│   ├── database/
│   │   ├── migrations/                    # users, pets, sessions tables
│   │   └── seeders/                       # Default test user
│   ├── config/
│   │   └── openapi.ts                     # OpenAPI generation config
│   ├── tests/
│   │   ├── unit/                          # Model & validator tests
│   │   ├── functional/                    # Controller HTTP tests
│   │   └── helpers/                       # Test credentials helper
│   └── tmp/                               # SQLite databases (dev + test)
│
├── api-bypass/                            # Client app using Orval
│   ├── app/
│   │   ├── client/
│   │   │   ├── custom-instance.ts         # Auth-aware axios interceptor
│   │   │   ├── generated/                 # Orval output (split by tag)
│   │   │   └── mocks/                     # Orval output (MSW handlers)
│   │   └── controllers/                   # BypassController, AuthController, MocksController
│   ├── scripts/
│   │   └── fetch-openapi.ts               # Dynamic spec fetcher
│   ├── tests/
│   │   ├── unit/                          # Controller unit tests (mocked)
│   │   ├── functional/                    # Route wiring tests
│   │   └── integration/                   # E2E chain tests (requires api-pets)
│   ├── orval.config.ts                    # Workspace: API + mocks outputs
│   └── petstore.json                      # Fetched OpenAPI spec
│
└── .tool-versions                         # Node.js 22.22.2 (LTS)
```

## Prerequisites

- Node.js 22.22.2 LTS (managed via `.tool-versions` with mise)

## Getting Started

### Install Dependencies

```bash
cd api-pets && npm install
cd ../api-bypass && npm install
```

### Run Database Migrations & Seed

```bash
cd api-pets
mkdir -p tmp
node ace migration:run
node ace db:seed   # Creates test user: test@test.com / secret123
```

### Run the Servers

Start the pets API (port 3333):

```bash
cd api-pets
npm run dev
```

Start the bypass client (port 3334):

```bash
cd api-bypass
npm run dev
```

### Generate the Orval Client

Fetch the live OpenAPI spec from `api-pets` and generate type-safe clients + mocks:

```bash
cd api-bypass
npm run generate:client
```

This:
1. Fetches `http://localhost:3333/api` → saves to `petstore.json`
2. Runs Orval with workspace config:
   - `app/client/generated/` — Axios client split by tag
   - `app/client/mocks/` — MSW mock handlers

## API Endpoints

### api-pets (port 3333)

| Method | Path            | Auth     | Description              |
|--------|-----------------|----------|--------------------------|
| POST   | `/auth/login`   | Public   | Login, returns Bearer token |
| GET    | `/pets`         | Public   | List pets (paginated)    |
| POST   | `/pet`          | Required | Create a new pet         |
| GET    | `/docs`         | Public   | Interactive API docs     |

### api-bypass (port 3334)

| Method | Path            | Description                  |
|--------|-----------------|------------------------------|
| POST   | `/auth/login`   | Proxy login via generated client |
| GET    | `/pets`         | Proxy list pets              |
| POST   | `/pet`          | Proxy create pet (auth forwarded) |
| GET    | `/mocks`        | List available MSW mock handlers |

### Pet Schema

```json
{
  "id": 1,
  "nome": "Shibo",
  "raca": "Pug",
  "idade": 6,
  "status": "available",
  "ownerName": "John",
  "ownerEmail": "john@example.com",
  "tags": ["friendly", "vaccinated"],
  "notes": "Needs grooming",
  "createdAt": "2025-04-29T00:00:00.000Z",
  "updatedAt": "2025-04-29T00:00:00.000Z"
}
```

## Testing

### api-pets (36 tests)

```bash
cd api-pets && npm test
```

| Suite        | Count | Description                              |
|--------------|-------|------------------------------------------|
| Unit         | 21    | Pet model, auth & pet validators         |
| Functional   | 14    | Auth controller, Pets controller (HTTP)  |
| Security     | 1     | OWASP CVE-Lite dependency scan           |

Database isolation: separate `tmp/test.db.sqlite3` with full migration/seed/teardown per suite.

### api-bypass (10 tests)

```bash
cd api-bypass && npm test
```

| Suite        | Count | Description                              |
|--------------|-------|------------------------------------------|
| Unit         | 5     | Controller structure verification        |
| Functional   | 2     | Route wiring tests                       |
| Integration  | 3     | E2E chain: login → create pet → list pets |
| Security     | 1     | OWASP CVE-Lite dependency scan           |

Integration tests auto-detect if `api-pets` is running and skip gracefully if not.

### Security Scanning

Both projects include an [OWASP CVE-Lite](https://github.com/OWASP/cve-lite) test suite that scans `package-lock.json` against the OSV advisory database.

| Command | Description |
|---------|-------------|
| `npm run security:scan` | Scan dependencies (fails on CRITICAL) |
| `npm run security:report` | Generate HTML report in `cve-report/` |
| `npm run security:fix` | Apply validated direct dependency fixes |
| `node ace test security` | Run the CVE scan as a Japa test |

Current scan results:

**api-pets** (19 findings, 0 critical):
| Package | Severity | Type | CVEs | Fix |
|---------|----------|------|------|-----|
| `@adonisjs/lucid@21.6.1` | HIGH | Direct | CVE-2026-22814 | 21.8.2 |
| `lodash@4.17.21` | HIGH | Transitive | CVE-2026-2950, CVE-2026-4800, CVE-2025-13465 | 4.17.23 |
| `validator@13.15.0` | HIGH | Transitive | CVE-2025-56200, CVE-2025-12758 | 13.15.20 |
| *(+10 more HIGH/MEDIUM/LOW transitive deps)* | | | | |

**api-bypass** (2 findings, 0 critical):
| Package | Severity | Type | CVEs | Fix |
|---------|----------|------|------|-----|
| `lodash-es@4.17.23` | HIGH | Transitive | CVE-2026-2950, CVE-2026-4800 | 4.18.0 |
| `@adonisjs/core@6.21.0` | MEDIUM | Direct | CVE-2026-40255 | 7.8.1 |

## Environment Variables

### api-pets (`.env`)

```
TZ=UTC
PORT=3333
HOST=localhost
LOG_LEVEL=info
APP_KEY=
NODE_ENV=development
```

### api-bypass (`.env`)

```
TZ=UTC
PORT=3334
HOST=localhost
LOG_LEVEL=info
APP_KEY=
NODE_ENV=development
API_PETS_URL=http://localhost:3333
# API_TOKEN= (optional: obtained via POST /auth/login)
```

## Tech Stack

- **Framework**: AdonisJS 6.21
- **API Client Generator**: Orval 7.21
- **HTTP Client**: Axios 1.15
- **OpenAPI**: `@foadonis/openapi` 0.3 (auto-generation from decorators)
- **Validation**: VineJS 3.0
- **Database**: SQLite via Better-SQLite3 11 + Lucid ORM 21
- **Testing**: Japa 4 (unit, functional, integration suites)
- **Language**: TypeScript 5.7
- **Node.js**: 22.22.2 LTS
