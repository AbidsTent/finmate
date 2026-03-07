const express = require("express");
const router = express.Router();
const Investment = require("../models/investment");

// GET all investments
router.get("/", async (req, res) => {
  try {
    const investments = await Investment.find().sort({ createdAt: -1 });
    res.status(200).json(investments);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch investments",
      error: error.message,
    });
  }
});

// GET one investment
router.get("/:id", async (req, res) => {
  try {
    const investment = await Investment.findById(req.params.id);

    if (!investment) {
      return res.status(404).json({ message: "Investment not found" });
    }

    res.status(200).json(investment);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch investment",
      error: error.message,
    });
  }
});

// CREATE 
router.post("/", async (req, res) => {
  try {
    const { ticker, shares, buyPrice, current, buyDate } = req.body;

    if (!ticker || shares === undefined || buyPrice === undefined) {
      return res.status(400).json({
        message: "ticker, shares, and buyPrice are required",
      });
    }

    const newInvestment = await Investment.create({
      ticker: String(ticker).trim().toUpperCase(),
      shares,
      buyPrice,
      current: current ?? 0,
      buyDate: buyDate ?? "",
    });

    res.status(201).json(newInvestment);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create investment",
      error: error.message,
    });
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  try {
    const updatedInvestment = await Investment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedInvestment) {
      return res.status(404).json({ message: "Investment not found" });
    }

    res.status(200).json(updatedInvestment);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update investment",
      error: error.message,
    });
  }
});

// DELETE 
router.delete("/:id", async (req, res) => {
  try {
    const deletedInvestment = await Investment.findByIdAndDelete(req.params.id);

    if (!deletedInvestment) {
      return res.status(404).json({ message: "Investment not found" });
    }

    res.status(200).json({ message: "Investment deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete investment",
      error: error.message,
    });
  }
});

module.exports = router;