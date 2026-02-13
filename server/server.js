const express = require("express");
const path = require("path");
const fs = require("fs");

const { getExpenses, addExpense, deleteExpenseById } = require("./data");

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(express.static(path.join(__dirname, "..", "public")));


// HTML Page Routes (A1 wants 3 pages)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "home.html"));
});

app.get("/expenses", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "expense.html"));
});

app.get("/investments", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "invest.html"));
});

// REST API (A1 required): GET, POST, DELETE
//GET list of expenses
app.get("/api/expenses", (req, res) => {
  return res.status(200).json(getExpenses()); // 200 OK
});

// POST add an expense
app.post("/api/expenses", (req, res) => {
  const { title, amount, category, date } = req.body;

  // Validation -> 400 Bad Request
  if (!title || amount === undefined || !category || !date) {
    return res.status(400).json({
      message: "Missing required fields: title, amount, category, date",
    });
  }

  const numAmount = Number(amount);
  if (Number.isNaN(numAmount) || numAmount <= 0) {
    return res.status(400).json({ message: "Amount must be a positive number" });
  }

  const newExpense = {
    id: "e_" + Date.now(), // simple unique id for A1
    title: String(title).trim(),
    amount: numAmount,
    category: String(category),
    date: String(date),
  };

  addExpense(newExpense);
  return res.status(201).json(newExpense); // 201 Created
});

app.get("/api/invest", (req, res) => {
  // read invest.json from server folder (adjust path if yours differs)
  const dataPath = path.join(__dirname, "src", "data", "invest.json");
  fs.readFile(dataPath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading invest.json:", err);
      return res.status(500).json({ error: "Failed to load invest data" });
    }

    try {
      return res.status(200).json(JSON.parse(data)); // 200 OK
    } catch (parseError) {
      return res.status(500).json({ error: "Invalid invest JSON format" });
    }
  });
});
// DELETE remove an expense by id
app.delete("/api/expenses/:id", (req, res) => {
  const deleted = deleteExpenseById(req.params.id);

  if (!deleted) {
    return res.status(404).json({ message: "Expense not found" }); // 404 Not Found
  }

  return res.status(200).json({ message: "Deleted", deleted }); // 200 OK
});

// Fallback 404
app.use((req, res) => {
  res.status(404).send("404 - Not Found");
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
