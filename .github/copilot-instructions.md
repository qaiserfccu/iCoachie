# Copilot Instructions for iCoachie

## Project Overview

iCoachie is a sports coaching management platform built for Kochi's academies, students, and parents. It enables scheduling of courses, student registration by coaches, attendance tracking, performance evaluations, and sports club management.

## Technical Stack

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT tokens with bcrypt password hashing
- **Validation**: Zod schemas

### Frontend
- **Framework**: Next.js 15+ with TypeScript
- **UI Components**: React 19, shadcn/ui, Radix UI
- **Styling**: Tailwind CSS with glassmorphism design
- **Icons**: Lucide React

## Architecture Patterns

### Layered Architecture
- **Controllers**: Handle HTTP requests/responses, input validation, error handling
- **Services**: Business logic, data transformation, complex operations
- **Models**: Database schemas and relationships (Prisma ORM)
- **Middleware**: Authentication, authorization, tenant isolation, validation

### Multi-Tenancy
- All business tables include `clubId` field for tenant isolation
- JWT tokens contain `clubId` for request scoping
- Middleware automatically filters queries by club context

### Soft Delete Pattern
- All models include `deletedAt` field (nullable DateTime)
- Delete operations set `deletedAt` instead of removing records
- Queries automatically filter out soft-deleted records

## Coding Conventions

### Backend Controllers
- Controllers are Express routers that export default router instances
- All routes require authentication via `requireAuth` middleware
- Use `AuthRequest` interface for accessing `req.user.id` and `req.user.clubId`
- Input validation using Zod schemas with detailed error responses

### Tenant-Aware Queries
```typescript
// Always scope queries by clubId from JWT
const records = await prisma.model.findMany({
  where: { clubId: req.user.clubId, deletedAt: null }
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

### Frontend Components
- Use shadcn/ui components from the `components/ui` directory
- Follow the existing glassmorphism design patterns
- Components should support role-based access (Club Admin, Coach, Freelancer, Parent)

## Build and Test Commands

### Backend
```bash
cd backend
npm install
npm run dev          # Start development server
npm run build        # Build TypeScript
npm run test         # Run Jest tests
npm run test:watch   # Run tests in watch mode
```

### Frontend
```bash
cd frontend
npm install
npm run dev          # Start Next.js development server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run test:e2e     # Run Playwright E2E tests
```

## User Roles
- **Club Admin**: Manages academies, coaches, and overall club operations
- **Coach**: Registers students, manages sessions, tracks attendance
- **Freelancer**: Independent coaches with their own schedules
- **Parent**: Views child progress, books sessions, makes payments
