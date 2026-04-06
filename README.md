# Finance Data Processing and Access Control Backend

A production-style backend for a finance dashboard built with Node.js, TypeScript, Express, PostgreSQL, Prisma, JWT authentication, RBAC, analytics endpoints, request validation, structured logging, rate limiting, Swagger documentation, and unit tests.

## Project Overview

This backend is designed around a clean separation of concerns:

- `models/` define domain-facing TypeScript contracts shared across services and authenticated request context.
- `controllers/` handle HTTP orchestration and response formatting.
- `services/` contain business logic and rule enforcement.
- `repositories/` isolate Prisma data access.
- `middleware/` handles authentication, authorization, rate limiting, validation, logging, and errors.
- `validators/` define request validation contracts with Zod.
- `config/` centralizes environment, Prisma, logging, and Swagger configuration.

The system supports:

- User management with soft delete
- JWT authentication
- Strict role-based access control
- Financial record CRUD with filters, pagination, and search
- Dashboard summary and detailed analytics
- Centralized error handling
- Swagger API documentation
- Jest unit tests

## Tech Stack

- Node.js
- TypeScript with strict mode
- Express.js
- PostgreSQL
- Prisma ORM
- JWT authentication
- Zod validation
- Winston logging
- Jest testing

## Setup Instructions

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env
```

3. Update `.env` with your PostgreSQL connection string and JWT secret.

4. Generate the Prisma client:

```bash
npm run prisma:generate
```

5. Create and apply migrations:

```bash
npm run prisma:migrate -- --name init
```

6. Start the development server:

```bash
npm run dev
```

7. Seed demo users and financial data:

```bash
npm run seed
```

8. Open Swagger documentation:

`http://localhost:4000/api/docs`

## Environment Variables

- `PORT`: Application port
- `NODE_ENV`: `development`, `test`, or `production`
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret used to sign and verify JWTs
- `JWT_EXPIRES_IN`: Token expiration, for example `1h`
- `RATE_LIMIT_WINDOW_MS`: Rate-limit window in milliseconds
- `RATE_LIMIT_MAX`: Max requests per window
- `LOG_LEVEL`: Winston log level
- `BOOTSTRAP_ADMIN_NAME`: Optional default admin name
- `BOOTSTRAP_ADMIN_EMAIL`: Optional default admin email
- `BOOTSTRAP_ADMIN_PASSWORD`: Optional default admin password

## Deployment

