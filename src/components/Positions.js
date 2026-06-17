import React, { useState, useEffect } from "react";
import axios from "axios";
import BACKEND_URL from "../config";

const Positions = () => {
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    axios
      .get("${BACKEND_URL}/allOrders", { withCredentials: true })
      .then((res) => {
        const today = new Date().toDateString();

        // Filter for today's orders only
        const todaysOrders = res.data.filter(
          (order) =>
            new Date(order.createdAt).toDateString() === today
        );

        // Group by stock name
        const grouped = {};
        todaysOrders.forEach((order) => {
          const name = order.name;
          if (!grouped[name]) {
            grouped[name] = { buyQty: 0, sellQty: 0, buyValue: 0 };
          }
          if (order.mode === "BUY") {
            grouped[name].buyQty += order.qty;
            grouped[name].buyValue += order.price * order.qty;
          } else if (order.mode === "SELL") {
            grouped[name].sellQty += order.qty;
          }
        });

        // Build position rows where netQty !== 0
        const result = Object.entries(grouped)
          .map(([name, data]) => {
            const netQty = data.buyQty - data.sellQty;
            const avgBuyPrice =
              data.buyQty > 0 ? data.buyValue / data.buyQty : 0;
            return { name, netQty, avgBuyPrice };
          })
          .filter((pos) => pos.netQty !== 0);

        setPositions(result);
      })
      .catch(() => setPositions([]));
  }, []);

  if (positions.length === 0) {
    return (
      <div className="orders">
        <div className="no-orders">
          <p>
            No open positions today. Intraday trades (buy + sell same day)
            appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <h3 className="title">Positions ({positions.length})</h3>

      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Type</th>
              <th>Net Qty</th>
              <th>Avg Buy (₹)</th>
              <th>P&amp;L</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((pos, index) => {
              const isLong = pos.netQty > 0;
              return (
                <tr key={index}>
                  <td>{pos.name}</td>
                  <td className={isLong ? "profit" : "loss"}>
                    {isLong ? "LONG" : "SHORT"}
                  </td>
                  <td>{pos.netQty}</td>
                  <td>{pos.avgBuyPrice.toFixed(2)}</td>
                  <td>—</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Positions;
