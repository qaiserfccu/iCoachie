# iCoachie - Sports Coaching Platform

## Purpose

iCoachie is a comprehensive multi-tenancy sports coaching platform that connects clubs, coaches, freelancers, and parents/kids for sports training and development. The platform provides end-to-end management of sports coaching operations including student enrollment, session scheduling, attendance tracking, performance evaluations, payment processing, and real-time communication.

## Target Users

- **Club Administrators**: Manage club operations, coaches, students, and billing
- **Coaches**: Schedule sessions, track attendance, provide evaluations, communicate with parents
- **Freelancers**: Offer coaching services, manage bookings and availability
- **Parents**: Enroll kids, track progress, communicate with coaches, make payments
- **Kids/Students**: Participate in sessions, receive evaluations and feedback

## Technical Architecture

### Backend (Completed)
- **Framework**: Node.js with Express.js and TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based with role-based access control
- **Real-time**: Socket.IO for live messaging and notifications
- **File Storage**: Hosted filesystem with token-based secure access
- **Multi-tenancy**: Row-level tenant isolation across all data
- **Testing**: Jest with 22/22 passing tests
- **Documentation**: OpenAPI 3.0 with Swagger UI and Postman collection

### Frontend (Next Phase)
- **Framework**: Next.js with TypeScript
- **Styling**: Tailwind CSS with custom gradient theme
- **State Management**: TBD
- **Real-time Integration**: Socket.IO client

## Recent UI Updates

- Replaced the old theme with a sky-blue to purple gradient and introduced a split-hero layout for the landing, login, register, forgot-password, reset-password and dashboard pages.
- Removed the left-hand navigation menu to focus the experience on full-width content and simplified layout behavior.
- Added a right-side circular hero image (placeholder at `public/images/hero-portrait.svg`), which the user can replace with their own image.

## Project Status

### ✅ Completed (Agents 1-7)
1. **Database Design**: Complete Prisma schema with multi-tenancy
2. **Authentication**: JWT-based auth with role management
3. **Core APIs**: Clubs, students, sessions, attendance, evaluations, payments
4. **Freelancer System**: Booking, messaging, reviews
5. **Real-time Features**: Socket.IO integration for live updates
6. **File Management**: Secure upload/download with tenant isolation
7. **Testing & Documentation**: 22/22 tests passing, OpenAPI docs, Postman collection

### 🔄 Next Phase (Agent 8)
- Frontend development and backend integration
- Payment processing implementation
- Real-time messaging UI components

## Project Summary

iCoachie is a comprehensive sports coaching platform that connects clubs, coaches, freelancers, and parents/kids for sports training and development.

