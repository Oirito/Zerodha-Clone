import React, { useState, useContext } from "react";
import axios from "axios";
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
} from "@mui/icons-material";

import { watchlist } from "../data/data";
import { DoughnutChart } from "./DoughnoutChart";

const labels = watchlist.map((subArray) => subArray["name"]);

const WatchList = () => {
  const data = {
    labels,
    datasets: [
      {
        label: "Price",
        data: watchlist.map((stock) => stock.price),
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
          "rgba(153, 102, 255, 0.5)",
          "rgba(255, 159, 64, 0.5)",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="watchlist-container">
      <div className="search-container">
        <input
          type="text"
          name="search"
          placeholder="Search eg: infy, bse, nifty fut weekly, gold mcx"
          className="search"
        />
        <span className="counts">{watchlist.length} / 50</span>
      </div>

      <ul className="list">
        {watchlist.map((stock, index) => (
          <WatchListItem stock={stock} key={index} />
        ))}
      </ul>

      <DoughnutChart data={data} />
    </div>
  );
};

export default WatchList;

const WatchListItem = ({ stock }) => {
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
          <span className="price">{stock.price}</span>
        </div>
      </div>

      {showWatchlistActions && <WatchListActions uid={stock.name} />}
    </li>
  );
};

const WatchListActions = ({ uid }) => {
  const generalContext = useContext(GeneralContext);

  const handleBuyClick = () => {
    generalContext.openBuyWindow(uid);
  };

  const handleDelete = () => {
    console.log("Delete:", uid);
  };

  const handleMarketDepth = () => {
    console.log("Market Depth:", uid);
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
          <button className="sell">Sell</button>
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
          title="Delete (Del)"
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