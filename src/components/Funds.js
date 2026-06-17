import React, { useState, useEffect } from "react";
import axios from "axios";
import BACKEND_URL from "../config";

const Funds = () => {
  const [balance, setBalance] = useState(0);
  const [totalInvestment, setTotalInvestment] = useState(0);
  const [currentValue, setCurrentValue] = useState(0);
  const [pnl, setPnl] = useState(0);

  const [addAmount, setAddAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [msg, setMsg] = useState({ text: "", color: "green" });

  const showMsg = (text, color = "green") => {
    setMsg({ text, color });
    setTimeout(() => setMsg({ text: "", color: "green" }), 3000);
  };

  const fetchFunds = () => {
    axios
      .get("${BACKEND_URL}/funds", { withCredentials: true })
      .then((res) => {
        setBalance(res.data.balance);
        setTotalInvestment(res.data.totalInvestment);
        setCurrentValue(res.data.currentValue);
        setPnl(res.data.pnl);
      })
      .catch(() => {});
  };

  useEffect(() => {
    fetchFunds();
  }, []);

  const handleAdd = () => {
    const amount = Number(addAmount);
    if (!amount || amount <= 0) return showMsg("Enter a valid amount", "red");
    axios
      .post("${BACKEND_URL}/addFunds", { amount }, { withCredentials: true })
      .then(() => {
        fetchFunds();
        setAddAmount("");
        showMsg(`✓ ₹${amount.toLocaleString("en-IN")} added successfully`);
      })
      .catch(() => showMsg("Failed to add funds", "red"));
  };

  const handleWithdraw = () => {
    const amount = Number(withdrawAmount);
    if (!amount || amount <= 0) return showMsg("Enter a valid amount", "red");
    if (amount > balance) return showMsg("Insufficient balance", "red");
    axios
      .post("${BACKEND_URL}/withdrawFunds", { amount }, { withCredentials: true })
      .then(() => {
        fetchFunds();
        setWithdrawAmount("");
        showMsg(`✓ ₹${amount.toLocaleString("en-IN")} withdrawn successfully`);
      })
      .catch((err) => {
        const errMsg = err.response?.data?.error || "Failed to withdraw";
        showMsg(errMsg, "red");
      });
  };

  const inputStyle = {
    padding: "6px 10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "0.85rem",
    width: "130px",
    marginRight: "8px",
  };

  const btnStyle = (color) => ({
    padding: "6px 16px",
    borderRadius: "4px",
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "0.85rem",
    background: color,
    color: "#fff",
  });

  return (
    <>
      <div className="funds" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <p style={{ margin: 0, color: "#555", fontSize: "0.9rem" }}>
          Instant, zero-cost fund transfers with UPI
        </p>

        {msg.text && (
          <span style={{ color: msg.color, fontSize: "0.85rem", fontWeight: 500 }}>
            {msg.text}
          </span>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          <span style={{ fontWeight: 600, fontSize: "0.85rem", color: "#333", minWidth: "80px" }}>
            Add Funds
          </span>
          <input
            type="number"
            placeholder="Enter amount (₹)"
            value={addAmount}
            onChange={(e) => setAddAmount(e.target.value)}
            style={inputStyle}
            min="1"
          />
          <button style={btnStyle("#26a69a")} onClick={handleAdd}>
            Add
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
          <span style={{ fontWeight: 600, fontSize: "0.85rem", color: "#333", minWidth: "80px" }}>
            Withdraw
          </span>
          <input
            type="number"
            placeholder="Enter amount (₹)"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            style={inputStyle}
            min="1"
            max={balance}
          />
          <button style={btnStyle("#387ed1")} onClick={handleWithdraw}>
            Withdraw
          </button>
        </div>
      </div>

      <div className="row" style={{ marginTop: "24px" }}>
        <div className="col">
          <span><p>Equity</p></span>
          <div className="table">
            <div className="data">
              <p>Available cash</p>
              <p className="imp colored">₹{balance.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="data">
              <p>Used (invested)</p>
              <p className="imp">₹{totalInvestment.toFixed(2)}</p>
            </div>
            <div className="data">
              <p>Current value</p>
              <p className="imp">₹{currentValue.toFixed(2)}</p>
            </div>
            <hr />
            <div className="data">
              <p>P&amp;L</p>
              <p className={pnl >= 0 ? "profit" : "loss"}>
                {pnl >= 0 ? "+" : ""}₹{pnl.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="col">
          <span><p>Portfolio</p></span>
          <div className="table">
            <div className="data">
              <p>Total invested</p>
              <p className="imp">₹{totalInvestment.toFixed(2)}</p>
            </div>
            <div className="data">
              <p>Current value</p>
              <p className="imp">₹{currentValue.toFixed(2)}</p>
            </div>
            <hr />
            <div className="data">
              <p>Overall P&amp;L</p>
              <p className={pnl >= 0 ? "profit" : "loss"} style={{ fontWeight: 600 }}>
                {pnl >= 0 ? "+" : ""}₹{pnl.toFixed(2)}
                {totalInvestment > 0 && (
                  <span style={{ fontSize: "0.78rem", marginLeft: "6px" }}>
                    ({((pnl / totalInvestment) * 100).toFixed(2)}%)
                  </span>
                )}
              </p>
            </div>
            <div className="data">
              <p>Net worth</p>
              <p className="imp colored">₹{(balance + currentValue).toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Funds;
