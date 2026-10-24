# HealthPilot AI

An AI-assisted healthcare appointment coordinator. Users describe what they need in plain language, the assistant points them to the right medical department, and they book a slot with a listed doctor.

Live demo: https://health-pilot-demo-web-app-git-main-santanu-2002s-projects.vercel.app/

Note: the backend runs on a free hosting tier. If the first request is slow, the server is waking up; wait a few seconds.

## Why I built it

Most people don't know whether a problem needs a cardiologist, an orthopedist or a general physician, so they search symptoms online and get anxious. HealthPilot AI handles that first step.

The AI is a guide, not a doctor:
- It never diagnoses, prescribes or promises outcomes.
- It never claims an appointment is booked. Only the authenticated booking API can create bookings.
- For emergency symptoms, it tells the user to contact local emergency services.

[Santanu: add 2-3 lines in your own voice on why you chose healthcare.]

## Features

- AI assistant (Gemini) that suggests a specialty and is aware of the doctors in the database. Works for guests.
- Doctor directory with department, city, hospital, experience, fee and rating.
- Appointment booking and cancellation for signed-in users.
- Sign up and login with hashed passwords and httpOnly cookie sessions.
- Fallback assistant reply if the Gemini key is missing or the call fails.

Booking rules enforced on the server:
- Slots start on the hour or half-hour.
- At least one hour in advance; no past dates.
- No double booking, enforced in code and by a unique partial index in MongoDB.

## Tech stack

- Frontend: React 19, Vite, Lucide icons, custom CSS. Hosted on Vercel.
- Backend: Node.js, Express 5, MongoDB with Mongoose, Google Gemini (`@google/genai`, default `gemini-2.5-flash`). Hosted on Render.
- Uptime: UptimeRobot pings `/api/health` so the free-tier server stays awake.

## Security

- scrypt password hashing with per-user salt.
- JWT in httpOnly, secure cookie (SameSite=None in production).
- Rate limits: 120 requests/min general, 30 per 15 min on auth, 20/min on AI chat.
- CORS allow-list and origin check on state-changing requests.
- Security headers, 100kb body limit, 2,000-character cap on AI messages.
- Startup validation rejects a missing or weak JWT secret.
- Secrets stay in git-ignored `.env` files; the Gemini key is backend-only.

## Project structure

```
HealthPilot-AI/
  agent-frontend/   React + Vite app (pages, components, context, services)
  agent-backend/    Express API (controllers, models, middleware, routes, scripts)

HealthPilot-AI/
  agent-frontend/
    src/
      pages/        Overview, Doctors, Assistant, BookAppointment, Appointments, AuthPage
      components/   Sidebar, Topbar, Brand
      layouts/      AppLayout
      context/      app and auth state
      services/     api.js (API client)
      utils/        navigation.js
  agent-backend/
    server.js
    src/
      controllers/  auth, doctor, appointment, ai
      models/       User, Doctor, Appointment
      middleware/   authMiddleware, rateLimit, errorHandler
      routes/       auth, doctors, appointment, agent
      config/       db, env
    scripts/        seedDemoDoctors.js, importDoctors.js
```

## Run locally

Requirements: Node 18+, a MongoDB connection string, optionally a Gemini API key.

Backend:
```bash
cd agent-backend
npm install
```
Create `agent-backend/.env`:
```
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=<connection string>
JWT_SECRET=<random string, 32+ characters>
JWT_EXPIRES_IN=1d
GEMINI_API_KEY=<optional>
GEMINI_MODEL=gemini-2.5-flash
```
```bash
npm run seed:demo
npm run dev
```

Frontend:
```bash
cd agent-frontend
npm install
```
Create `agent-frontend/.env`:
```
VITE_API_URL=http://localhost:5000/api
```
```bash
npm run dev
```
Open http://localhost:5173

To import your own doctors from CSV: `npm run import:doctors -- ./data/doctors.csv`

## Deployment

- Frontend on Vercel, auto-deployed from `main`.
- Backend on Render, with environment variables set in the dashboard.
- UptimeRobot monitors `/api/health` to avoid cold starts.

## Sample data

All doctors are fictional profiles labelled `DEMO-001` to `DEMO-006`. They are not real practitioners. The CSV importer allows real, verified data to replace them.

## How I used AI

In the product: Gemini powers the assistant. The system prompt restricts it to a coordinator role and injects live doctor data from the database.

While building (mainly Claude and ChatGPT):
- Layout and CSS: used AI to shape the responsive layout and styling, iterating on my descriptions.
- Research and sample data: used AI to find where to source sample doctor data and which fields a directory needs, which shaped the Doctor schema and CSV importer.
- Deployment: used AI to understand deployment errors (CORS, cross-site cookies, environment variables, startup failures) and their fixes, which made deployment faster.

Moments where AI surprised me or changed my approach:
[Santanu: add specific, real examples, such as an error where the first AI answer was wrong, an idea the AI suggested that you hadn't considered, or a time you disagreed with it.]

What I learned:
[Santanu: 1-2 sentences on where AI helped most and how you verified its answers.]

## Next steps

- Real doctor availability calendars.
- Email or SMS reminders.
- Doctor accounts and rescheduling.
- Shared rate-limit store (Redis) for multiple instances.

## Disclaimer

This is a demo project and does not provide medical advice, diagnosis or treatment. In an emergency, contact local emergency services.
