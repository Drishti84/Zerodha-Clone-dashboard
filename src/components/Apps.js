import React from "react";

const apps = [
  {
    name: "Kite",
    description: "The fast, elegant trading platform. Web & mobile.",
    icon: "📈",
    color: "#387ed1",
  },
  {
    name: "Coin",
    description: "Direct mutual funds — zero commission.",
    icon: "🪙",
    color: "#f39c12",
  },
  {
    name: "Varsity",
    description: "Free stock market education — 500+ chapters.",
    icon: "📚",
    color: "#27ae60",
  },
  {
    name: "Console",
    description: "Your backoffice — P&L reports, tax statements, ledger.",
    icon: "🗂️",
    color: "#8e44ad",
  },
  {
    name: "Sentinel",
    description: "Set price alerts for any stock or index.",
    icon: "🔔",
    color: "#e74c3c",
  },
  {
    name: "Kite Connect",
    description: "Trading APIs to build your own investment apps.",
    icon: "🔌",
    color: "#16a085",
  },
];

const Apps = () => {
  return (
    <>
      <h3 className="title">Apps</h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: "16px",
          padding: "16px 0",
        }}
      >
        {apps.map((app) => (
          <div
            key={app.name}
            style={{
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              padding: "20px",
              background: "#fff",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ fontSize: "2rem" }}>{app.icon}</div>
            <div
              style={{ fontWeight: 700, fontSize: "1rem", color: app.color }}
            >
              {app.name}
            </div>
            <div style={{ fontSize: "0.85rem", color: "#555" }}>
              {app.description}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Apps;
