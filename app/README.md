# HD Note-Taking App

## Setup

1. Clone the repo.
2. Backend: cd backend, npm i, npx prisma generate, npx prisma migrate dev --name init, npm run dev.
3. Frontend: cd frontend, npm i, npm start.
4. Assets: Place logo.png and bg.jpg in frontend/public.

## Build

- Backend: npm run build
- Frontend: npm run build

## Deployment

- DB: Use Neon or Supabase for Postgres.
- Backend: Deploy to Render (set env vars, build: npm run build, start: npm start).
- Frontend: Deploy to Vercel (connect Git).
- Update API baseURL in frontend/api.ts to deployed backend URL.
- For Google OAuth, update callback to deployed backend URL.

Test locally: Signup/login, create/delete notes.
