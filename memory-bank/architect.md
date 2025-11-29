# iCoachie: System Architect

## Overview
This file contains the architectural decisions and design patterns for the iCoachie project, a digital platform for Kochi's academies, students, and parents.

## Architectural Decisions

- Use Next.js 14+ with App Router for modern React development
- Implement role-based access control for 4 user types
- Design glassmorphism UI with Tailwind CSS for modern aesthetic
- Structure API-first architecture for scalability
- Use TypeScript for type safety across frontend and backend



1. **Backend written in TypeScript**: Use modern Node.js LTS and TypeScript for type safety, easier refactor, and improved DX.
2. **Layered Architecture**: Separate concerns into `controllers`, `services`, `models`, and `db` with `middleware` for auth and validation to make the system extensible and testable.
3. **Postgres as primary DB**: Maintain the `iCoachie` Postgres database and run migrations via SQL files placed under `src/migrations`.
4. **Auth with JWT**: Stateless JWT tokens for API calls; password hashing with bcrypt and reset via expiring tokens stored in `password_resets`.
5. **Role based access control**: Introduce `roles` table (Student, Parent, Coach, Academy Admin, Club Admin) and a `user_roles` mapping table; middleware will inspect roles from DB for endpoints.
6. **Frontend with Next.js (TypeScript)**: React-based frontend for registration, login, logout, and forgot/reset flows. Use `fetch` for data fetching and store JWT in `localStorage` (consider httpOnly cookies for production).
7. **Email service**: Use `nodemailer` (configurable via `SMTP_` env vars) to send reset links and notifications.

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



