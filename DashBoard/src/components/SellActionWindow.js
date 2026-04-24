import React, { useState, useContext } from "react";
import axios from "axios";
import GeneralContext from "./GeneralContext";
import "./BuyActionWindow.css"; // We'll use the same shared CSS for both

const SellActionWindow = ({ uid, initialPrice }) => {
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(initialPrice || 0.0);
  const [error, setError] = useState("");
  const generalContext = useContext(GeneralContext);

  const handleSellClick = async () => {
    try {
      setError(""); // clear previous errors
      await axios.post("http://localhost:3002/newOrder", {
        name: uid,
        qty: stockQuantity,
        price: stockPrice,
        mode: "SELL",
      });
      generalContext.closeSellWindow();
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("An error occurred while placing the order.");
      }
    }
  };

  const handleCancelClick = () => {
    generalContext.closeSellWindow();
  };

  return (
    <div className="action-window sell-window" onClick={(e) => e.stopPropagation()}>
      {/* Header */}
      <div className="action-window-header sell-header">
        <div className="header-left">
          <span className="header-badge sell-badge">SELL</span>
          <h3 className="header-stock-name">{uid}</h3>
        </div>
        <button className="header-close" onClick={handleCancelClick}>✕</button>
      </div>

      {/* Body */}
      <div className="action-window-body">
        {error && <div className="error-alert">{error}</div>}
        <div className="input-group">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              min="1"
              onChange={(e) => setStockQuantity(e.target.value)}
              value={stockQuantity}
            />
          </fieldset>
          <fieldset>
            <legend>Price</legend>
            <input
              type="number"
              step="0.05"
              onChange={(e) => setStockPrice(e.target.value)}
              value={stockPrice}
            />
          </fieldset>
        </div>
      </div>

      {/* Footer */}
      <div className="action-window-footer">
        <span className="margin-info">Margin required ₹{(stockQuantity * stockPrice).toFixed(2)}</span>
        <div className="action-buttons">
          <button className="action-btn sell-btn" onClick={handleSellClick}>
            Sell
          </button>
          <button className="action-btn cancel-btn" onClick={handleCancelClick}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellActionWindow;