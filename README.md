# Librarian AI — Meeting Divergence Detector

Detects every conversation point that got sidelined during a meeting, surfaces them with context and priority, and sends a digest to the meeting host.

## Architecture

```
User (paste/upload transcript)
        ↓
  React Frontend (Vite + Tailwind)
        ↓  POST /api/analyze
  Express API (Node.js + Multer + Mongoose)
       ↙                    ↘
Groq AI (Llama-3)        MongoDB Atlas
(detects diversions)     (stores analyses)
        ↓
  Nodemailer
  (HTML digest email → host inbox)
```

## Stack (100% Free Tier)

| Service | Free Tier |
|---|---|
| **Groq AI** | Free API — Llama-3 8B (fast, generous limits) |
| **MongoDB Atlas** | Free M0 cluster (512MB) |
| **Gmail SMTP** | Free via App Password |
| **Vite + React** | Open source |
| **Express + Node** | Open source |

---

## Setup

### 1. Clone / unzip the project

```
librarian-ai/
├── backend/
└── frontend/
```

### 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/librarian-ai
GROQ_API_KEY=gsk_xxxxxxxxxxxxx
EMAIL_USER=yourgmail@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx   # Gmail App Password (not your login password)
HOST_EMAIL=meetinghost@company.com
```

**Getting credentials:**

- **Groq API key**: https://console.groq.com → Create API Key (free)
- **MongoDB Atlas**: https://cloud.mongodb.com → Create free M0 cluster → Get connection string
- **Gmail App Password**: Google Account → Security → 2-Step Verification → App Passwords → Generate one for "Mail"

```bash
npm run dev   # starts on port 5000
```

### 3. Frontend setup

```bash
cd frontend
npm install
npm run dev   # starts on port 5173
```

Open http://localhost:5173

---

## How It Works

1. **Paste or upload** a meeting transcript (.txt)
2. **Groq Llama-3** analyses for diverged threads — moments where a point was raised but conversation moved on without resolution
3. Results are **saved to MongoDB** with priority classification (Critical / High / Medium / Low)
4. A **beautiful HTML digest email** is sent to the meeting host with all threads, trigger context, and suggested actions
5. The **Review & Action Center** lets you mark threads as Follow Up, Deferred, or Resolved

---

## Transcript Format

Any plain text works. Named speaker format is easiest for the AI:

```
Alex: Good morning. Let's start with Q4 priorities...
Jordan: Right, speaking of resources, I saw a report about the office chairs...
Alex: Let's keep cafeteria logistics out of this sync. What's the SSO status?
Elena: Core module is finished, we're in testing...
```

You can also paste raw Zoom/Meet transcripts — the AI handles them.

---

## Deployment (free options)

| Service | What |
|---|---|
| **Railway / Render** | Deploy Express backend (free tier) |
| **Vercel / Netlify** | Deploy React frontend (free) |
| **MongoDB Atlas** | Already cloud |

Set `VITE_API_URL=https://your-backend.railway.app` in frontend `.env` and update `vite.config.js` proxy accordingly.

---

## Priority Colours

| Priority | Meaning |
|---|---|
| 🔴 Critical | Blocks current work or has deadline implications |
| 🟠 High | Important, needs attention soon |
| 🟡 Medium | Address in next cycle |
| 🟢 Low | Can be deferred |
