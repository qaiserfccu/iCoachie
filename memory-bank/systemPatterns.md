# System Patterns

## Architectural Patterns

### Layered Architecture
- **Controllers**: Handle HTTP requests/responses, input validation, error handling
- **Services**: Business logic, data transformation, complex operations
- **Models**: Database schemas and relationships (Prisma ORM)
- **Middleware**: Authentication, authorization, tenant isolation, validation

### Row-Level Multi-Tenancy
- All business tables include `clubId` field for tenant isolation
- JWT tokens contain `clubId` for request scoping
- Middleware automatically filters queries by club context
- Cross-tenant data access prevented at database and application levels

### Soft Delete Pattern
- All models include `deletedAt` field (nullable DateTime)
- Delete operations set `deletedAt` instead of removing records
- Queries automatically filter out soft-deleted records
- Maintains data integrity and audit trails

## Design Patterns

### Repository Pattern (via Prisma)
- Type-safe database operations through Prisma Client
- Automatic query building and result mapping
- Migration management and schema validation

### Middleware Chain Pattern
- JWT authentication → Role validation → Tenant isolation → Request validation
- Composable middleware for flexible endpoint protection
- Centralized error handling and response formatting

### Controller Pattern
- Standardized CRUD operations with tenant scoping
- Consistent error responses and status codes
- Input validation using Joi/Zod schemas
- Automatic relationship loading and filtering

## Common Idioms

### Tenant-Aware Queries
```typescript
// Always scope queries by clubId from JWT
const records = await prisma.model.findMany({
  where: { clubId: req.clubId, deletedAt: null }
});
```

### Error Handling
```typescript
// Consistent error response format
res.status(400).json({
  success: false,
  error: 'Validation failed',
  details: validationErrors
});
```

### JWT Payload Structure
```typescript
interface JWTPayload {
  userId: string;
  clubId: string;
  role: UserRole;
  iat: number;
  exp: number;
}
```

## Component Composition

The application follows a component-based architecture with reusable UI components from shadcn/ui. Role-based routing ensures users only access relevant dashboards. Static data is currently used but will be replaced with API calls following REST conventions.

### Backend API Composition
- Express.js routers for modular endpoint organization
- Controller classes for business logic encapsulation
- Middleware composition for cross-cutting concerns
- Prisma client for database abstraction
