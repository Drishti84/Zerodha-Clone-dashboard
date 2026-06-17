import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import GeneralContext from "./GeneralContext";
import BACKEND_URL from "../config";

const FundamentalsWindow = ({ uid }) => {
  const { closeFundamentalsWindow } = useContext(GeneralContext);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    axios
      .get(`${BACKEND_URL}/fundamentals?symbol=${encodeURIComponent(uid)}`)
      .then((res) => {
        if (res.data.error) {
          setError(res.data.error);
        } else {
          setData(res.data);
        }
      })
      .catch(() => setError("Failed to fetch fundamentals."))
      .finally(() => setLoading(false));
  }, [uid]);

  const changePercent = data ? data.changePercent : 0;

  const fields = data
    ? [
        { label: "Company", value: data.longName },
        {
          label: "Price",
          value: `₹${Number(data.price).toFixed(2)}`,
        },
        {
          label: "Day Change",
          value: `${changePercent >= 0 ? "+" : ""}${Number(changePercent).toFixed(2)}%`,
          style: { color: changePercent >= 0 ? "#26a69a" : "#ef5350", fontWeight: 600 },
        },
        {
          label: "Market Cap",
          value: data.marketCap
            ? `₹${(data.marketCap / 10000000).toFixed(0)} Cr`
            : "N/A",
        },
        {
          label: "P/E Ratio",
          value: data.pe ? Number(data.pe).toFixed(1) : "N/A",
        },
        {
          label: "52W High",
          value: data.fiftyTwoWeekHigh ? `₹${Number(data.fiftyTwoWeekHigh).toFixed(2)}` : "N/A",
        },
        {
          label: "52W Low",
          value: data.fiftyTwoWeekLow ? `₹${Number(data.fiftyTwoWeekLow).toFixed(2)}` : "N/A",
        },
        {
          label: "Volume",
          value: data.volume ? Number(data.volume).toLocaleString("en-IN") : "N/A",
        },
        {
          label: "Avg Volume",
          value: data.avgVolume ? Number(data.avgVolume).toLocaleString("en-IN") : "N/A",
        },
        {
          label: "Dividend Yield",
          value: data.dividendYield
            ? `${(Number(data.dividendYield) * 100).toFixed(2)}%`
            : "N/A",
        },
      ]
    : [];

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        background: "#fff",
        borderRadius: "8px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.22)",
        zIndex: 9999,
        width: "500px",
        padding: "24px",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <span style={{ fontWeight: 700, fontSize: "1.05rem", color: "#333" }}>
          {uid} — Fundamentals
        </span>
        <button
          onClick={closeFundamentalsWindow}
          style={{
            background: "none",
            border: "none",
            fontSize: "1.3rem",
            cursor: "pointer",
            color: "#888",
          }}
        >
          ✕
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: "center", padding: "48px 0", color: "#888" }}>
          Loading fundamentals...
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div style={{ textAlign: "center", padding: "48px 0", color: "#e74c3c" }}>
          {error}
        </div>
      )}

      {/* Data grid */}
      {!loading && !error && data && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px 24px",
          }}
        >
          {fields.map((field) => (
            <div key={field.label}>
              <div
                style={{
                  fontSize: "0.74rem",
                  color: "#888",
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  marginBottom: "2px",
                }}
              >
                {field.label}
              </div>
              <div
                style={{
                  fontSize: "0.92rem",
                  color: "#333",
                  fontWeight: 500,
                  ...(field.style || {}),
                }}
              >
                {field.value}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FundamentalsWindow;
