# MediSense Frontend

React + TypeScript + Vite + Tailwind CSS single-page app.

## Setup

```bash
cd frontend
cp .env.example .env    # set VITE_API_URL, VITE_GOOGLE_CLIENT_ID, VITE_GOOGLE_MAPS_API_KEY
npm install
npm run dev              # http://localhost:5173
```

Requires the backend (`../backend`) running on the URL set in `VITE_API_URL`
(default `http://localhost:5000/api`), and ideally the ML service too so
skin analysis returns real (or mock-mode) predictions.

## Structure

```
src/
  components/
    layout/       Sidebar, Topbar, DashboardLayout, AuthLayout, PublicNavbar, Footer
    analysis/      FloatingCameraButton, UploadAnalysisModal, AnalysisResultCard, SeverityBadge
    ui/            ThemeToggle, FullScreenLoader
    ProtectedRoute.tsx
  contexts/        AuthContext (persistent login, refresh), ThemeContext (dark/light)
  hooks/           React Query hooks per domain (analysis, reports, chat, quiz, articles, clinics, admin, user)
  pages/           One folder per feature area (Landing, Auth, Onboarding, Dashboard, Analysis,
                    Chat, Reports, Clinics, Quiz, Articles, Analytics, Profile, Admin)
  services/api.ts  Axios client with in-memory access token + automatic refresh-on-401
  types/           Shared TypeScript interfaces matching the backend API shapes
```

## Design system

Tailwind tokens are defined in `tailwind.config.js` under a "Dawn
Dermatology" palette (clay/rose, teal, lavender) with `Fraunces` for
display type and `Inter` for body text — see `src/index.css` for the
reusable `.glass-card`, `.btn-primary/secondary/teal`, `.input-field`, and
`.badge-*` utility classes used throughout.

## Notes

- Access tokens are kept in memory only (never localStorage) to reduce XSS
  exposure; the refresh token lives in an httpOnly cookie set by the backend.
- Google Sign-In uses `@react-oauth/google`'s `GoogleLogin` component,
  which returns an ID token directly — no server-side auth-code exchange
  needed for this flow.
- The Articles page renders a minimal built-in markdown-to-JSX parser
  (`## headers` + paragraphs) rather than pulling in a markdown dependency,
  since article content is authored by admins in a known, simple format.
