# Todo App 2 – Backend

Express REST API with SQLite persistence for Todo (task) items. Interactive API documentation is served at `/api-docs` (Swagger UI) using the OpenAPI 3.0 spec in `src/docs/openapi.yaml`.

## Prerequisites

- Node.js 18+

## Install

```bash
npm install
```

## Run

```bash
npm run dev
```

Server listens on `http://localhost:3000`.

- Health: `GET /health`
- Tasks CRUD: `GET|POST /tasks`, `PUT|DELETE /tasks/:id`
- Swagger UI: `http://localhost:3000/api-docs`

## Build & production start

```bash
npm run build
npm start
```

## OpenAPI verification

Keep the spec aligned with the implementation whenever you change routes or payloads.

1. **Schema validation** – validates `src/docs/openapi.yaml` syntax and structure:

   ```bash
   npm run validate-openapi
   ```

   This runs `@apidevtools/swagger-cli` (`swagger-cli validate`) and a small script that checks each Express route in `src/routes/tasks.ts` against the OpenAPI paths (and the reverse).

2. **Manual cross-check** – compare request bodies, status codes, and JSON shapes in `src/routes/tasks.ts` and `src/middleware/errorHandler.ts` with `src/docs/openapi.yaml` (e.g. `Todo`, `ErrorResponse`, and each operation’s responses).

3. **Smoke test in the browser** – with `npm run dev`, open `/api-docs`, try **Try it out** on each operation, and confirm responses match the documented codes and schemas.
