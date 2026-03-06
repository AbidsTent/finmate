const mongoose = require("mongoose");

const investmentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ticker: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    shares: {
      type: Number,
      required: true,
      min: 0,
    },
    buyPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    buyDate: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Investment", investmentSchema);