import React, { useState } from "react";

import BuyActionWindow from "./BuyActionWindow";
import SellActionWindow from "./SellActionWindow";

const GeneralContext = React.createContext({
  openBuyWindow: (uid, price) => {},
  closeBuyWindow: () => {},
  openSellWindow: (uid, price) => {},
  closeSellWindow: () => {},
});

export const GeneralContextProvider = (props) => {
  const [isBuyWindowOpen, setIsBuyWindowOpen] = useState(false);
  const [isSellWindowOpen, setIsSellWindowOpen] = useState(false);
  const [selectedStockUID, setSelectedStockUID] = useState("");
  const [selectedStockPrice, setSelectedStockPrice] = useState(0);

  // 🟦 BUY
  const handleOpenBuyWindow = (uid, price = 0) => {
    setSelectedStockUID(uid);
    setSelectedStockPrice(price);
    setIsSellWindowOpen(false); // Close sell if open
    setIsBuyWindowOpen(true);
  };

  const handleCloseBuyWindow = () => {
    setIsBuyWindowOpen(false);
    setSelectedStockUID("");
  };

  // 🟥 SELL
  const handleOpenSellWindow = (uid, price = 0) => {
    setSelectedStockUID(uid);
    setSelectedStockPrice(price);
    setIsBuyWindowOpen(false); // Close buy if open
    setIsSellWindowOpen(true);
  };

  const handleCloseSellWindow = () => {
    setIsSellWindowOpen(false);
    setSelectedStockUID("");
  };

  // Close any open window
  const handleOverlayClick = () => {
    if (isBuyWindowOpen) handleCloseBuyWindow();
    if (isSellWindowOpen) handleCloseSellWindow();
  };

  const isAnyWindowOpen = isBuyWindowOpen || isSellWindowOpen;

  return (
    <GeneralContext.Provider
      value={{
        openBuyWindow: handleOpenBuyWindow,
        closeBuyWindow: handleCloseBuyWindow,
        openSellWindow: handleOpenSellWindow,
        closeSellWindow: handleCloseSellWindow,
      }}
    >
      {props.children}

      {/* 🌫️ BACKDROP OVERLAY — click to close */}
      {isAnyWindowOpen && (
        <div className="modal-overlay" onClick={handleOverlayClick} />
      )}

      {/* 🟦 BUY WINDOW */}
      {isBuyWindowOpen && <BuyActionWindow uid={selectedStockUID} initialPrice={selectedStockPrice} />}

      {/* 🟥 SELL WINDOW */}
      {isSellWindowOpen && <SellActionWindow uid={selectedStockUID} initialPrice={selectedStockPrice} />}
    </GeneralContext.Provider>
  );
};

export default GeneralContext;