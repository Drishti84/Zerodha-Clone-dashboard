import React, { useState, useEffect } from "react";
import axios from "axios";
import BACKEND_URL from "../config";

const fmt = (n) => n >= 1000 ? (n / 1000).toFixed(2) + "k" : n.toFixed(2);

const Summary = () => {
  const [username, setUsername] = useState("User");
  const [holdingsCount, setHoldingsCount] = useState(0);
  const [totalInvestment, setTotalInvestment] = useState(0);
  const [currentValue, setCurrentValue] = useState(0);
  const [pnl, setPnl] = useState(0);
  const [pnlPct, setPnlPct] = useState(0);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/me`, { withCredentials: true })
      .then((res) => {
        if (res.data && res.data.username) {
          setUsername(res.data.username);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/allHoldings`, { withCredentials: true })
      .then((res) => {
        const holdings = res.data || [];
        const investment = holdings.reduce((sum, h) => sum + h.avg * h.qty, 0);
        const current = holdings.reduce((sum, h) => sum + h.price * h.qty, 0);
        const gain = current - investment;
        const gainPct = investment > 0 ? (gain / investment) * 100 : 0;

        setHoldingsCount(holdings.length);
        setTotalInvestment(investment);
        setCurrentValue(current);
        setPnl(gain);
        setPnlPct(gainPct);
      })
      .catch(() => {});
  }, []);

  const pnlClass = pnl >= 0 ? "profit" : "loss";

  return (
    <>
      <div className="username">
        <h6>Hi, {username}!</h6>
        <hr className="divider" />
      </div>

      <div className="section">
        <span>
          <p>Equity</p>
        </span>

        <div className="data">
          <div className="first">
            <h3>{fmt(currentValue)}</h3>
            <p>Margin available</p>
          </div>
          <hr />

          <div className="second">
            <p>
              Investment <span>{fmt(totalInvestment)}</span>{" "}
            </p>
            <p>
              P&amp;L <span>{fmt(pnl)}</span>{" "}
            </p>
          </div>
        </div>
        <hr className="divider" />
      </div>

      <div className="section">
        <span>
          <p>Holdings ({holdingsCount})</p>
        </span>

        <div className="data">
          <div className="first">
            <h3 className={pnlClass}>
              {fmt(pnl)} <small>{pnlPct >= 0 ? "+" : ""}{pnlPct.toFixed(2)}%</small>{" "}
            </h3>
            <p>P&amp;L</p>
          </div>
          <hr />

          <div className="second">
            <p>
              Current Value <span>{fmt(currentValue)}</span>{" "}
            </p>
            <p>
              Investment <span>{fmt(totalInvestment)}</span>{" "}
            </p>
          </div>
        </div>
        <hr className="divider" />
      </div>
    </>
  );
};

export default Summary;