- GitHub repository: [aditya-devm02/finance-data-processing-access-control-backend](https://github.com/aditya-devm02/finance-data-processing-access-control-backend)
- Live API: [https://finance-data-processing-access-cont-bay.vercel.app/api](https://finance-data-processing-access-cont-bay.vercel.app/api)
- Swagger docs: [https://finance-data-processing-access-cont-bay.vercel.app/api/docs/](https://finance-data-processing-access-cont-bay.vercel.app/api/docs/)
- Health check: [https://finance-data-processing-access-cont-bay.vercel.app/api/health](https://finance-data-processing-access-cont-bay.vercel.app/api/health)

## Demo Credentials

- Admin
  - Email: `admin@finance-backend-demo.local`
  - Password: `admin123`
- Analyst
  - Email: `analyst@finance-backend-demo.local`
  - Password: `analyst123`
- Viewer
  - Email: `viewer@finance-backend-demo.local`
  - Password: `viewer123`

These accounts are seeded for live demo and reviewer access. Rotate them after submission if you continue using the project publicly.

## Terminal Testing

Anyone testing the deployed API from a terminal can use these `curl` commands directly.

Base URL:

```bash
BASE_URL="https://finance-data-processing-access-cont-bay.vercel.app/api"
```

Health check:

```bash
curl "$BASE_URL/health"
```

Admin login:

```bash
curl -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@finance-backend-demo.local","password":"admin123"}'
```

Analyst login:

```bash
curl -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"analyst@finance-backend-demo.local","password":"analyst123"}'
```

Viewer login:

```bash
curl -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"viewer@finance-backend-demo.local","password":"viewer123"}'
```

Save a JWT token into a shell variable:

```bash
TOKEN=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@finance-backend-demo.local","password":"admin123"}' | jq -r '.data.accessToken')
```

If `jq` is not installed, copy the `accessToken` manually from the login response and set it like this:

```bash
TOKEN="paste-access-token-here"
```

Use the token on protected routes:

Dashboard summary:

```bash
curl "$BASE_URL/dashboard/summary" \
  -H "Authorization: Bearer $TOKEN"
```

Records with pagination:

```bash
curl "$BASE_URL/records?page=1&limit=5" \
  -H "Authorization: Bearer $TOKEN"
```

Analytics summary:

```bash
curl "$BASE_URL/analytics/summary" \
  -H "Authorization: Bearer $TOKEN"
```

Admin-only users endpoint:

```bash
curl "$BASE_URL/users" \
  -H "Authorization: Bearer $TOKEN"
```

Filtering and search examples:

```bash
curl "$BASE_URL/records?page=1&limit=5&type=EXPENSE&category=Rent" \
  -H "Authorization: Bearer $TOKEN"
```

```bash
curl "$BASE_URL/records?page=1&limit=5&search=salary" \
  -H "Authorization: Bearer $TOKEN"
```

Open Swagger docs in the browser:

```bash
open "https://finance-data-processing-access-cont-bay.vercel.app/api/docs/"
```

## API Endpoints

- `POST /api/auth/login`
- `GET /api/health`
- `GET /api/users`
- `GET /api/users/:id`
- `POST /api/users`
- `PATCH /api/users/:id`
- `DELETE /api/users/:id`
- `GET /api/records`
- `GET /api/records/:id`
- `POST /api/records`
- `PATCH /api/records/:id`
- `DELETE /api/records/:id`
- `GET /api/dashboard/summary`
- `GET /api/analytics/summary`
- `GET /api/docs`

## Role-Based Access Explanation

- `VIEWER`
  - Can only access `GET /api/dashboard/summary`
- `ANALYST`
  - Can access `GET /api/dashboard/summary`
  - Can view financial records
  - Can access detailed analytics
- `ADMIN`
  - Full access to user management
  - Full access to financial record CRUD
  - Can access dashboard and analytics endpoints

## Key Behaviors Implemented

- Passwords are hashed with bcrypt.
- JWT middleware validates tokens, handles expiration, and attaches the authenticated user to the request.
- Users and financial records are soft deleted through `deletedAt`.
- Deleted resources are excluded from reads by default.
- Financial record listing supports date range filters, category filters, type filters, search, page, and limit.
- Rate limiting is applied globally to the API.
- Winston logs requests and errors.
- Swagger docs are available for all routes.
- Validation is applied to request body, params, and query data.
- Errors return a consistent format:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {}
  }
}
```

## Design Decisions

- Repository classes keep Prisma-specific query logic out of services.
- Service classes hold domain rules such as preventing deletion of the last active admin.
- Analytics are computed from repository-fetched records to keep logic explicit and testable.
- A bootstrap admin option is included to make initial environment setup practical for a reviewer.
- Soft delete is used instead of hard delete for audit-friendly behavior.

## Assumptions Made

- User creation is an admin-only workflow. Public self-registration is not part of the requirements.
- Viewers are restricted to dashboard summary access only.
- Detailed analytics are exposed through `GET /api/analytics/summary`.
- Financial amounts use Prisma `Decimal(14,2)` for currency-safe storage.

## Requirement Coverage

- User management: Create, update, list, fetch, and soft delete users with hashed passwords and unique email enforcement.
- Authentication: JWT login, token signing, token verification, protected routes, attached authenticated user context, and token expiration handling.
- RBAC: Viewer access to dashboard only, analyst access to records and analytics, admin access to user management and record CRUD.
- Financial records: Admin create/update/delete, analyst and admin read access, soft delete, and full filtering support.
- Analytics: Total income, total expenses, net balance, category totals, monthly trends, weekly trends, recent transactions, and summary by date.
- Validation and errors: Zod validation for body, params, and query with centralized error handling and consistent error responses.
- Database and search: Prisma PostgreSQL schema, indexes, migrations, pagination, search across category and description, and deleted-row exclusion by default.
- Production concerns: Rate limiting, request/error logging with Winston, Swagger/OpenAPI documentation, Jest unit tests, and strict TypeScript architecture.

## Testing

Run unit tests with:

```bash
npm test
```

Run the seed script with:

```bash
npm run seed
```

Current tests cover:

- Authentication service login behavior
- Authentication middleware token validation and expiration handling
- Authorization middleware RBAC and inactive-user handling
- User service creation and last-admin deletion rule
- Financial record service creation and deletion checks
- Analytics aggregation logic
