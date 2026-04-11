import { useEffect, useMemo, useRef, useState } from "react";
import {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} from "../services/expenseApi";
import {
  connectExpenseSocket,
  disconnectExpenseSocket,
} from "../services/expenseSocket";

import { getStoredBudget, getToken, setStoredBudget } from "../utils/storage";

const initialForm = {
  title: "",
  category: "",
  amount: "",
  date: "",
};

function money(n) {
  return `$${Number(n || 0).toFixed(2)}`;
}

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [budgetInput, setBudgetInput] = useState("");
  const [budget, setBudget] = useState(0);

  const [formMsg, setFormMsg] = useState("");
  const [listMsg, setListMsg] = useState("");
  const [liveMsg, setLiveMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const pieCanvasRef = useRef(null);

  useEffect(() => {
    const savedBudget = Number(getStoredBudget());
    if (Number.isFinite(savedBudget) && savedBudget >= 0) {
      setBudget(savedBudget);
      setBudgetInput(savedBudget ? String(savedBudget) : "");
    }

    loadExpenses();
  }, []);

  useEffect(() => {
    const token = getToken();
    const socket = connectExpenseSocket(token);

    if (!socket) return;

    const onExpenseChanged = async (event) => {
      if (event?.action === "added") setLiveMsg("Live update: Expense added");
      if (event?.action === "updated") setLiveMsg("Live update: Expense updated");
      if (event?.action === "deleted") setLiveMsg("Live update: Expense deleted");

      await loadExpenses();

      window.clearTimeout(window.__finmateLiveMsgTimer);
      window.__finmateLiveMsgTimer = window.setTimeout(() => {
        setLiveMsg("");
      }, 6000);
    };

    socket.on("expense:changed", onExpenseChanged);

    return () => {
      socket.off("expense:changed", onExpenseChanged);
      disconnectExpenseSocket();
      window.clearTimeout(window.__finmateLiveMsgTimer);
    };
  }, []);

  useEffect(() => {
    drawPieChart();
  }, [expenses]);

  const totalSpent = useMemo(() => {
    return expenses.reduce((sum, item) => sum + Number(item.amount || 0), 0);
  }, [expenses]);

  const remaining = budget - totalSpent;

  async function loadExpenses() {
    setLoading(true);
    setListMsg("Loading...");

    try {
      const data = await getExpenses();
      const safeData = Array.isArray(data) ? data : [];
      setExpenses(safeData);
      setListMsg(safeData.length ? "" : "No expenses yet. Add your first one!");
    } catch (error) {
      console.error("Failed to load expenses:", error);
      setListMsg("Server error: could not fetch expenses.");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddExpense(payload) {
    setFormMsg("Adding...");

    try {
      await createExpense({
        ...payload,
        amount: Number(payload.amount),
      });

      setFormMsg("Added!");
      setFormData(initialForm);
      await loadExpenses();
    } catch (error) {
      console.error("Failed to add expense:", error);
      setFormMsg("Server error: could not add expense.");
    }
  }

  async function handleDeleteExpense(id) {
    setListMsg("Deleting...");

    try {
      await deleteExpense(id);
      await loadExpenses();
    } catch (error) {
      console.error("Failed to delete expense:", error);
      setListMsg("Server error: could not delete expense.");
    }
  }

  async function handleEditExpense(id) {
    const current = expenses.find((item) => item._id === id);

    if (!current) {
      alert("Expense not found");
      return;
    }

    const title = prompt("Edit item:", current.title ?? "");
    if (title === null) return;

    const category = prompt("Edit category:", current.category ?? "");
    if (category === null) return;

    const amount = prompt("Edit amount:", current.amount ?? "");
    if (amount === null) return;

    const date = prompt("Edit date:", current.date ?? "");
    if (date === null) return;

    try {
      await updateExpense(id, {
        title: title.trim(),
        category: category.trim(),
        amount: Number(amount),
        date,
      });

      await loadExpenses();
    } catch (error) {
      console.error("Failed to update expense:", error);
      alert("Server error while updating expense");
    }
  }

  function handleFormChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    handleAddExpense(formData);
  }

  function handleSaveBudget() {
    const val = Number(budgetInput);

    if (!Number.isFinite(val) || val < 0) {
      alert("Please enter a valid budget (0 or higher).");
      return;
    }

    setStoredBudget(String(val));
    setBudget(val);
    setBudgetInput(String(val));
  }

  function drawPieChart() {
    const canvas = pieCanvasRef.current;
    if (!canvas) return;

    const byCategory = expenses.reduce((acc, item) => {
      const category = item.category || "Other";
      acc[category] = (acc[category] || 0) + Number(item.amount || 0);
      return acc;
    }, {});

    const entries = Object.entries(byCategory).filter(([, value]) => value > 0);
    const total = entries.reduce((sum, [, value]) => sum + value, 0);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cssWidth = 280;
    const cssHeight = 180;
    const dpr = window.devicePixelRatio || 1;

    canvas.style.width = `${cssWidth}px`;
    canvas.style.height = `${cssHeight}px`;
    canvas.width = Math.floor(cssWidth * dpr);
    canvas.height = Math.floor(cssHeight * dpr);

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssWidth, cssHeight);

    if (total <= 0) return;

    const colors = [
      "#27d17f",
      "#60a5fa",
      "#fbbf24",
      "#fb7185",
      "#a78bfa",
      "#34d399",
      "#f472b6",
    ];

    const cx = 95;
    const cy = 90;
    const radius = 65;
    let start = -Math.PI / 2;

    entries.forEach(([, value], index) => {
      const slice = (value / total) * Math.PI * 2;
      const end = start + slice;
      const color = colors[index % colors.length];

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, start, end);
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();

      start = end;
    });
  }

  const categoryLegend = useMemo(() => {
    const byCategory = expenses.reduce((acc, item) => {
      const category = item.category || "Other";
      acc[category] = (acc[category] || 0) + Number(item.amount || 0);
      return acc;
    }, {});

    const entries = Object.entries(byCategory).filter(([, value]) => value > 0);
    const total = entries.reduce((sum, [, value]) => sum + value, 0);

    const colors = [
      "#27d17f",
      "#60a5fa",
      "#fbbf24",
      "#fb7185",
      "#a78bfa",
      "#34d399",
      "#f472b6",
    ];

    return entries.map(([category, value], index) => ({
      category,
      value,
      pct: total ? ((value / total) * 100).toFixed(1) : "0.0",
      color: colors[index % colors.length],
    }));
  }, [expenses]);

  return (
    <main className="container">
      <header className="hero">
        <div>
          <h1 id="welcomeTitle">💳 Expense Manager</h1>
          <p className="muted">Track, edit and control your spending.</p>
        </div>
      </header>

      <section className="cards cards-3">
        <div className="card">
          <div className="label">Total Income</div>
          <div className="value">{money(budget)}</div>
          <div className="hint muted">
            <span className="muted">Set budget:</span>
            <input
              className="budgetInput"
              type="number"
              min="0"
              step="1"
              placeholder="e.g., 1000"
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
            />
            <button
              className="btn btn-secondary"
              type="button"
              onClick={handleSaveBudget}
            >
              Save
            </button>
          </div>
        </div>

        <div className="card">
          <div className="label">Total Spent</div>
          <div className="value">{money(totalSpent)}</div>
          <div className="hint muted">Sum of all expenses</div>
        </div>

        <div className="card">
          <div className="label">Remaining</div>
          <div className="value">{money(remaining)}</div>
          <div className="hint muted">Budget - Spent</div>
        </div>
      </section>

      <section className="grid2">
        <div className="panel">
          <div className="panelTitle">Add Expense</div>

          <form className="form" onSubmit={handleFormSubmit}>
            <label className="field">
              <span className="muted">Category</span>
              <select
                className="select"
                name="category"
                value={formData.category}
                onChange={handleFormChange}
                required
              >
                <option value="">Select category</option>
                <option value="Food">Food</option>
                <option value="Transport">Transport</option>
                <option value="Housing">Housing</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Subscriptions">Subscriptions</option>
                <option value="Misc">Misc</option>
              </select>
            </label>

            <label className="field">
              <span className="muted">Title</span>
              <input
                className="input"
                name="title"
                type="text"
                placeholder="e.g., Groceries"
                value={formData.title}
                onChange={handleFormChange}
                required
              />
            </label>

            <label className="field">
              <span className="muted">Amount</span>
              <input
                className="input"
                name="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="e.g., 55.20"
                value={formData.amount}
                onChange={handleFormChange}
                required
              />
            </label>

            <label className="field">
              <span className="muted">Date</span>
              <input
                className="input"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleFormChange}
                required
              />
            </label>

            <button className="btn" type="submit">
              + Add Expense
            </button>

            <div className="muted" style={{ marginTop: "10px" }}>
              {formMsg}
            </div>
          </form>
        </div>

        <div className="panel">
          <div className="panelTitle">Recent Expenses</div>

          <div className="tableWrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Category</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense) => (
                  <tr key={expense._id}>
                    <td>{expense.title}</td>
                    <td>{expense.category}</td>
                    <td>{money(expense.amount)}</td>
                    <td>{expense.date}</td>
                    <td>
                      <button
                        className="btn edit-expense-btn"
                        type="button"
                        onClick={() => handleEditExpense(expense._id)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-secondary delete-expense-btn"
                        type="button"
                        onClick={() => handleDeleteExpense(expense._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="muted" style={{ marginTop: "10px" }}>
            {loading ? "Loading..." : listMsg}
          </div>
          <div className="muted" style={{ marginTop: "6px" }}>
            {liveMsg}
          </div>
        </div>

        <div className="panel panel-chart">
          <div className="panelTitle">Spending by Category</div>
          <canvas ref={pieCanvasRef} width="280" height="180" />
          <div className="muted" style={{ marginTop: "10px" }}>
            {categoryLegend.length === 0
              ? "Add expenses to see the chart."
              : categoryLegend.map((item) => (
                  <div key={item.category}>
                    <span
                      style={{
                        display: "inline-block",
                        width: "10px",
                        height: "10px",
                        background: item.color,
                        borderRadius: "2px",
                        marginRight: "8px",
                      }}
                    />
                    {item.category} — {money(item.value)} ({item.pct}%)
                  </div>
                ))}
          </div>
        </div>

        <div className="panel panel-chart">
          <div className="panelTitle">Summary</div>
          <div className="muted">
            You are spending against your budget. Track your spending to stay
            within limits and be happy!
          </div>
        </div>
      </section>
    </main>
  );
}
