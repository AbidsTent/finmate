const Investment = require("../models/investment");

async function seedInvestments() {
  try {
    const count = await Investment.countDocuments();

    if (count === 0) {
      await Investment.insertMany([
        {
          ticker: "AAPL",
          shares: 10,
          buyPrice: 175,
          current: 182,
          buyDate: "2026-01-10",
        },
        {
          ticker: "MSFT",
          shares: 8,
          buyPrice: 390,
          current: 405,
          buyDate: "2026-01-22",
        },
        {
          ticker: "TSLA",
          shares: 5,
          buyPrice: 220,
          current: 210,
          buyDate: "2026-01-15",
        },
      ]);

      console.log("Initial investment data seeded");
    } else {
      console.log("Investment data already exists");
    }
  } catch (error) {
    console.error("Seed error:", error.message);
  }
}

module.exports = seedInvestments;