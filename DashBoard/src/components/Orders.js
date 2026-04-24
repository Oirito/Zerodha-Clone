import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = () => {
      axios
        .get("http://localhost:3002/allOrders")
        .then((res) => {
          setOrders(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("API Error:", err);
          setOrders([]);
          setLoading(false);
        });
    };

    fetchOrders(); // Initial fetch
    const intervalId = setInterval(fetchOrders, 3000); // Poll every 3 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  if (loading) {
    return <h3>Loading orders...</h3>;
  }

  // 🧊 If no orders → show your existing UI
  if (orders.length === 0) {
    return (
      <div className="orders">
        <div className="no-orders">
          <p>You haven't placed any orders today</p>

          <Link to={"/"} className="btn">
            Get started
          </Link>
        </div>
      </div>
    );
  }

  // 🚀 If orders exist → show table
  return (
    <div className="orders">
      <h3 className="title">Orders ({orders.length})</h3>

      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Type</th>
              <th>Qty.</th>
              <th>Price</th>
              <th>Status</th>
              <th>Time</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order, index) => {
              const statusClass =
                order.status === "Completed" ? "profit" : "loss";

              return (
                <tr key={index}>
                  <td>{order.name}</td>
                  <td>{order.mode}</td>
                  <td>{order.qty}</td>
                  <td>{order.price.toFixed(2)}</td>
                  <td className={statusClass}>{order.status}</td>
                  <td>{new Date(order.time).toLocaleTimeString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;