# API Conventions Guide

This guide outlines the conventions and standards used across the TeamPoint backend API.

## REST Conventions

We follow standard RESTful principles for our endpoints:
- Use plural nouns for resources (e.g., `/api/v1/workspaces`, `/api/v1/projects`).
- Use appropriate HTTP methods:
  - `GET`: Retrieve a resource or list of resources.
  - `POST`: Create a new resource.
  - `PATCH`: Partially update an existing resource.
  - `DELETE`: Remove a resource.
- Nest resources logically when they are directly related and dependent (e.g., `/api/v1/workspaces/:id/members`).

## Authentication

Authentication uses JSON Web Tokens (JWT).
- **Access Tokens**: Short-lived (30 minutes), used for authorization on API requests.
- **Refresh Tokens**: Long-lived (7 days), used to obtain new access tokens.

Both tokens are sent as `httpOnly` cookies from the backend. The frontend API client automatically includes these cookies in requests using `withCredentials: true`.

## Request Format

- Requests containing data should send it as `application/json` in the request body.
- Path parameters are used for resource identifiers (e.g., `/api/v1/tasks/:id`).
- Query parameters are used for filtering, sorting, and pagination (e.g., `/api/v1/tasks?projectId=123&status=TODO`).

## Response Format

All API responses follow a consistent structure.

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error description",
    "details": [ ... ] // Optional detailed validation errors
  }
}
```

## Error Codes and Messages

Common HTTP status codes and custom application errors:
- `400 Bad Request`: Validation failure, invalid parameters.
- `401 Unauthorized`: Missing or invalid authentication token.
- `403 Forbidden`: Authenticated, but lacks permission for the resource.
- `404 Not Found`: The requested resource does not exist.
- `429 Too Many Requests`: Rate limit exceeded.
- `500 Internal Server Error`: Unexpected server failure.

## Rate Limiting

Endpoints are protected by rate limits to prevent abuse (configurable in `.env`):
- `GLOBAL_RATE_LIMIT`: Default limit for all API routes (e.g., 100 req/min).
- `AUTH_RATE_LIMIT`: Stricter limits on login/signup (e.g., 5 req/min).
- Exceeding limits returns a `429 Too Many Requests` status.

## Pagination Format

List endpoints support pagination using `page` and `limit` query parameters.

**Request:**
`GET /api/v1/tasks?page=1&limit=20`

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [ ... ],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 20,
      "totalPages": 5
    }
  }
}
```

## Validation

We use **Zod** for schema validation.
- Every endpoint receiving data must have a Zod schema defined in `schema.ts`.
- Middleware validates `req.body`, `req.query`, or `req.params` against the schema.
- Validation failures automatically return a `400 Bad Request` with detailed property paths in the error `details` array.

## Module Structure

Each backend feature is encapsulated in a module directory following this pattern:
- `service.ts`: Contains business logic and Prisma database operations. Does not handle HTTP objects.
- `controller.ts`: Handles Express `req`/`res`. Calls the service and formats the response.
- `route.ts`: Defines Express routes, applies middleware (auth, rate limits, validation).
- `schema.ts`: Zod schemas for the module.
- `permission.ts` (Optional): RBAC rules specific to the module.

*Note: The backend uses ESM. When importing files locally, always use the `.js` extension (e.g., `import { controller } from './controller.js';`).*
