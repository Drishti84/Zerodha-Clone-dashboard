import React, { useState, useContext, useEffect } from "react";

import axios from "axios";

import GeneralContext from "./GeneralContext";

import { Tooltip, Grow } from "@mui/material";

import {
  BarChartOutlined,
  KeyboardArrowDown,
  KeyboardArrowUp,
  MoreHoriz,
} from "@mui/icons-material";

import { watchlist } from "../data/data";

// Module-level alert store: { [stockName]: targetPrice }
const alerts = {};

const WatchList = () => {
  const [liveQuotes, setLiveQuotes] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const symbols = watchlist.map((stock) => stock.name).join(",");

    const fetchQuotes = () => {
      axios
        .get(`http://localhost:3002/quotes?symbols=${encodeURIComponent(symbols)}`)
        .then((res) => {
          const quotesByName = {};
          res.data.forEach((quote) => {
            if (!quote.error) {
              quotesByName[quote.name] = quote;
            }
          });
          setLiveQuotes(quotesByName);

          // Check module-level alerts against fresh quotes
          Object.keys(alerts).forEach((name) => {
            const quote = quotesByName[name];
            if (quote && quote.price >= alerts[name]) {
              window.alert(`🔔 Alert: ${name} has reached ₹${quote.price}`);
              delete alerts[name];
            }
          });
        })
        .catch(() => {});
    };

    fetchQuotes();
    const interval = setInterval(fetchQuotes, 15000);
    return () => clearInterval(interval);
  }, []);

  const mergedWatchlist = watchlist.map((stock) => ({
    ...stock,
    ...liveQuotes[stock.name],
  }));

  const filteredWatchlist = mergedWatchlist.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="watchlist-container">
      <div style={{ padding: "8px 10px", borderBottom: "1px solid #f0f0f0", background: "#fff", position: "relative", zIndex: 10 }}>
        <input
          type="text"
          name="search"
          id="search"
          placeholder="Search e.g. INFY, TCS, RELIANCE..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={(e) => (e.target.style.borderColor = "#387ed1")}
          onBlur={(e) => (e.target.style.borderColor = "#ddd")}
          style={{
            width: "100%",
            height: "34px",
            padding: "0 10px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            fontSize: "0.82rem",
            boxSizing: "border-box",
            outline: "none",
            cursor: "text",
            color: "#333",
            background: "#fff",
            display: "block",
            position: "relative",
            zIndex: 10,
          }}
        />
        <span style={{ display: "block", textAlign: "right", fontSize: "0.72rem", color: "#aaa", marginTop: "3px" }}>
          {filteredWatchlist.length} / 50
        </span>
      </div>

      <ul className="list" style={{ margin: 0, paddingBottom: 0 }}>
        {filteredWatchlist.map((stock, index) => {
          return <WatchListItem stock={stock} key={index} />;
        })}
      </ul>

    </div>
  );
};

export default WatchList;

const WatchListItem = ({ stock }) => {
  const [showWatchlistActions, setShowWatchlistActions] = useState(false);

  const handleMouseEnter = (e) => {
    setShowWatchlistActions(true);
  };

  const handleMouseLeave = (e) => {
    setShowWatchlistActions(false);
  };

  return (
    <li onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div className="item">
        <p className={stock.isDown ? "down" : "up"}>{stock.name}</p>
        <div className="itemInfo">
          <span className="percent">{stock.percent}</span>
          {stock.isDown ? (
            <KeyboardArrowDown className="down" />
          ) : (
            <KeyboardArrowUp className="down" />
          )}
          <span className="price">{Number(stock.price).toFixed(2)}</span>
        </div>
      </div>
      {showWatchlistActions && <WatchListActions uid={stock.name} price={stock.price} />}
    </li>
  );
};

const WatchListActions = ({ uid, price }) => {
  const generalContext = useContext(GeneralContext);
  const [showMore, setShowMore] = useState(false);

  const handleBuyClick = () => {
    generalContext.openBuyWindow(uid, price);
  };

  const handleSellClick = () => {
    generalContext.openSellWindow(uid, price);
  };

  const handleAnalyticsClick = () => {
    generalContext.openAnalyticsWindow(uid);
  };

  return (
    <span className="actions" style={{ position: "relative" }}>
      <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        <Tooltip
          title="Buy (B)"
          placement="top"
          arrow
          TransitionComponent={Grow}
          onClick={handleBuyClick}
        >
          <button className="buy">Buy</button>
        </Tooltip>
        <Tooltip
          title="Sell (S)"
          placement="top"
          arrow
          TransitionComponent={Grow}
          onClick={handleSellClick}
        >
          <button className="sell">Sell</button>
        </Tooltip>
        <Tooltip
          title="Analytics (A)"
          placement="top"
          arrow
          TransitionComponent={Grow}
          onClick={handleAnalyticsClick}
        >
          <button className="action">
            <BarChartOutlined className="icon" />
          </button>
        </Tooltip>
        <Tooltip title="More" placement="top" arrow TransitionComponent={Grow}>
          <button className="action" onClick={() => setShowMore((v) => !v)}>
            <MoreHoriz className="icon" />
          </button>
        </Tooltip>
      </span>
      {showMore && (
        <div style={{
          position: "absolute", right: 0, top: "100%", background: "#fff",
          border: "1px solid #e0e0e0", borderRadius: "6px", zIndex: 999,
          boxShadow: "0 4px 12px rgba(0,0,0,0.12)", minWidth: "170px",
        }}>
          {[
            {
              label: "Create Alert",
              icon: "🔔",
              onClick: () => {
                setShowMore(false);
                const input = window.prompt(`Set alert for ${uid} at price (₹):`);
                if (input !== null) {
                  const targetPrice = parseFloat(input);
                  if (!isNaN(targetPrice)) {
                    alerts[uid] = targetPrice;
                  }
                }
              },
            },
            {
              label: "View Fundamentals",
              icon: "📊",
              onClick: () => {
                setShowMore(false);
                generalContext.openFundamentalsWindow(uid);
              },
            },
            {
              label: "Open on NSE",
              icon: "🔗",
              onClick: () => {
                setShowMore(false);
                window.open(
                  "https://www.nseindia.com/get-quotes/equity?symbol=" + uid,
                  "_blank"
                );
              },
            },
            {
              label: "Stock News",
              icon: "📰",
              onClick: () => {
                setShowMore(false);
                window.open(
                  "https://economictimes.indiatimes.com/topic/" + uid,
                  "_blank"
                );
              },
            },
          ].map((item) => (
            <div
              key={item.label}
              onClick={item.onClick}
              style={{
                padding: "9px 14px", cursor: "pointer", fontSize: "0.82rem",
                color: "#333", display: "flex", alignItems: "center", gap: "8px",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#f5f5f5")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <span>{item.icon}</span> {item.label}
            </div>
          ))}
        </div>
      )}
    </span>
  );
};