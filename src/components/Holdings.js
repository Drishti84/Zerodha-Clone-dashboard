import React, { useState, useEffect } from "react";
import axios from "axios";
import { VerticalGraph } from "./VerticalGraph";
import BACKEND_URL from "../config";

const Holdings = () => {
  const [allHoldings, setAllHoldings] = useState([]);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/allHoldings`, { withCredentials: true })
      .then((res) => setAllHoldings(res.data));
  }, []);

  const totalInvestment = allHoldings.reduce((sum, s) => sum + s.avg * s.qty, 0);
  const currentValue = allHoldings.reduce((sum, s) => sum + s.price * s.qty, 0);
  const pnl = currentValue - totalInvestment;
  const pnlPct = totalInvestment > 0 ? ((pnl / totalInvestment) * 100).toFixed(2) : "0.00";
  const pnlClass = pnl >= 0 ? "profit" : "loss";

  const labels = allHoldings.map((s) => s.name);
  const data = {
    labels,
    datasets: [
      {
        label: "Current Value (₹)",
        data: allHoldings.map((s) => s.price * s.qty),
        backgroundColor: "rgba(255,99,132,0.5)",
      },
    ],
  };

  if (allHoldings.length === 0) {
    return (
      <div className="orders">
        <div className="no-orders">
          <p>You don't have any holdings. Buy stocks to see them here.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <h3 className="title">Holdings ({allHoldings.length})</h3>

      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg. cost</th>
              <th>LTP</th>
              <th>Cur. val</th>
              <th>P&L</th>
              <th>Net chg.</th>
              <th>Day chg.</th>
            </tr>
          </thead>
          <tbody>
            {allHoldings.map((stock, index) => {
              const curValue = stock.price * stock.qty;
              const stockPnl = curValue - stock.avg * stock.qty;
              const profClass = stockPnl >= 0 ? "profit" : "loss";
              const dayClass = stock.isLoss ? "loss" : "profit";
              return (
                <tr key={index}>
                  <td>{stock.name}</td>
                  <td>{stock.qty}</td>
                  <td>{Number(stock.avg).toFixed(2)}</td>
                  <td>{Number(stock.price).toFixed(2)}</td>
                  <td>{curValue.toFixed(2)}</td>
                  <td className={profClass}>{stockPnl.toFixed(2)}</td>
                  <td className={profClass}>{stock.net}</td>
                  <td className={dayClass}>{stock.day}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="row">
        <div className="col">
          <h5>₹{totalInvestment.toFixed(2)}</h5>
          <p>Total investment</p>
        </div>
        <div className="col">
          <h5>₹{currentValue.toFixed(2)}</h5>
          <p>Current value</p>
        </div>
        <div className="col">
          <h5 className={pnlClass}>
            {pnl >= 0 ? "+" : ""}
            {pnl.toFixed(2)} ({pnlPct}%)
          </h5>
          <p>P&L</p>
        </div>
      </div>

      <VerticalGraph data={data} />
    </>
  );
};

export default Holdings;
