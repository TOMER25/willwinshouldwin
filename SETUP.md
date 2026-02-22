# WillWin / ShouldWin — Setup Guide
## 98th Academy Awards · March 15, 2026

This guide gets you from zero to a live website in about 30-45 minutes.

---

## What You're Building

A community Oscar prediction app where users:
- Pick **Will Win** (★) and **Should Win** (♥) for all 24 categories
- See aggregate % breakdowns from the community
- Compete on a leaderboard after the ceremony

**Tech stack:** React (Vite) · Supabase (auth + database) · Vercel (hosting)
All free tiers. No credit card needed.

---

## Step 1: Set Up Supabase (your database + auth)

1. Go to **https://supabase.com** and create a free account
2. Click **"New Project"**, give it a name (e.g. `willwinshouldwin`), set a strong database password, choose a region near you
3. Wait ~2 minutes for it to spin up
4. In the left sidebar, click **"SQL Editor"**
5. Open the file `supabase_schema.sql` from this folder, copy the entire contents, paste it into the SQL Editor, and click **"Run"**
   - You should see "Success. No rows returned" — that's correct.
6. In the left sidebar, go to **"Project Settings" → "API"**
7. Copy two values:
   - **Project URL** (looks like `https://xxxx.supabase.co`) https://mwnrybbrpqlnzyrwbpbk.supabase.co
   - **anon/public key** (a long JWT string under "Project API keys") eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13bnJ5YmJycHFsbnp5cndicGJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE3ODQ2NTUsImV4cCI6MjA4NzM2MDY1NX0.ZLoshGP8UYt7PtzErHdry0NIKMhVuHVW-mQHcOfq408

---

## Step 2: Configure the App

1. In the project folder, create a new file called **`.env`** (just that, no extension)
2. Paste this into it, replacing the placeholders:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

---

## Step 3: Test Locally (optional but recommended)

If you have Node.js installed:

```bash
cd willwinshouldwin
npm install
npm run dev
```

Open http://localhost:5173 — you should see the app. Create an account and make some picks to verify everything works.

---

## Step 4: Deploy to Vercel

1. Go to **https://vercel.com** and create a free account (sign in with GitHub if you have one)
2. In your project folder, run:
   ```bash
   npm run build
   ```
   This creates a `dist/` folder.
3. Install the Vercel CLI and deploy:
   ```bash
   npm install -g vercel
   vercel
   ```
   Follow the prompts. When asked about environment variables, add:
   - `VITE_SUPABASE_URL` → your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` → your Supabase anon key

   **OR** (easier): Go to vercel.com → "Add New Project" → drag and drop your `dist/` folder.
   Then go to Project Settings → Environment Variables to add your Supabase keys, and redeploy.

4. Vercel gives you a URL like `willwinshouldwin.vercel.app` — share this with friends!

---

## Step 5: Add Your Custom Domain (optional)

If you own `willwinshouldwin.com`:
1. In Vercel, go to your project → Settings → Domains
2. Add `willwinshouldwin.com`
3. Follow the DNS instructions Vercel provides (usually just adding a CNAME record)

---

## Step 6: Enter Winners on Ceremony Night (March 15)

After each category is announced, go to your **Supabase SQL Editor** and run:

```sql
insert into winners (category_id, will_win_winner) values
  ('best_picture', 'ACTUAL WINNER HERE')
  on conflict (category_id) do update set will_win_winner = excluded.will_win_winner;
```

The leaderboard updates in real-time as you enter winners. Make sure to use the **exact nominee string** from the app (see the comment at the bottom of `supabase_schema.sql` for all category IDs).

---

## Category IDs Reference

| Category | ID |
|---|---|
| Best Picture | `best_picture` |
| Best Director | `best_director` |
| Best Actor | `best_actor` |
| Best Actress | `best_actress` |
| Best Supporting Actor | `best_supporting_actor` |
| Best Supporting Actress | `best_supporting_actress` |
| Original Screenplay | `original_screenplay` |
| Adapted Screenplay | `adapted_screenplay` |
| Cinematography | `cinematography` |
| Film Editing | `film_editing` |
| Original Score | `original_score` |
| Original Song | `original_song` |
| Animated Feature | `animated_feature` |
| International Feature | `international_feature` |
| Documentary Feature | `documentary_feature` |
| Costume Design | `costume_design` |
| Production Design | `production_design` |
| Makeup & Hairstyling | `makeup_hairstyling` |
| Sound | `sound` |
| Visual Effects | `visual_effects` |
| Casting | `casting` |
| Animated Short | `animated_short` |
| Live Action Short | `live_action_short` |
| Documentary Short | `documentary_short` |

---

## Troubleshooting

**"YOUR_SUPABASE_URL" still showing in app** → Make sure your `.env` file is in the root of the project folder (same level as `package.json`), not inside `src/`.

**Auth not working** → In Supabase → Authentication → URL Configuration, make sure your site URL is set (e.g. `http://localhost:5173` for local, or your Vercel URL for production).

**Picks not saving** → Open browser DevTools → Console and look for error messages. Usually a Supabase RLS policy issue — re-run the SQL schema.

---

## Future Ideas (for next year)

- Admin dashboard to enter winners without SQL
- Email notifications when winners are announced
- Film rating / review feature alongside picks
- Expand to Emmys, BAFTAs, etc.
- Historical year-over-year comparison

---

Built for the 98th Academy Awards. Good luck with your picks!
