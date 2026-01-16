# How to Keep Your Free Render Backend "Fast" (Awake)

Render's free tier spins down (sleeps) your backend service after 15 minutes of inactivity. When a user visits your site after it sleeps, it can take 50+ seconds to wake up (Cold Start).

To prevent this and ensure "high speed" availability on the free tier, you can use a free uptime monitor to ping your service periodically.

## Step 1: Deploy Your App
1. Ensure your changes are pushed to GitHub.
2. Go to Render Dashboard -> Blueprints.
3. Create a new Blueprint Instance connected to your repo.
4. This will deploy both your Frontend (Static Site) and Backend (Web Service).

## Step 2: Get Your Backend URL
Once deployed, find the URL of your **Backend Service** (e.g., `https://trade-only-api.onrender.com`).

## Step 3: Set Up a "Pinger"
Use a free service to hit your new `/ping` endpoint every 10-14 minutes.

### Option A: Cron-Job.org (Recommended)
1. Sign up for free at [cron-job.org](https://cron-job.org/).
2. Create a new cron job.
3. **URL:** `https://your-backend-url.onrender.com/ping` (Replace with your actual backend URL).
4. **Execution Schedule:** Every 14 minutes.
5. Save.

### Option B: UptimeRobot
1. Sign up at [uptimerobot.com](https://uptimerobot.com/).
2. Add a new monitor.
3. Type: HTTP(s).
4. URL: `https://your-backend-url.onrender.com/ping`.
5. Interval: 5 minutes.

## Important Note
This technique keeps your service running, which consumes your free monthly hours (750 hours/month).
- If you run only ONE backend service, 750 hours is enough for 24/7 uptime (24 * 31 = 744 hours).
- If you have multiple services, you might run out of free hours.
