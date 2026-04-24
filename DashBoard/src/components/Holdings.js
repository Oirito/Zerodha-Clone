import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { VerticalGraph } from "./VerticalGraph";
import { holdings } from "../data/data";
import GeneralContext from "./GeneralContext";

// Connect to backend Socket.IO (reuse single connection)
const socket = io("http://localhost:3002");

const Holdings = () => {
  const [allHoldings, setAllHoldings] = useState([]);
  const [livePrices, setLivePrices] = useState({});
  const [loading, setLoading] = useState(true);
  const generalContext = useContext(GeneralContext);

  // Fetch holdings from backend
  useEffect(() => {
    const fetchHoldings = () => {
      axios
        .get("http://localhost:3002/allHoldings")
        .then((res) => {
          setAllHoldings(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("API Error:", err);

          // 🔥 fallback to local data if backend fails
          setAllHoldings(holdings);
          setLoading(false);
        });
    };

    fetchHoldings(); // Initial fetch
    const intervalId = setInterval(fetchHoldings, 3000); // Poll every 3 seconds

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, []);

  // Listen for real-time price updates
  useEffect(() => {
    socket.on("stockPriceUpdate", (prices) => {
      setLivePrices(prices);
    });

    return () => {
      socket.off("stockPriceUpdate");
    };
  }, []);

  if (loading) {
    return <h3>Loading holdings...</h3>;
  }

  // Merge holdings with live prices
  const holdingsWithLivePrices = allHoldings.map((stock) => {
    const liveData = livePrices[stock.name];
    if (liveData) {
      return { ...stock, price: liveData.price };
    }
    return stock;
  });

  const labels = holdingsWithLivePrices.map((stock) => stock.name);

  const data = {
    labels,
    datasets: [
      {
        label: "Stock Price",
        data: holdingsWithLivePrices.map((stock) => stock.price),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  // Calculate totals dynamically
  const totalInvestment = holdingsWithLivePrices.reduce(
    (sum, stock) => sum + stock.avg * stock.qty,
    0
  );
  const currentValue = holdingsWithLivePrices.reduce(
    (sum, stock) => sum + stock.price * stock.qty,
    0
  );
  const totalPnL = currentValue - totalInvestment;
  const totalPnLPercent = ((totalPnL / totalInvestment) * 100).toFixed(2);

  return (
    <>
      <h3 className="title">Holdings ({holdingsWithLivePrices.length})</h3>

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
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {holdingsWithLivePrices.map((stock, index) => {
              const curValue = stock.price * stock.qty;
              const pnl = curValue - stock.avg * stock.qty;
              const isProfit = pnl >= 0;
              const profClass = isProfit ? "profit" : "loss";
              const netChg = ((stock.price - stock.avg) / stock.avg * 100).toFixed(2);
              const dayClass = stock.isLoss ? "loss" : "profit";

              return (
                <tr key={index}>
                  <td>{stock.name}</td>
                  <td>{stock.qty}</td>
                  <td>{stock.avg.toFixed(2)}</td>
                  <td>{stock.price.toFixed(2)}</td>
                  <td>{curValue.toFixed(2)}</td>
                  <td className={profClass}>
                    {pnl.toFixed(2)}
                  </td>
                  <td className={profClass}>{isProfit ? "+" : ""}{netChg}%</td>
                  <td className={dayClass}>{stock.day}</td>
                  <td className="holdings-actions">
                    <button
                      className="holdings-btn buy-btn"
                      onClick={() => generalContext.openBuyWindow(stock.name, stock.price)}
                    >
                      B
                    </button>
                    <button
                      className="holdings-btn sell-btn"
                      onClick={() => generalContext.openSellWindow(stock.name, stock.price)}
                    >
                      S
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="row">
        <div className="col">
          <h5>
            {totalInvestment.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h5>
          <p>Total investment</p>
        </div>
        <div className="col">
          <h5>
            {currentValue.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h5>
          <p>Current value</p>
        </div>
        <div className="col">
          <h5 className={totalPnL >= 0 ? "profit" : "loss"}>
            {totalPnL >= 0 ? "+" : ""}{totalPnL.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({totalPnL >= 0 ? "+" : ""}{totalPnLPercent}%)
          </h5>
          <p>P&L</p>
        </div>
      </div>

      <VerticalGraph data={data} />
    </>
  );
};

export default Holdings;
