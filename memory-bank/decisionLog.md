# Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2025-11-29 | Convert backend to TypeScript and layered architecture | Improve maintainability, type-safety, and extensibility for the project. |
| 2025-11-29 | Add JWT-based auth and roles (Customer, Coach, Freelance, HeadCoach, SuperAdmin) | Lightweight and compatible with REST API; supports role-based access control. |
| 2025-11-29 | Frontend: Next.js (TypeScript) | Good UX for React and simple server-side capabilities; integrate fast with backend API. |
| 2025-11-29 | Adopted Next.js 14+ with App Router for modern React development and improved performance | App Router provides better SEO, loading states, and nested routing compared to modern React best practices |
| 2025-01-12 | Implement tenant isolation in authentication and user management APIs | Include clubId in JWT payload and enforce club-scoped operations for multi-tenancy security |
| 2025-01-12 | Use Prisma ORM with row-level multi-tenancy | Type-safe database operations, automatic migrations, and built-in tenant isolation via clubId fields |
| 2025-01-12 | Implement soft deletes across all business models | Preserve data integrity and audit trails while allowing logical deletion |
| 2025-01-12 | Standardize controller patterns with tenant-aware CRUD operations | Consistent API structure, automatic club scoping, and proper error handling |
| 2025-01-12 | Use enums for status fields (attendance, payment, evaluation types) | Type safety, database constraints, and consistent data validation |
| 2025-01-12 | Handle Decimal types properly in payment calculations | Prevent floating-point precision issues in financial operations |
| 2025-01-12 | Implement freelancer booking system with conflict checking | Prevent double-bookings and ensure availability validation for freelancer services |
| 2025-01-12 | Add Zod validation for all Agent 4 API inputs | Type-safe input validation with detailed error messages for booking, messaging, and review APIs |
| 2025-01-12 | Implement review system with time-based edit restrictions | Allow reviews to be updated within 30 days to balance user experience with data integrity |
| 2025-01-12 | Convert controllers to express router pattern | Align with existing codebase architecture where controllers export routers directly |
| 2025-01-12 | Use AuthRequest interface for authenticated routes | Access user.id and user.clubId from JWT payload in all protected endpoints |
