# iCoachie Backend (TypeScript)

Overview and dev notes for the TypeScript backend.

## Run

1. Copy `.env.example` to `.env` and set DB connection variables
2. Install and run:

```
cd backend-ts
npm install
npm run dev
# or build and run
npm run build
npm start
```

3. Run migrations (developer):
```
cd backend-ts
npx ts-node src/migrations/run.ts
```

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
