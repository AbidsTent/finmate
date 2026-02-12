// server/data.js

let nextId = 1;

const expenses = [
  { id: nextId++, title: "Groceries", category: "Food", amount: 55.2, date: "2026-02-10" },
  { id: nextId++, title: "TTC", category: "Transport", amount: 3.35, date: "2026-02-11" },
];

function listExpenses() {
  return expenses;
}

function addExpense({ title, category, amount, date }) {
  const item = {
    id: nextId++,
    title,
    category,
    amount: Number(amount),
    date,
  };
  expenses.unshift(item);
  return item;
}

function deleteExpense(id) {
  const idx = expenses.findIndex((e) => e.id === id);
  if (idx === -1) return null;
  return expenses.splice(idx, 1)[0];
}

module.exports = { listExpenses, addExpense, deleteExpense };
