# MediSense

**AI-Powered Skin Disease Analysis & Personalized Skin Health Assistant**

MediSense lets people upload a photo of a skin concern and get a
preliminary, confidence-scored AI read on possible conditions, an
estimated severity, evidence-based skincare guidance, hydration/oiliness
analysis, a place to store medical reports, an educational AI chatbot,
and a way to find nearby dermatologists.

> **MediSense provides AI-assisted, preliminary information only. It is
> not a substitute for professional medical diagnosis.** Always consult a
> licensed dermatologist or physician for medical concerns, especially
> urgent or severe symptoms. This messaging is enforced throughout the
> product's UI, not just in this README.

---

## Monorepo layout

```
medisense/
  backend/       Node.js + Express + MongoDB REST API
  ml-service/    Python + FastAPI + TensorFlow inference microservice
  frontend/      React + TypeScript + Vite + Tailwind CSS SPA
  docs/          Build progress log
```

Each subfolder has its own README with setup details
(`backend/README.md` doesn't exist separately — see below;
`ml-service/README.md`, `frontend/README.md`).

## Quick start (all three services)

```bash
# 1. MongoDB
# Make sure a local MongoDB instance is running (or use MongoDB Atlas
# and point MONGO_URI at it).

# 2. Backend API — http://localhost:5000
cd backend
cp .env.example .env      # fill in MONGO_URI, JWT secrets, Cloudinary, etc.
npm install
npm run seed                # creates an admin user + sample articles/quiz
npm run dev

# 3. ML service — http://localhost:8000 (separate terminal)
cd ml-service
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
# Runs in "mock mode" automatically until you train a real model —
# see ml-service/README.md.

# 4. Frontend — http://localhost:5173 (separate terminal)
cd frontend
cp .env.example .env       # set VITE_API_URL etc.
npm install
npm run dev
```

Then visit `http://localhost:5173`, sign up, complete onboarding, and tap
the floating camera button on the dashboard to run your first analysis.

**Default admin login** (created by `npm run seed`):
`admin@medisense.app` / `Admin@12345` — change this password immediately
after first login via Profile → Change password.

## Environment variables

| File | Purpose |
|---|---|
| `backend/.env.example` | Mongo URI, JWT secrets, Cloudinary, Google OAuth, SMTP, ML service URL, Google Maps key |
| `ml-service/.env.example` | Model path, image size, confidence threshold, CORS origins |
| `frontend/.env.example` | API URL, Google Client ID, Google Maps key |

Copy each `.env.example` to `.env` and fill in real values. The app is
designed to boot and be fully demoable with **zero external API keys**
configured (ML service falls back to mock-mode predictions, chat falls
back to a rule-based assistant, email falls back to console-logged JSON
transport) — only `MONGO_URI` is strictly required to get the backend
running. Cloudinary, Google OAuth, Google Maps, and a trained model
unlock the full production experience.

## Architecture overview

```
┌─────────────┐      REST (JWT)      ┌──────────────┐      REST      ┌────────────────┐
│   Frontend   │ ───────────────────▶ │   Backend     │ ─────────────▶ │  ML Service     │
│ React/Vite   │ ◀─────────────────── │ Node/Express  │ ◀───────────── │ FastAPI/TF      │
└─────────────┘                      └──────┬───────┘                └────────────────┘
                                             │
                                    ┌────────┴────────┐
                                    │    MongoDB       │
                                    │ (Mongoose models)│
                                    └──────────────────┘
                                             │
                                    ┌────────┴────────┐
                                    │   Cloudinary     │
                                    │ (images/reports) │
                                    └──────────────────┘
```

- **Frontend** never talks to the ML service or Cloudinary directly — all
  writes go through the Node backend, which is the single source of
  authorization and validation.
- **Auth**: JWT access tokens (in-memory on the client) + httpOnly refresh
  cookie for persistent login; Google OAuth via ID-token verification.
- **ML service** is stateless and swappable — the backend only depends on
  its `/api/predict` contract (see `ml-service/README.md`).

## Database schema (high level)

