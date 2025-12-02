# iCoachie Backend (TypeScript)

Overview and dev notes for the TypeScript backend.

## Run

1. Copy `.env.example` to `.env` and set DB connection variables
2. Install and run:

```
cd backend
npm install
npm run dev
# or build and run
npm run build
npm start
```

3. Run migrations (developer):
```
npx prisma migrate dev
npx prisma db seed
```

## Testing

The backend includes comprehensive test coverage with three types of tests:

### Running Tests

```bash
# Run all tests
npm run test

# Run unit tests only (no database required)
npm run test:unit

# Run smoke tests (requires database)
npm run test:smoke

# Run tests with coverage
npm run test:coverage

# Watch mode for development
npm run test:watch
```

### Test Categories

#### Unit Tests (`npm run test:unit`)
- Tests utility functions and middleware in isolation
- No database connection required
- Fast execution (~15 seconds)
- 100% coverage target for utils and middleware
- Located in `tests/utils/` and `tests/middleware/`

#### Smoke Tests (`npm run test:smoke`)
- End-to-end API validation
- Covers auth, RBAC, CRUD operations
- Tests multi-tenancy isolation
- Requires running database
- Located in `tests/smoke.test.ts`

#### Integration Tests
- Full API testing with database
- Located in `tests/*.test.ts`

### Coverage Reports

After running tests with coverage, reports are available at:
- Terminal: Summary displayed inline
- HTML: `coverage/lcov-report/index.html`
- LCOV: `coverage/lcov.info`

### Test Data Reset

Smoke and integration tests automatically:
1. Truncate all tables before each test
2. Seed required lookup data (roles, statuses)
3. Clean up after test completion

## Endpoints
- `/api/health`
- `/api/auth/register`
- `/api/auth/login`
- `/api/auth/forgot-password`
- `/api/auth/reset-password`
- `/api/users/me`
- `/api/users/me/profile`
- `/api/users/roles`

## Notes
- JWT-based auth & password hashing
- Roles defined in `roles` table
- Use SMTP in `.env` to enable password reset emails
