import React, { useState, useEffect } from "react";
import Joyride, { ACTIONS, EVENTS, STATUS } from "react-joyride";
import { useNavigate } from "react-router-dom";

function getTourKey() {
  try {
    const token = sessionStorage.getItem("authToken");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const uid = payload.id || payload.sub || "anon";
      return `zerodha_tour_done_${uid}`;
    }
  } catch {}
  return "zerodha_tour_done_anon";
}

const steps = [
  {
    target: "body",
    placement: "center",
    disableBeacon: true,
    content: (
      <div style={{ textAlign: "center", padding: "8px 0" }}>
        <div style={{ fontSize: "2rem", marginBottom: 8 }}>👋</div>
        <h3 style={{ color: "#387ed1", margin: "0 0 10px" }}>Welcome to Zerodha Dashboard</h3>
        <p style={{ color: "#555", margin: 0, fontSize: "0.9rem" }}>
          Let's take a quick tour of all the features. You can skip anytime.
        </p>
      </div>
    ),
  },
  {
    target: ".watchlist-container",
    title: "Live Watchlist",
    placement: "right",
    disableBeacon: true,
    content:
      "Your Watchlist shows live prices for 35 NSE stocks, refreshed automatically every 15 seconds. Scroll to see all stocks.",
  },
  {
    target: "#search",
    title: "Search Stocks",
    placement: "right",
    disableBeacon: true,
    spotlightClicks: true,
    content:
      "Type any stock symbol to filter the list instantly — try INFY, RELIANCE, or BAJFINANCE.",
  },
  {
    target: ".list li:first-child",
    title: "Hover to Trade",
    placement: "right",
    disableBeacon: true,
    spotlightClicks: true,
    content: (
      <div>
        <p style={{ margin: "0 0 8px" }}>
          <strong>Hover over any stock row</strong> to reveal quick action buttons:
        </p>
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: "0.85rem", color: "#555" }}>
          <li><strong style={{ color: "#387ed1" }}>Buy</strong> — place a buy order</li>
          <li><strong style={{ color: "#c84040" }}>Sell</strong> — place a sell order</li>
          <li><strong>📊</strong> — view price chart &amp; analytics</li>
          <li><strong>•••</strong> — set alerts, view fundamentals, open NSE</li>
        </ul>
        <p style={{ margin: "8px 0 0", fontSize: "0.8rem", color: "#888" }}>
          Try it now — hover on a stock above!
        </p>
      </div>
    ),
  },
  {
    target: "body",
    placement: "center",
    title: "Portfolio Summary",
    disableBeacon: true,
    content:
      "Your Dashboard shows a complete portfolio overview — total invested, current market value, overall P&L, and number of holdings.",
  },
  {
    target: "body",
    placement: "center",
    title: "Orders",
    disableBeacon: true,
    content:
      "Orders shows every buy and sell transaction you've placed — stock name, quantity, price, and date.",
  },
  {
    target: "body",
    placement: "center",
    title: "Holdings",
    disableBeacon: true,
    content:
      "Holdings shows all your long-term stock positions with avg cost, current value, and individual P&L. A chart at the bottom visualises your portfolio split.",
  },
  {
    target: "body",
    placement: "center",
    title: "Positions",
    disableBeacon: true,
    content:
      "Positions tracks today's intraday trades, grouped by stock with net quantity and buy/sell breakdown.",
  },
  {
    target: "body",
    placement: "center",
    title: "Funds",
    disableBeacon: true,
    content:
      "Funds shows your available cash balance. Use Add Funds or Withdraw to manage your trading capital.",
  },
  {
    target: ".topbar-container",
    title: "Navigation",
    placement: "bottom",
    disableBeacon: true,
    content:
      "Use the top menu to jump between Dashboard, Orders, Holdings, Positions, Funds, and Apps. Click the Zerodha logo to return to the main site.",
  },
  {
    target: "body",
    placement: "center",
    disableBeacon: true,
    content: (
      <div style={{ textAlign: "center", padding: "8px 0" }}>
        <div style={{ fontSize: "2rem", marginBottom: 8 }}>🚀</div>
        <h3 style={{ color: "#387ed1", margin: "0 0 10px" }}>You're all set!</h3>
        <p style={{ color: "#555", margin: 0, fontSize: "0.9rem" }}>
          Hover on any watchlist stock to trade, or use the menu to explore your portfolio.
        </p>
      </div>
    ),
  },
];

// Navigate before showing this step index
const NAV_BEFORE_STEP = {
  4: "/",
  5: "/orders",
  6: "/holdings",
  7: "/positions",
  8: "/funds",
  9: "/",
};

const Tour = () => {
  const [run, setRun] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem(getTourKey())) {
      setTimeout(() => setRun(true), 1200);
    }
  }, []);

  const handleCallback = (data) => {
    const { action, index, status, type } = data;

    if (type === EVENTS.STEP_AFTER && action === ACTIONS.NEXT) {
      const next = index + 1;
      if (NAV_BEFORE_STEP[next]) {
        navigate(NAV_BEFORE_STEP[next]);
      }
    }

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      localStorage.setItem(getTourKey(), "true");
      navigate("/");
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      showSkipButton
      showProgress
      scrollToFirstStep
      disableOverlayClose
      callback={handleCallback}
      styles={{
        options: {
          primaryColor: "#387ed1",
          zIndex: 10000,
          arrowColor: "#fff",
          backgroundColor: "#fff",
          overlayColor: "rgba(0,0,0,0.12)",
          textColor: "#333",
        },
        tooltip: {
          borderRadius: 8,
          boxShadow: "0 4px 20px rgba(0,0,0,0.18)",
          padding: "16px 20px",
        },
        tooltipTitle: {
          color: "#387ed1",
          fontWeight: 700,
          fontSize: "0.95rem",
          marginBottom: 6,
        },
        tooltipContent: {
          fontSize: "0.87rem",
          lineHeight: 1.6,
          padding: "4px 0 8px",
        },
        buttonNext: {
          backgroundColor: "#387ed1",
          borderRadius: 4,
          fontSize: "0.85rem",
          padding: "7px 16px",
        },
        buttonBack: {
          color: "#387ed1",
          fontSize: "0.85rem",
        },
        buttonSkip: {
          color: "#aaa",
          fontSize: "0.82rem",
        },
        spotlight: {
          borderRadius: 6,
          border: "2px solid #387ed1",
          boxShadow: "0 0 0 4px rgba(56,126,209,0.15)",
        },
      }}
    />
  );
};

export default Tour;
