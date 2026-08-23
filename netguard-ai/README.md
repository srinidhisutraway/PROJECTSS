# 🛡️ NetGuard AI — Intelligent Network Intrusion Detection & Real-Time Monitoring System

> **Intelligent protection. Real-time visibility.**

NetGuard AI is a full-stack cybersecurity platform built as a Computer Science capstone
project. It demonstrates network monitoring, intrusion detection, machine-learning-based
traffic classification, real-time alerting, and security analytics in a bright, modern,
SaaS-style dashboard — not the usual dark hacker-terminal aesthetic.

**⚠️ Scope & intent:** This project is built for **authorized lab/demo environments only**.
It ships with a **Demo Mode** that simulates realistic network traffic and attacks so the
full pipeline can be presented without needing real infrastructure or packet capture. It
contains no functionality intended to attack, exploit, or disrupt third-party systems.

---

## Table of Contents

1. [Features](#features)
2. [Architecture](#architecture)
3. [Tech Stack](#tech-stack)
4. [Folder Structure](#folder-structure)
5. [Installation](#installation)
6. [Environment Variables](#environment-variables)
7. [Database Setup](#database-setup)
8. [Running the Frontend](#running-the-frontend)
9. [Running the Backend](#running-the-backend)
10. [Running the ML Service](#running-the-ml-service)
11. [Demo Mode vs. Real Data](#demo-mode-vs-real-data)
12. [Screenshots](#screenshots)
13. [Future Improvements](#future-improvements)

---

## Features

- 🔐 **Authentication** — signup, login, forgot/reset password, JWT, protected routes
- 📊 **Dashboard** — security overview cards, network security score, real-time monitoring
- 📡 **Network Monitor** — live incoming/outgoing traffic, packets/sec, bandwidth, connections
- 📈 **Traffic Analytics** — protocol distribution, top IPs/ports, filterable time ranges
- 🚨 **Intrusion Detection** — Port Scan, Brute Force, DoS, Suspicious Connection, Abnormal
  Traffic, Unauthorized Access, Malware-like Activity — with severity & confidence
- 🧠 **AI/ML Detection** — Random Forest-based classifier (demo metrics included), live
  prediction playground (NORMAL / SUSPICIOUS / ATTACK + confidence)
- 🔔 **Alerts Center** — filterable alert list, alert detail with "why was this detected"
  and recommended action, resolve/investigate workflow
- 💻 **Devices** — connected device inventory with status & risk level
- 🔎 **IP Analysis** — investigate any IP: risk score, traffic history, associated ports
- 🧾 **Security Logs** — searchable, sortable, paginated, CSV export
- 📄 **Reports** — generate & download security reports
- 👤 **Profile & Settings** — account, notifications, security (2FA UI, sessions), appearance
- ⚡ **Demo Mode** — "Simulate Threat" button drives the full pipeline: event → detection →
  alert → dashboard update → notification, live over Socket.IO (or purely client-side if no
  backend is running)
- 📱 **Responsive** — proper layouts for desktop, tablet, and mobile, not just scaled-down

---

## Architecture

```
Network Monitor
   -> Packet/Flow Collector      (services/demoGenerator.js — swap for real capture later)
      -> Feature Extractor       (ml-service/preprocessing/feature_extractor.py)
         -> Detection Engine     (backend/services/detectionEngine.js + ML service)
            -> Risk Scoring      (severity/confidence calculation)
               -> Alert Service  (Alert model + Socket.IO broadcast)
                  -> Database    (MongoDB)
                     -> WebSocket (Socket.IO)
                        -> Dashboard (React)
```

The pipeline is modular by design: **`detectionEngine.processFlow()`** is the single
integration point. A real packet-capture/NetFlow collector can call it directly with the
same flow shape the demo generator produces, and nothing else in the stack needs to change.

---

## Tech Stack

**Frontend:** React 18, Vite, Tailwind CSS, React Router, Recharts, Lucide Icons, Socket.IO client
**Backend:** Node.js, Express, MongoDB (Mongoose), Socket.IO, JWT, bcrypt
**ML Service:** Python, Flask, scikit-learn (Random Forest reference implementation)

---

## Folder Structure

```
netguard-ai/
├── frontend/
│   ├── src/
│   │   ├── components/   (layout, ui, charts — all reusable)
│   │   ├── context/      (AuthContext, SocketContext)
│   │   ├── pages/         (one file per route)
│   │   └── services/      (api.js, mockData.js, demoEngine.js)
│   └── ...
├── backend/
│   ├── controllers/
│   ├── models/            (User, Alert, NetworkEvent, Device, Log, Report)
│   ├── routes/
│   ├── middleware/         (auth, error handling)
│   ├── services/            (demoGenerator, detectionEngine, socketService, mlClient)
│   ├── scripts/seed.js
│   └── server.js
└── ml-service/
    ├── model/               (place trained .joblib here)
    ├── preprocessing/       (feature_extractor.py)
    ├── prediction/          (predict.py — real model or rule-based mock)
    ├── training/            (train.py reference script)
    └── app.py
```

---

## Installation

```bash
git clone <this-repo>
cd netguard-ai
```

You'll set up three parts: **frontend**, **backend**, and (optionally) **ml-service**.
The frontend and backend can each run in Demo Mode without the others — see below.

---

## Environment Variables

**backend/.env** (copy from `backend/.env.example`)
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/netguard_ai
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:5173
ML_SERVICE_URL=http://localhost:8000
```

**frontend/.env** (copy from `frontend/.env.example`)
```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

---

## Database Setup

1. Install MongoDB locally, or use MongoDB Atlas and put the connection string in `MONGO_URI`.
2. From `backend/`, seed demo data:
   ```bash
   npm install
   npm run seed
   ```
   This creates a demo user (`demo@netguard.ai` / `Demo@1234`), sample devices, alerts, and logs.

---

## Running the Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```
Visit `http://localhost:5173`. **Works standalone** — if the backend isn't running, the app
automatically falls back to client-side Demo Mode (see below) so you can still explore
every page and trigger simulated threats.

---

## Running the Backend

```bash
cd backend
npm install
cp .env.example .env   # then edit MONGO_URI / JWT_SECRET
npm run seed            # optional but recommended
npm run dev
```
API runs at `http://localhost:5000`, Socket.IO on the same port, and the server starts
emitting simulated network traffic immediately (see `services/demoGenerator.js`).

---

## Running the ML Service

```bash
cd ml-service
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```
Runs at `http://localhost:8000`. Without a trained model present, `/predict` uses a
clearly-labeled rule-based mock so the backend's `/api/events/predict` route (and the
**AI Detection** page) work immediately. To use a real model:
```bash
python training/train.py --data path/to/your_dataset.csv
```
This writes `model/netguard_model.joblib` + `model/metrics.json`, picked up automatically
on the next `python app.py` run.

---

## Demo Mode vs. Real Data

This project clearly separates **simulated/demo data** from **real network data** at every layer:

| Layer | Demo behavior | To go live |
|---|---|---|
| Frontend real-time feed | `services/demoEngine.js` simulates stats/events client-side if no Socket.IO connection succeeds | Run the backend; `SocketContext` auto-connects and switches the UI badge to `LIVE` |
| Backend traffic source | `services/demoGenerator.js` emits synthetic flows on an interval | Replace its interval loop with a real packet-capture/NetFlow collector that calls `detectionEngine.processFlow()` |
| ML predictions | Rule-based mock in `ml-service/prediction/predict.py`, or Node mock in `backend/services/mlClient.js` if ml-service is unreachable | Train a model with `training/train.py` and drop it in `model/` |
| Model metrics shown in-app | Explicitly labeled as demo/offline evaluation values | Retrain and the real `accuracy/precision/recall/f1Score` from `metrics.json` will be served |

The UI always shows whether it's in **LIVE** or **DEMO SIMULATION** mode via a badge in the
top bar, so nobody mistakes simulated data for real traffic.

---

## Screenshots

_Add screenshots of the Landing page, Dashboard, Intrusion Detection, and Alert Detail here
before submitting/presenting the project._

---

## Future Improvements

- Real packet capture integration (e.g. libpcap bindings or NetFlow/sFlow ingestion)
- Persistent WebSocket auth (per-user rooms, so alerts are scoped to a user's own network)
- Real email delivery for the forgot-password flow (currently returns a dev code)
- Real OAuth (Google sign-in is currently a UI placeholder)
- Threat-intelligence API integration for IP Analysis (currently demo/local scoring)
- Dark mode implementation (UI toggle exists; theme not yet wired)
- Automated tests (unit + integration) for backend routes and detection logic
- Role-based access control (Admin vs Analyst vs Viewer)
- PDF report generation (Reports page currently exports plain text)

---

## Security Disclaimer

This project is intended for **authorized lab, training, and demonstration environments
only**. It does not include any offensive/exploitation tooling. All simulated attacks are
generated locally for demo purposes and never sent to real hosts.

## License

Built for educational purposes as a college capstone project.
