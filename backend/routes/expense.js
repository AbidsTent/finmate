const express = require("express");
const router = express.Router();
const Expense = require("../models/expense");
const { protect } = require("../middleware/authMiddleware");
const generateDisplayId = require("../utils/generateDisplayId");

router.get("/:id", protect, async (req, res) => {
  try {
    const expense = await Expense.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json(expense);
  } catch {
    res.status(500).json({ message: "Failed to fetch expense" });
  }
});

router.get("/", protect, async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user._id }).sort({ _id: -1 });
    res.json(expenses);
  } catch {
    res.status(500).json({ message: "Failed to fetch expenses" });
  }
});

router.post("/", protect, async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;
    const displayId = await generateDisplayId(Expense, "EXP");

    const expense = new Expense({
      displayId,
      title,
      amount,
      category,
      date,
      user: req.user._id,
    });

    await expense.save();
    res.status(201).json(expense);
  } catch {
    res.status(500).json({ message: "Failed to create expense" });
  }
});

router.put("/:id", protect, async (req, res) => {
  try {
    const updated = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json(updated);
  } catch {
    res.status(500).json({ message: "Failed to update expense" });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    const deleted = await Expense.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json({ message: "Expense deleted" });
  } catch {
    res.status(500).json({ message: "Failed to delete expense" });
  }
});

module.exports = router;