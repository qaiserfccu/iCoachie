# iCoachie: System Architect

## Overview
This file contains the architectural decisions and design patterns for the iCoachie project, a digital platform for Kochi's academies, students, and parents.

## Architectural Decisions

- Use Next.js 14+ with App Router for modern React development
- Implement role-based access control for 4 user types
- Design glassmorphism UI with Tailwind CSS for modern aesthetic
- Structure API-first architecture for scalability
- Use TypeScript for type safety across frontend and backend

## Backend Architecture (Completed Agents 1-3)

1. **Backend written in TypeScript**: Use modern Node.js LTS and TypeScript for type safety, easier refactor, and improved DX.
2. **Layered Architecture**: Separate concerns into `controllers`, `services`, `models`, and `db` with `middleware` for auth and validation to make the system extensible and testable.
3. **Postgres as primary DB**: Maintain the `iCoachie` Postgres database and run migrations via Prisma ORM.
4. **Auth with JWT**: Stateless JWT tokens for API calls; password hashing with bcrypt and reset via expiring tokens stored in `password_resets`.
5. **Role based access control**: Introduce `roles` table (Student, Parent, Coach, Academy Admin, Club Admin) and a `user_roles` mapping table; middleware will inspect roles from DB for endpoints.
6. **Row-level Multi-tenancy**: All business tables include `clubId` for tenant isolation; middleware enforces club scoping.
7. **Soft Deletes**: All models support soft deletes with `deletedAt` field for data integrity.
8. **Prisma ORM**: Type-safe database operations with automatic migrations and schema validation.

## API Structure (Agent 3 Complete)

### Authentication & User Management
- POST /api/auth/register - User registration with role assignment
- POST /api/auth/login - JWT token generation
- POST /api/auth/forgot-password - Password reset initiation
- POST /api/auth/reset-password - Password reset completion
- GET/POST/PUT/DELETE /api/users - User CRUD with tenant isolation

### Core Business APIs
- GET/POST/PUT/DELETE /api/clubs - Club management
- GET/POST/PUT/DELETE /api/students - Student management with club scoping
- GET/POST/PUT/DELETE /api/sessions - Training session management with enrollment
- GET/POST/PUT/DELETE /api/attendance - Attendance tracking
- GET/POST/PUT/DELETE /api/evaluations - Student performance evaluations
- GET/POST/PUT/DELETE /api/payments - Payment processing and records

### Middleware
- JWT authentication with clubId extraction
- Role-based access control
- Request validation with Joi/Zod
- Error handling and logging

## Additional Considerations
* Add role-based middleware (e.g., `requireRole('Coach')`) for protected endpoints.
* Consider implementing refresh tokens or rotating tokens for longer sessions.
* Protect the reset token endpoint with rate limits to avoid abuse.
* For production, enable stricter CORS and prefer httpOnly secure cookies for tokens.

## UI / Design
* A global theme using a sky-blue gradient hero with card-based UI is the default appearance of the app.
* Consistent UI tokens and CSS variables are centralized in `frontend/app/globals.css` to make color, spacing, and typography decisions easy to use across components.
* Landing page outlines key features with a hero CTA to register or sign in; this page should be kept small & focused to maximize conversions.

## Components

### Frontend

Frontend application built with Next.js 14+ App Router, featuring role-based dashboards for clubs, coaches, freelancers, and parents

**Responsibilities:**

- User authentication
- Role-based UI
- Static data display
- API integration preparation

### Backend

Backend API server built with Node.js and Express.js, handling authentication, user management, bookings, payments, and messaging

**Responsibilities:**

- REST API endpoints
- Database operations
- Authentication
- Payment processing

### Database

PostgreSQL database storing users, clubs, coaches, students, bookings, attendance, progress reports, and evaluations

**Responsibilities:**

- Data persistence
- Relationships management
- Query optimization

