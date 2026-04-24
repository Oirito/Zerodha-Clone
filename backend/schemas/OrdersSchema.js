const { Schema } = require("mongoose");

const OrdersSchema = new Schema({
  name: String,
  qty: Number,
  price: Number,
  mode: String,
  status: { type: String, default: "Pending" },
  time: { type: Date, default: Date.now },
});

module.exports = { OrdersSchema };