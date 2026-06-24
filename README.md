# Zerodha Clone — Dashboard

Trading dashboard app for the Zerodha clone project. Separately deployed from the marketing frontend — authentication is passed via a JWT token in the URL on first load.

**Live:** https://zerodha-clone-dashboard-312i.onrender.com

---

## Features

- **Live Watchlist** — 35 NSE stocks with prices refreshed every 15 seconds
- **Search** — filter the watchlist by stock symbol in real time
- **Buy / Sell windows** — place orders directly from the watchlist hover actions
- **Analytics window** — price chart and analytics for any stock
- **Fundamentals window** — key fundamental data per stock
- **Portfolio Summary** — total invested, current value, overall P&L
- **Orders** — full history of buy/sell transactions
- **Holdings** — long-term positions with avg cost, current value, and P&L; doughnut chart breakdown
- **Positions** — intraday trades with net quantity and buy/sell split
- **Funds** — available cash balance with Add Funds / Withdraw
- **Onboarding tour** — guided 11-step walkthrough for first-time users (per-user, won't repeat)
- **Demo seed** — sample holdings, orders, and balance are auto-seeded on first visit so the dashboard is never empty

---

## Tech Stack

- **React 18** with React Router v6
- **Axios** for API calls
- **Chart.js / react-chartjs-2** — doughnut chart in Holdings
- **ApexCharts / react-apexcharts** — stock price charts
- **MUI (Material UI)** — icon components
- **react-joyride** — onboarding tour
- Create React App build toolchain

---

## Auth Flow

Cross-domain cookies don't work reliably between separately deployed Render services, so authentication uses a JWT relay:

1. User logs into the frontend → JWT stored in `localStorage`
2. Clicking "Dashboard" in the frontend navbar opens `dashboard-url?token=<jwt>`
3. `src/index.js` reads the token from the URL, moves it to `sessionStorage`, and strips it from the address bar
4. Every axios request includes `Authorization: Bearer <token>` via `axios.defaults.headers.common`

---

## Project Structure

```
src/
├── config.js                      # BACKEND_URL (env var or auto-detect)
├── index.js                       # JWT relay — reads ?token from URL
├── data/
│   └── data.js                    # Static watchlist/holdings/positions seed data
└── components/
    ├── Home.js                     # Root layout (TopBar + Dashboard)
    ├── TopBar.js / Menu.js         # Navigation bar
    ├── Dashboard.js                # Main layout, route definitions, demo seed trigger
    ├── WatchList.js                # Live watchlist sidebar
    ├── GeneralContext.js           # Context for Buy/Sell/Analytics windows
    ├── BuyActionWindow.js
    ├── SellActionWindow.js
    ├── AnalyticsWindow.js
    ├── FundamentalsWindow.js
    ├── Summary.js                  # Dashboard/portfolio overview
    ├── Orders.js
    ├── Holdings.js
    ├── Positions.js
    ├── Funds.js
    ├── Apps.js
    ├── DoughnoutChart.js           # Holdings pie chart
    ├── VerticalGraph.js            # Bar graph component
    └── Tour.js                     # react-joyride onboarding tour
public/
└── _redirects                      # SPA routing for Render Static Site
```

---

## Local Development

```bash
npm install
npm start          # http://localhost:3001
```

Requires the backend running at `http://localhost:3002` (or set `REACT_APP_BACKEND_URL`).

To test the JWT relay locally, log in via the frontend at `http://localhost:3000` and click Dashboard — it will append the token automatically.

---

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `REACT_APP_BACKEND_URL` | `https://backend-p8j1.onrender.com` (prod) / `http://localhost:3002` (dev) | Backend API base URL |

---

## Deployment (Render Static Site)

| Setting | Value |
|---|---|
| Build Command | `npm install && npm run build` |
| Publish Directory | `build` |

SPA routing is handled by `public/_redirects`:
```
/* /index.html 200
```

---

## Onboarding Tour

The tour runs automatically for each new user. It is tracked per-user in `localStorage` using a key derived from the JWT payload (`zerodha_tour_done_<userId>`), so it won't re-run on subsequent visits and won't be blocked by another account's tour history.

To replay the tour, open DevTools → Application → Local Storage and delete the `zerodha_tour_done_*` key for your user.

---

## Related Repos

- [Backend](https://github.com/Drishti84/Zerodha-Clone-backend) — Express + MongoDB API
- [Frontend](https://github.com/Drishti84/Zerodha-Clone-frontend) — Marketing & auth site
