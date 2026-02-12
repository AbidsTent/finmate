// server/server.js
const path = require("path");
const express = require("express");

const { listExpenses, addExpense, deleteExpense } = require("./data");

const app = express();
const PORT = process.env.PORT || 3000;

// Parse JSON bodies
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, "..", "public")));

// ---- REST API ----

// GET: list expenses
app.get("/api/expenses", (req, res) => {
  res.status(200).json(listExpenses());
});

// POST: add an expense
app.post("/api/expenses", (req, res) => {
  const { title, category, amount, date } = req.body || {};

  if (!title || !category || !date) {
    return res.status(400).json({ message: "title, category, and date are required." });
  }

  const num = Number(amount);
  if (!Number.isFinite(num) || num <= 0) {
    return res.status(400).json({ message: "amount must be a positive number." });
  }

  const created = addExpense({
    title: String(title).trim(),
    category: String(category).trim(),
    amount: num,
    date: String(date).trim(),
  });

  res.status(201).json(created);
});

// DELETE: delete an expense by id
app.delete("/api/expenses/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    return res.status(400).json({ message: "Invalid id." });
  }

  const removed = deleteExpense(id);
  if (!removed) {
    return res.status(404).json({ message: "Expense not found." });
  }

  res.status(200).json({ message: "Deleted", removed });
});

// Nice 404 for invalid routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

app.listen(PORT, () => {
  console.log(`Finmate server running at http://localhost:${PORT}`);
});
