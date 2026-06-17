import React, { useState, useEffect, useContext } from "react";
import ReactApexChart from "react-apexcharts";
import axios from "axios";
import GeneralContext from "./GeneralContext";
import "./BuyActionWindow.css";

const PERIODS = [
  { label: "1M", value: "1mo" },
  { label: "3M", value: "3mo" },
  { label: "6M", value: "6mo" },
  { label: "1Y", value: "1y" },
];

const AnalyticsWindow = ({ uid }) => {
  const { closeAnalyticsWindow } = useContext(GeneralContext);
  const [period, setPeriod] = useState("1mo");
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    axios
      .get(`http://localhost:3002/historical?symbol=${encodeURIComponent(uid)}&period=${period}`)
      .then((res) => {
        if (res.data.error) {
          setError(res.data.error);
          return;
        }
        const candles = res.data.map((d) => ({
          x: new Date(d.date),
          y: [
            Number(d.open.toFixed(2)),
            Number(d.high.toFixed(2)),
            Number(d.low.toFixed(2)),
            Number(d.close.toFixed(2)),
          ],
        }));
        setSeries([{ name: uid, data: candles }]);
      })
      .catch(() => setError("Failed to load chart data."))
      .finally(() => setLoading(false));
  }, [uid, period]);

  const options = {
    chart: {
      type: "candlestick",
      toolbar: { show: false },
      background: "#fff",
    },
    title: {
      text: `${uid} — Price History`,
      align: "left",
      style: { fontSize: "14px", fontWeight: 600, color: "#333" },
    },
    xaxis: {
      type: "datetime",
      labels: { format: "dd MMM" },
    },
    yaxis: {
      tooltip: { enabled: true },
      labels: {
        formatter: (val) => `₹${val.toFixed(0)}`,
      },
    },
    plotOptions: {
      candlestick: {
        colors: { upward: "#26a69a", downward: "#ef5350" },
        wick: { useFillColor: true },
      },
    },
    tooltip: {
      x: { format: "dd MMM yyyy" },
    },
  };

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
        width: "680px",
        padding: "24px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <span style={{ fontWeight: 700, fontSize: "1.05rem", color: "#333" }}>
          {uid} Analytics
        </span>
        <button
          onClick={closeAnalyticsWindow}
          style={{ background: "none", border: "none", fontSize: "1.3rem", cursor: "pointer", color: "#888" }}
        >
          ✕
        </button>
      </div>

      <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
        {PERIODS.map((p) => (
          <button
            key={p.value}
            onClick={() => setPeriod(p.value)}
            style={{
              padding: "4px 14px",
              borderRadius: "4px",
              border: "1px solid #ddd",
              cursor: "pointer",
              fontWeight: period === p.value ? 700 : 400,
              background: period === p.value ? "#387ed1" : "#f5f5f5",
              color: period === p.value ? "#fff" : "#333",
              fontSize: "0.82rem",
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#888" }}>
          Loading chart...
        </div>
      )}

      {!loading && error && (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#e74c3c" }}>
          {error}
        </div>
      )}

      {!loading && !error && series.length > 0 && (
        <ReactApexChart
          options={options}
          series={series}
          type="candlestick"
          height={320}
        />
      )}
    </div>
  );
};

export default AnalyticsWindow;
