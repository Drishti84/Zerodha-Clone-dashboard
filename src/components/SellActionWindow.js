import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

import axios from "axios";

import GeneralContext from "./GeneralContext";

import "./BuyActionWindow.css";

const SellActionWindow = ({ uid, currentPrice }) => {
  const { closeSellWindow } = useContext(GeneralContext);
  const [sellQty, setSellQty] = useState(1);
  const [avgBuyPrice, setAvgBuyPrice] = useState(null);
  const [maxQty, setMaxQty] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:3002/allHoldings", { withCredentials: true })
      .then((res) => {
        const holding = res.data.find(
          (h) => h.name === uid || h.stock === uid
        );
        if (holding) {
          setAvgBuyPrice(holding.avg);
          setMaxQty(holding.qty);
          setSellQty(1);
        } else {
          setError("No holdings found for " + uid);
        }
      })
      .catch(() => {
        setError("Failed to fetch holdings.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [uid]);

  const handleSellClick = () => {
    axios.post(
      "http://localhost:3002/newOrder",
      {
        name: uid,
        qty: sellQty,
        price: currentPrice,
        mode: "SELL",
      },
      { withCredentials: true }
    );
    closeSellWindow();
  };

  const handleCancelClick = () => {
    closeSellWindow();
  };

  return (
    <div className="container" id="sell-window" draggable="true">
      <div className="regular-order">
        <div className="inputs" style={{ flexDirection: "column", alignItems: "flex-start" }}>
          <div style={{ marginBottom: "12px", fontSize: "0.9rem" }}>
            <strong>{uid}</strong>
          </div>

          {loading && <p style={{ fontSize: "0.85rem", color: "#888" }}>Loading holdings...</p>}
          {error && <p style={{ fontSize: "0.85rem", color: "red" }}>{error}</p>}

          {!loading && !error && (
            <div style={{ fontSize: "0.85rem", marginBottom: "12px", color: "#444" }}>
              <span style={{ marginRight: "16px" }}>
                Avg Buy: <strong>₹{Number(avgBuyPrice).toFixed(2)}</strong>
              </span>
              <span style={{ marginRight: "16px" }}>
                Current: <strong>₹{Number(currentPrice).toFixed(2)}</strong>
              </span>
              <span>
                Owned: <strong>{maxQty} shares</strong>
              </span>
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center" }}>
            <fieldset>
              <legend>Qty. to Sell</legend>
              <input
                type="number"
                name="sellQty"
                id="sellQty"
                min={1}
                max={maxQty}
                onChange={(e) => {
                  const val = Math.min(Number(e.target.value), maxQty);
                  setSellQty(val);
                }}
                value={sellQty}
                disabled={loading || !!error}
              />
            </fieldset>
          </div>
        </div>
      </div>

      <div className="buttons">
        <span>Total: ₹{(sellQty * currentPrice).toFixed(2)}</span>
        <div>
          <Link
            className="btn"
            style={{ backgroundColor: "#e74c3c", color: "#fff" }}
            onClick={handleSellClick}
          >
            Sell
          </Link>
          <Link to="" className="btn btn-grey" onClick={handleCancelClick}>
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SellActionWindow;
