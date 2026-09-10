# 🚀 NE-Logi Mind AI — Complete Deployment Guide (SIH Hackathon)

This guide walks you through deploying both the **Frontend** and the **Python Backend** so your project is 100% accessible to SIH judges from any laptop or mobile phone.

---

## Architecture Overview
- **Frontend (React + Vite):** Deployed on **Vercel** (Free, instant global CDN, automatic SSL).
- **Backend (Python FastAPI + Scikit-Learn + WebSockets):** Deployed on **Render** or **Railway** (Free/low-cost, supports real-time WebSockets and ML models).

---

## Step 1: Deploy the Backend on Render (Free & Supports WebSockets)

1. Push your project to **GitHub** if you haven't already.
2. Go to **[Render.com](https://render.com/)** and Sign In (using your GitHub account).
3. Click **New +** → **Web Service**.
4. Select your GitHub repository (`NE_LOGI_MIND AI`).
5. Configure the service:
   - **Name:** `ne-logi-mind-backend`
   - **Region:** Singapore or Frankfurt (fastest for India)
   - **Runtime:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn server.main:app --host 0.0.0.0 --port $PORT`
   - **Plan:** Free
6. Click **Deploy Web Service**.
7. Once deployed, Render will give you a public URL like:
   `https://ne-logi-mind-backend.onrender.com`

---

## Step 2: Deploy the Frontend on Vercel

1. Go to **[Vercel.com](https://vercel.com/)** and Sign In with GitHub.
2. Click **Add New...** → **Project**.
3. Import your GitHub repository.
4. In the configuration screen:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Click **Environment Variables** and add:
   - **Key:** `VITE_BACKEND_URL`
   - **Value:** `https://ne-logi-mind-backend.onrender.com` *(use your Render URL from Step 1)*
   *(Optional: If using Supabase, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` here)*
6. Click **Deploy**.
7. Vercel will build your project in ~30 seconds and give you a live URL like:
   `https://ne-logi-mind-ai.vercel.app`

---

## Step 3: Verification Checklist for SIH Judges

- [ ] Open the live Vercel URL on your mobile phone and laptop.
- [ ] Go to **Dashboard** → Observe live vehicle route lines across North-East India.
- [ ] Go to **Driver Cockpit** → Tap the mic, speak *"Guwahati to Gangtok"*, and verify voice navigation + ML risk announcement.
- [ ] Go to **Digital Twin Simulation** → Switch between drivers (Biren Das, Luwang Singh, etc.) and run hazard stress-tests.
- [ ] Go to **Live Telematics** → Confirm real-time WebSocket connection pulse is Green.
