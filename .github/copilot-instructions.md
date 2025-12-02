# Copilot Instructions for iCoachie

## Project Overview

iCoachie is a sports coaching management platform built for clubs, academies, students, coaches, freelancers, and parents. It enables scheduling of courses, student registration by coaches, attendance tracking, performance evaluations, and sports club management. An all-in-one solution.

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
- Components should support role-based access across all 22 user roles

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

### Global Scope Roles (Platform-Wide)
- **SUPER_ADMIN**: Platform-wide administrative access with full control over all organizations, users, and system settings
- **SYSTEM_SUPPORT**: Technical support team with read access and limited troubleshooting capabilities across the platform

### Club Scope Roles (Organization-Level)
- **CLUB_ADMIN**: Full administrative control over a specific club/organization including user management, settings, and billing
- **CLUB_MANAGER**: Operational management of club activities, scheduling, and day-to-day operations without billing access
- **HEAD_COACH**: Lead coaching role with ability to manage other coaches, create training programs, and oversee all coaching activities
- **COACH**: Individual coach who can manage their own sessions, evaluate students, and track attendance
- **ACCOUNTANT**: Financial management including payments, billing, and financial reporting for the club
- **FRONT_DESK**: Front desk personnel handling check-ins, inquiries, and basic administrative tasks
- **CONTENT_MANAGER**: Manages digital content, announcements, and communications for the club
- **MEDICAL_STAFF**: Medical personnel including physiotherapists, doctors, and first aid providers

### Facility Scope Roles (Facility-Wide)
- **FACILITY_MANAGER**: Overall management of a sports facility including all venues, grounds, staff, and operations
- **BOOKINGS_COORDINATOR**: Manages all venue and ground bookings, scheduling, and coordination with clients
- **MAINTENANCE_TECH**: Handles facility maintenance, repairs, and equipment servicing
- **EQUIPMENT_MANAGER**: Manages sports equipment inventory, distribution, and maintenance
- **SECURITY_STAFF**: Facility security personnel with access control and incident reporting
- **CLEANING_STAFF**: Facility cleaning and housekeeping personnel

### Venue Scope Roles (Venue-Specific)
- **VENUE_MANAGER**: Manages a specific venue within a facility (e.g., indoor hall, court)

### Ground Scope Roles (Ground-Specific)
- **GROUND_MANAGER**: Manages a specific ground/field within a facility
- **GROUNDSKEEPER**: Maintains grounds and fields, responsible for turf care, marking, and field preparation

### Independent Scope Roles (Self-Managed)
- **FREELANCER**: Independent coach not tied to a specific club, can create bookings and manage their own schedule

### User Scope Roles (Personal)
- **PARENT**: Guardian/parent account with access to their children's activities, progress, and communication with coaches
- **STUDENT**: Student/athlete account with access to their own schedules, progress, and training materials