| Collection | Key fields | Relationships |
|---|---|---|
| `users` | email, password (hashed), role, onboarding sub-doc | referenced by nearly everything below |
| `skinanalyses` | image, predictions[], severity, hydrationAnalysis | `user` ref |
| `medicalreports` | file, type, reportDate | `user` ref, optional `relatedAnalysis` ref |
| `chatconversations` | messages[] (role/content) | `user` ref |
| `articles` | title, slug, content, category | optional `createdBy` (admin) ref |
| `articlebookmarks` | — | `user` + `article` ref (unique compound index) |
| `quizzes` / `quizattempts` | questions[] / answers[], score | `quiz` + `user` refs |
| `systemlogs` | action, targetType/targetId, metadata | `actor` (admin) ref |

All schemas use Mongoose timestamps, field-level validation, and indexes
on the fields queried most (`user + createdAt` compound indexes for
history/pagination, text indexes on articles for search).

## API surface

All endpoints are prefixed `/api`. See each controller file in
`backend/src/controllers/` for full request/response shapes; summary:

- `/auth` — signup, login, google, verify-email, forgot/reset-password, refresh, logout, me
- `/users` — profile, avatar, onboarding, password, summary, delete account
- `/skin-analysis` — upload+analyze, history, get by id, notes, delete, analytics
- `/reports` — upload, list, get, delete
- `/chat` — conversations CRUD, send message
- `/quiz` — list, get, submit attempt, history, leaderboard
- `/articles` — feed/search, categories, get by slug, bookmarks
- `/clinics` — nearby search, place details (Google Places proxy)
- `/admin` — dashboard stats, user management, moderation views, article/quiz CRUD, logs

## Security

- Passwords hashed with bcrypt (12 rounds); JWT access + refresh token
  pair; refresh token in httpOnly, sameSite cookie.
- `helmet`, `cors` (credentialed, origin-locked to the frontend URL),
  global + auth-specific rate limiting (`express-rate-limit`).
- Input validation via `express-validator` on all auth/user mutation
  routes; Mongoose schema validation everywhere else.
- File uploads restricted by MIME type and size (multer), stored in
  Cloudinary (not on the app server's disk).
- Admin routes gated by `protect` + `restrictTo('admin')` middleware;
  admin mutations write to an audit log (`systemlogs`).

## Testing the app manually

1. **Auth flow**: sign up → check the backend console for a logged
   verification email link (if SMTP isn't configured) → verify → log out
   → log back in → refresh the page (session should persist).
2. **Onboarding**: complete the multi-step wizard; confirm you land on
   `/dashboard` and can revisit answers from Profile → "Edit skin profile".
3. **Skin analysis**: tap the floating camera button, upload any face/skin
   photo, confirm a mock-mode (or real, if trained) prediction renders
   with severity, hydration snapshot, and guidance; check it appears in
   `/analysis` history and `/analytics`.
4. **Reports**: upload a PDF and an image; confirm both list and open.
5. **Chat**: ask a skincare question; confirm a relevant, non-diagnostic
   reply.
6. **Clinics**: grant location permission; confirm nearby results (or the
   "not configured" message if `GOOGLE_MAPS_API_KEY` is unset).
7. **Quiz**: take the seeded "Skin Health Basics" quiz; confirm scoring
   and badge award.
8. **Articles**: browse, search, filter by category, bookmark.
9. **Admin**: log in as `admin@medisense.app`, visit `/admin`, confirm
   stats/users/logs render and a non-admin user is redirected away.

## Deployment guide (outline)

- **Backend**: deploy as a standard Node service (Render/Railway/EC2/etc.)
  with `MONGO_URI` pointing at MongoDB Atlas; set `NODE_ENV=production`.
- **ML service**: deploy as a separate container (needs TensorFlow —
  budget more memory/CPU than the Node service); mount/attach the trained
  `models/skin_classifier.h5`.
- **Frontend**: `npm run build` produces a static `dist/` — deploy to
  Vercel/Netlify/S+CloudFront, with `VITE_API_URL` pointing at the
  deployed backend.
- Update `CLIENT_URL` (backend) and CORS origins (ML service) to match
  your deployed frontend domain.

## Retraining the ML model

See `ml-service/README.md` for the full guide — training script, dataset
folder layout, evaluation script, and how to add new disease classes
without touching any other code.
