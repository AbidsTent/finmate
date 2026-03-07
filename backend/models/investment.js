const mongoose = require("mongoose");

const investmentSchema = new mongoose.Schema(
  {
    ticker: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    shares: {
      type: Number,
      required: true,
      min: 0.0001,
    },
    buyPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    current: {
      type: Number,
      default: 0,
      min: 0,
    },
    buyDate: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Investment", investmentSchema);