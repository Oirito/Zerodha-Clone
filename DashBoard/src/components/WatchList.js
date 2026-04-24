import React, { useState, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import GeneralContext from "./GeneralContext";

import { Tooltip, Grow } from "@mui/material";
import "./WatchList.css";
import {
  BarChartOutlined,
  KeyboardArrowDown,
  KeyboardArrowUp,
  MoreHoriz,
  DeleteOutline,
  ShowChart,
  SearchOutlined,
  AddCircleOutline,
  CloseOutlined,
} from "@mui/icons-material";

import { watchlist as defaultWatchlist } from "../data/data";
import { DoughnutChart } from "./DoughnoutChart";

// Full stock database for search
const ALL_STOCKS = [
  // 🟦 Tech Giants
  { symbol: "AAPL", name: "Apple Inc.", sector: "Technology", price: 178.72 },
  { symbol: "GOOGL", name: "Alphabet Inc.", sector: "Technology", price: 141.80 },
  { symbol: "MSFT", name: "Microsoft Corp.", sector: "Technology", price: 417.88 },
  { symbol: "AMZN", name: "Amazon.com Inc.", sector: "Consumer", price: 186.49 },
  { symbol: "TSLA", name: "Tesla Inc.", sector: "Automotive", price: 248.42 },
  { symbol: "META", name: "Meta Platforms Inc.", sector: "Technology", price: 501.80 },
  { symbol: "NVDA", name: "NVIDIA Corp.", sector: "Technology", price: 878.35 },
  { symbol: "NFLX", name: "Netflix Inc.", sector: "Entertainment", price: 628.90 },
  { symbol: "AMD", name: "Advanced Micro Devices", sector: "Technology", price: 157.25 },
  // 🟩 More Tech
  { symbol: "CRM", name: "Salesforce Inc.", sector: "Technology", price: 272.50 },
  { symbol: "ORCL", name: "Oracle Corp.", sector: "Technology", price: 125.40 },
  { symbol: "INTC", name: "Intel Corp.", sector: "Technology", price: 31.25 },
  { symbol: "CSCO", name: "Cisco Systems Inc.", sector: "Technology", price: 49.85 },
  { symbol: "ADBE", name: "Adobe Inc.", sector: "Technology", price: 524.30 },
  { symbol: "PYPL", name: "PayPal Holdings Inc.", sector: "Fintech", price: 63.40 },
  { symbol: "SQ", name: "Block Inc.", sector: "Fintech", price: 75.20 },
  { symbol: "SHOP", name: "Shopify Inc.", sector: "E-Commerce", price: 68.90 },
  { symbol: "UBER", name: "Uber Technologies", sector: "Transportation", price: 72.15 },
  { symbol: "SNAP", name: "Snap Inc.", sector: "Social Media", price: 11.85 },
  { symbol: "PINS", name: "Pinterest Inc.", sector: "Social Media", price: 32.45 },
  { symbol: "SPOT", name: "Spotify Technology", sector: "Entertainment", price: 268.90 },
  { symbol: "ZM", name: "Zoom Video Comm.", sector: "Technology", price: 65.30 },
  { symbol: "ROKU", name: "Roku Inc.", sector: "Entertainment", price: 62.75 },
  // 🟨 Finance & Banking
  { symbol: "JPM", name: "JPMorgan Chase & Co.", sector: "Finance", price: 198.50 },
  { symbol: "BAC", name: "Bank of America Corp.", sector: "Finance", price: 35.80 },
  { symbol: "GS", name: "Goldman Sachs Group", sector: "Finance", price: 432.60 },
  { symbol: "V", name: "Visa Inc.", sector: "Finance", price: 279.40 },
  { symbol: "MA", name: "Mastercard Inc.", sector: "Finance", price: 458.70 },
  { symbol: "WFC", name: "Wells Fargo & Co.", sector: "Finance", price: 57.30 },
  { symbol: "AXP", name: "American Express", sector: "Finance", price: 222.40 },
  // 🟥 Healthcare
  { symbol: "JNJ", name: "Johnson & Johnson", sector: "Healthcare", price: 156.80 },
  { symbol: "UNH", name: "UnitedHealth Group", sector: "Healthcare", price: 527.40 },
  { symbol: "PFE", name: "Pfizer Inc.", sector: "Healthcare", price: 27.60 },
  { symbol: "ABBV", name: "AbbVie Inc.", sector: "Healthcare", price: 171.30 },
  { symbol: "MRK", name: "Merck & Co.", sector: "Healthcare", price: 128.50 },
  { symbol: "LLY", name: "Eli Lilly & Co.", sector: "Healthcare", price: 782.40 },
  // 🟧 Consumer & Retail
  { symbol: "WMT", name: "Walmart Inc.", sector: "Retail", price: 167.80 },
  { symbol: "COST", name: "Costco Wholesale", sector: "Retail", price: 725.60 },
  { symbol: "KO", name: "Coca-Cola Company", sector: "Consumer", price: 60.45 },
  { symbol: "PEP", name: "PepsiCo Inc.", sector: "Consumer", price: 171.20 },
  { symbol: "MCD", name: "McDonald's Corp.", sector: "Consumer", price: 289.30 },
  { symbol: "NKE", name: "Nike Inc.", sector: "Consumer", price: 97.50 },
  { symbol: "SBUX", name: "Starbucks Corp.", sector: "Consumer", price: 92.80 },
  { symbol: "DIS", name: "Walt Disney Co.", sector: "Entertainment", price: 112.40 },
  // 🟪 Energy & Industrial
  { symbol: "XOM", name: "Exxon Mobil Corp.", sector: "Energy", price: 104.60 },
  { symbol: "CVX", name: "Chevron Corp.", sector: "Energy", price: 155.30 },
  { symbol: "BA", name: "Boeing Company", sector: "Industrial", price: 208.70 },
  { symbol: "CAT", name: "Caterpillar Inc.", sector: "Industrial", price: 356.40 },
  { symbol: "GE", name: "General Electric", sector: "Industrial", price: 162.80 },
  // 🟫 Crypto & EV
  { symbol: "COIN", name: "Coinbase Global", sector: "Crypto", price: 225.60 },
  { symbol: "RIVN", name: "Rivian Automotive", sector: "EV", price: 17.85 },
  { symbol: "LCID", name: "Lucid Group Inc.", sector: "EV", price: 3.45 },
  { symbol: "NIO", name: "NIO Inc.", sector: "EV", price: 5.80 },
  // 🇮🇳 Indian Stocks (NSE)
  { symbol: "RELIANCE", name: "Reliance Industries", sector: "Energy", price: 2950.40 },
  { symbol: "TCS", name: "Tata Consultancy Services", sector: "Technology", price: 4120.15 },
  { symbol: "HDFCBANK", name: "HDFC Bank", sector: "Finance", price: 1445.60 },
  { symbol: "INFY", name: "Infosys", sector: "Technology", price: 1675.20 },
  { symbol: "ICICIBANK", name: "ICICI Bank", sector: "Finance", price: 1080.35 },
  { symbol: "SBIN", name: "State Bank of India", sector: "Finance", price: 760.50 },
  { symbol: "ITC", name: "ITC Limited", sector: "Consumer", price: 435.80 },
  { symbol: "BHARTIARTL", name: "Bharti Airtel", sector: "Technology", price: 1120.45 },
  { symbol: "KOTAKBANK", name: "Kotak Mahindra Bank", sector: "Finance", price: 1750.25 },
  { symbol: "LT", name: "Larsen & Toubro", sector: "Industrial", price: 3680.10 },
  { symbol: "TATAMOTORS", name: "Tata Motors", sector: "Automotive", price: 990.20 },
  { symbol: "MARUTI", name: "Maruti Suzuki", sector: "Automotive", price: 11450.60 },
  { symbol: "SUNPHARMA", name: "Sun Pharmaceutical", sector: "Healthcare", price: 1530.80 },
  { symbol: "HUL", name: "Hindustan Unilever", sector: "Consumer", price: 2420.50 },
  { symbol: "ASIANPAINT", name: "Asian Paints", sector: "Consumer", price: 2890.30 },
];

// Connect to backend Socket.IO
const socket = io("http://localhost:3002");

const WatchList = () => {
  const [liveWatchlist, setLiveWatchlist] = useState(defaultWatchlist);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    // Listen for real-time price updates
    socket.on("stockPriceUpdate", (prices) => {
      setLiveWatchlist((prev) =>
        prev.map((stock) => {
          const liveData = prices[stock.name];
          if (liveData) {
            const prevPrice = stock.price;
            const newPrice = liveData.price;
            const changePercent = ((newPrice - prevPrice) / prevPrice) * 100;

            return {
              ...stock,
              price: newPrice,
              percent: `${changePercent >= 0 ? "+" : ""}${changePercent.toFixed(2)}%`,
              isDown: liveData.isDown,
            };
          }
          return stock;
        })
      );
    });

    return () => {
      socket.off("stockPriceUpdate");
    };
  }, []);

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter stocks based on search
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim().length === 0) {
      setSearchResults([]);
      return;
    }
    const q = query.toLowerCase();
    const results = ALL_STOCKS.filter(
      (stock) =>
        (stock.symbol.toLowerCase().includes(q) ||
          stock.name.toLowerCase().includes(q) ||
          stock.sector.toLowerCase().includes(q)) &&
        !liveWatchlist.some((w) => w.name === stock.symbol)
    ).slice(0, 8);
    setSearchResults(results);
  };

  // Add stock to watchlist
  const addToWatchlist = (stock) => {
    const newEntry = {
      name: stock.symbol,
      price: stock.price,
      percent: "+0.00%",
      isDown: false,
    };
    setLiveWatchlist((prev) => [...prev, newEntry]);
    setSearchQuery("");
    setSearchResults([]);
    setIsSearchFocused(false);

    // Notify backend to subscribe to this symbol
    socket.emit("subscribeSymbol", stock.symbol);
  };

  // Remove stock from watchlist
  const removeFromWatchlist = (symbolName) => {
    setLiveWatchlist((prev) => prev.filter((s) => s.name !== symbolName));
  };

  const labels = liveWatchlist.map((stock) => stock.name);

  const data = {
    labels,
    datasets: [
      {
        label: "Price",
        data: liveWatchlist.map((stock) => stock.price),
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
          "rgba(255, 159, 64, 0.5)",
          "rgba(255, 99, 71, 0.5)",
          "rgba(0, 206, 209, 0.5)",
          "rgba(144, 238, 144, 0.5)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="watchlist-container">
      {/* 🔍 Modern Search Bar */}
      <div className="search-container" ref={searchRef}>
        <div className={`search-wrapper ${isSearchFocused ? "focused" : ""}`}>
          <SearchOutlined className="search-icon" />
          <input
            type="text"
            name="search"
            placeholder="Search stocks eg: AAPL, Tesla, Finance..."
            className="search"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            autoComplete="off"
          />
          {searchQuery && (
            <CloseOutlined
              className="search-clear"
              onClick={() => {
                setSearchQuery("");
                setSearchResults([]);
              }}
            />
          )}
          <span className="counts">{liveWatchlist.length} / 50</span>
        </div>

        {/* 🔽 Search Dropdown */}
        {isSearchFocused && searchResults.length > 0 && (
          <div className="search-dropdown">
            {searchResults.map((stock, i) => (
              <div
                key={i}
                className="search-result-item"
                onClick={() => addToWatchlist(stock)}
              >
                <div className="search-result-left">
                  <span className="search-result-symbol">{stock.symbol}</span>
                  <span className="search-result-name">{stock.name}</span>
                </div>
                <div className="search-result-right">
                  <span className="search-result-sector">{stock.sector}</span>
                  <span className="search-result-price">${stock.price.toFixed(2)}</span>
                  <AddCircleOutline className="search-result-add" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state when searching but no results */}
        {isSearchFocused && searchQuery.trim().length > 0 && searchResults.length === 0 && (
          <div className="search-dropdown">
            <div className="search-no-results">
              No stocks found for "<strong>{searchQuery}</strong>"
            </div>
          </div>
        )}
      </div>

      <ul className="list">
        {liveWatchlist.map((stock, index) => (
          <WatchListItem
            stock={stock}
            key={stock.name}
            onRemove={removeFromWatchlist}
          />
        ))}
      </ul>

      <DoughnutChart data={data} />
    </div>
  );
};

export default WatchList;

const WatchListItem = ({ stock, onRemove }) => {
  const [showWatchlistActions, setShowWatchlistActions] = useState(false);

  return (
    <li
      onMouseEnter={() => setShowWatchlistActions(true)}
      onMouseLeave={() => setShowWatchlistActions(false)}
    >
      <div className="item">
        <p className={stock.isDown ? "down" : "up"}>{stock.name}</p>

        <div className="itemInfo">
          <span className="percent">{stock.percent}</span>
          {stock.isDown ? (
            <KeyboardArrowDown className="down" />
          ) : (
            <KeyboardArrowUp className="up" />
          )}
          <span className="price">{stock.price.toFixed(2)}</span>
        </div>
      </div>

      {showWatchlistActions && (
        <WatchListActions stock={stock} onRemove={onRemove} />
      )}
    </li>
  );
};

const WatchListActions = ({ stock, onRemove }) => {
  const generalContext = useContext(GeneralContext);

  const handleBuyClick = () => {
    generalContext.openBuyWindow(stock.name, stock.price);
  };

  const handleSellClick = () => {
    generalContext.openSellWindow(stock.name, stock.price);
  };

  const handleDelete = () => {
    onRemove(stock.name);
  };

  const handleMarketDepth = () => {
    console.log("Market Depth:", stock.name);
  };

  return (
    <span className="actions">
      <span className="actions-row">
        {/* BUY */}
        <Tooltip
          title="Buy (B)"
          arrow
          slots={{ transition: Grow }}
        >
          <button className="buy" onClick={handleBuyClick}>
            Buy
          </button>
        </Tooltip>

        {/* SELL */}
        <Tooltip
          title="Sell (S)"
          arrow
          slots={{ transition: Grow }}
        >
          <button className="sell" onClick={handleSellClick}>Sell</button>
        </Tooltip>

        {/* ANALYTICS */}
        <Tooltip
          title="Analytics (A)"
          arrow
          slots={{ transition: Grow }}
        >
          <button className="action">
            <BarChartOutlined />
          </button>
        </Tooltip>

        {/* MARKET DEPTH */}
        <Tooltip
          title="Market Depth (D)"
          arrow
          slots={{ transition: Grow }}
        >
          <button className="action" onClick={handleMarketDepth}>
            <ShowChart />
          </button>
        </Tooltip>

        {/* DELETE */}
        <Tooltip
          title="Remove from Watchlist"
          arrow
          slots={{ transition: Grow }}
        >
          <button className="action" onClick={handleDelete}>
            <DeleteOutline />
          </button>
        </Tooltip>

        {/* MORE */}
        <Tooltip
          title="More"
          arrow
          slots={{ transition: Grow }}
        >
          <button className="action">
            <MoreHoriz />
          </button>
        </Tooltip>
      </span>
    </span>
  );
};