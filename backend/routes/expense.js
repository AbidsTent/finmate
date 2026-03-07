const express = require("express");
const router = express.Router();
const Expense = require("../models/expense");

// READ multiple
router.get("/", async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ _id: -1 });
    res.json(expenses);
  } catch {
    res.status(500).json({ message: "Failed to fetch expenses" });
  }
});

// CREATE
router.post("/", async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;

    const expense = new Expense({ title, amount, category, date });
    await expense.save();

    res.status(201).json(expense);
  } catch {
    res.status(500).json({ message: "Failed to create expense" });
  }
});

// UPDATE (edit feature)
router.put("/:id", async (req, res) => {
  try {
    const updated = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);
  } catch {
    res.status(500).json({ message: "Failed to update expense" });
  }
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: "Expense deleted" });
  } catch {
    res.status(500).json({ message: "Failed to delete expense" });
  }
});

module.exports = router;