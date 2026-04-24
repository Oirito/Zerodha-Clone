require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const WebSocket = require("ws");

const { HoldingsModel } = require("./model/HoldingsModel");
const { PositionsModel } = require("./model/PositionsModel");
const { OrdersModel } = require("./model/OrdersModel");

const PORT = process.env.PORT || 3002;
const uri = process.env.MONGO_URL;
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;

const app = express();

// Create HTTP server and attach Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(bodyParser.json());

// ==========================================
// 📈 YAHOO FINANCE REAL-TIME ENGINE
// ==========================================
const YahooFinance = require('yahoo-finance2').default;
const yahooFinance = new YahooFinance({ suppressNotices: ['yahooSurvey'] });

// In-memory store for latest stock prices
const latestPrices = {};

// We track which symbols are currently subscribed by active clients
const activeSubscriptions = new Set([
  "AAPL", "GOOGL", "MSFT", "AMZN", "TSLA",
  "RELIANCE", "TCS", "HDFCBANK", "INFY" // Default start
]);

const INDIAN_STOCKS = new Set([
  "RELIANCE", "TCS", "HDFCBANK", "INFY", "ICICIBANK", "SBIN", "ITC",
  "BHARTIARTL", "KOTAKBANK", "LT", "TATAMOTORS", "MARUTI", "SUNPHARMA",
  "HUL", "ASIANPAINT",
]);

// Map our symbol to Yahoo's symbol
const getYahooSymbol = (sym) => INDIAN_STOCKS.has(sym) ? `${sym}.NS` : sym;

let pollingInterval = null;

async function fetchLivePrices() {
  const symbolsToFetch = Array.from(activeSubscriptions);
  if (symbolsToFetch.length === 0) return;

  try {
    const yahooSymbols = symbolsToFetch.map(getYahooSymbol);
    
    // Fetch quotes for all active symbols
    const quotes = await yahooFinance.quote(yahooSymbols);

    quotes.forEach((quote) => {
      // Find the original symbol (remove .NS if present)
      const originalSymbol = quote.symbol.replace('.NS', '');
      
      const price = quote.regularMarketPrice;
      const prevPrice = quote.regularMarketPreviousClose;
      const change = quote.regularMarketChangePercent || 0;

      latestPrices[originalSymbol] = {
        symbol: originalSymbol,
        price: price,
        change: change.toFixed(2),
        isDown: change < 0,
        timestamp: Date.now(),
      };
    });

    // Broadcast to frontend
    io.emit("stockPriceUpdate", latestPrices);
  } catch (error) {
    console.error("❌ Error fetching Yahoo Finance prices:", error.message);
  }
}

function startRealTimeEngine() {
  console.log("🔌 Starting genuine live price polling (Yahoo Finance)...");
  
  // Initial fetch
  fetchLivePrices();
  
  // Poll every 4 seconds (fast enough for real-time feel, slow enough to avoid rate limits)
  pollingInterval = setInterval(fetchLivePrices, 4000);
}

// ==========================================
// 🔌 SOCKET.IO CONNECTION HANDLING
// ==========================================

io.on("connection", (socket) => {
  console.log(`👤 Client connected: ${socket.id}`);

  // Send latest prices immediately when a client connects
  if (Object.keys(latestPrices).length > 0) {
    socket.emit("stockPriceUpdate", latestPrices);
  }

  // Handle dynamic symbol subscription from frontend
  socket.on("subscribeSymbol", (symbol) => {
    if (!activeSubscriptions.has(symbol)) {
      console.log(`📊 Client requested subscription: ${symbol}`);
      activeSubscriptions.add(symbol);
      
      // Instantly trigger a fetch to quickly give them the price
      fetchLivePrices();
    }
  });

  socket.on("disconnect", () => {
    console.log(`👤 Client disconnected: ${socket.id}`);
  });
});

// ==========================================
// 📡 REST API ENDPOINTS
// ==========================================

// Get latest stock prices (REST fallback)
app.get("/stockPrices", (req, res) => {
  res.json(latestPrices);
});

app.get("/allHoldings", async (req, res) => {
  let allHoldings = await HoldingsModel.find({});
  res.json(allHoldings);
});

app.get("/allPositions", async (req, res) => {
  let allPositions = await PositionsModel.find({});
  res.json(allPositions);
});

app.post("/newOrder", async (req, res) => {
  try {
    const { name, qty, price, mode } = req.body;

    // Validate SELL orders before saving
    let holding = await HoldingsModel.findOne({ name: name });
    if (mode === "SELL") {
      if (!holding || holding.qty < Number(qty)) {
        return res.status(400).json({ error: "Insufficient holding quantity to sell." });
      }
    }

    let newOrder = new OrdersModel({
      name: name,
      qty: qty,
      price: price,
      mode: mode,
      status: "Completed",
    });

    await newOrder.save();

    if (mode === "BUY") {
      if (holding) {
        let totalValue = holding.qty * holding.avg + qty * price;
        holding.qty += Number(qty);
        holding.avg = totalValue / holding.qty;
        await holding.save();
      } else {
        let newHolding = new HoldingsModel({
          name: name,
          qty: Number(qty),
          avg: price,
          price: price,
          net: "+0.00%",
          day: "+0.00%",
        });
        await newHolding.save();
      }
    } else if (mode === "SELL") {
      if (holding) {
        holding.qty -= Number(qty);
        if (holding.qty <= 0) {
          await HoldingsModel.deleteOne({ name: name });
        } else {
          await holding.save();
        }
      }
    }

    res.send("Order completed successfully!");
  } catch (error) {
    console.error("Error saving order:", error);
    res.status(500).send("Failed to save order");
  }
});

app.get("/allOrders", async (req, res) => {
  let allOrders = await OrdersModel.find({});
  res.json(allOrders);
});

// ==========================================
// 🚀 START SERVER
// ==========================================

server.listen(PORT, () => {
  console.log(`🚀 App started on port ${PORT}!`);
  mongoose.connect(uri);
  console.log("📦 DB connected!");

  // Start Yahoo Finance Polling Engine
  startRealTimeEngine();
});