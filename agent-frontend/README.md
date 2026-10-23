# HealthPilot AI frontend

React 19 + Vite frontend with responsive green, blue and white styling. Pages are code-split with `React.lazy()` and `Suspense`.

## Setup

```bash
cp .env.example .env
npm install
npm run dev
```

Set `VITE_API_URL` to the backend API base ending in `/api` (local default: `http://localhost:5000/api`). This variable is public; never put database credentials or a Gemini key in the frontend environment.

## Pages

- `/` — overview. Guest personal counts remain zero.
- `/doctors` — public doctor directory, including labelled demo profiles if the database is empty.
- `/assistant` — guest-accessible HealthPilot AI assistant.
- `/appointments` — personal appointment list; requires sign in.
- `/book?doctor=<mongo-id>` — appointment form; requires sign in.
- `/login` and `/signup` — account access.

The API uses an httpOnly cookie, so the browser JavaScript does not read or store the JWT. The backend remains the authority for authentication and appointment permissions.
