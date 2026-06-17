import React, { useState, useEffect } from "react";
import axios from "axios";

const Orders = () => {
  const [allOrders, setAllOrders] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3002/allOrders", { withCredentials: true })
      .then((res) => setAllOrders(res.data));
  }, []);

  if (allOrders.length === 0) {
    return (
      <div className="orders">
        <div className="no-orders">
          <p>You haven't placed any orders yet.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <h3 className="title">Orders ({allOrders.length})</h3>
      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Date & Time</th>
              <th>Instrument</th>
              <th>Type</th>
              <th>Qty.</th>
              <th>Price (₹)</th>
              <th>Value (₹)</th>
            </tr>
          </thead>
          <tbody>
            {allOrders
              .slice()
              .reverse()
              .map((order, index) => {
                const value = (order.qty * order.price).toFixed(2);
                const isBuy = order.mode === "BUY";
                return (
                  <tr key={index}>
                    <td style={{ fontSize: "0.8rem", color: "#666" }}>
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "—"}
                    </td>
                    <td>{order.name}</td>
                    <td>
                      <span
                        style={{
                          color: isBuy ? "#26a69a" : "#ef5350",
                          fontWeight: 600,
                          fontSize: "0.82rem",
                        }}
                      >
                        {order.mode}
                      </span>
                    </td>
                    <td>{order.qty}</td>
                    <td>{order.price ? Number(order.price).toFixed(2) : "—"}</td>
                    <td>{value}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Orders;
