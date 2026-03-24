import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";

export default function ExpensePage() {
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null);
  const [budget, setBudget] = useState(() => {
    return Number(localStorage.getItem("expenseBudget") || 0);
  });
  const [budgetInput, setBudgetInput] = useState("");

  const pieCanvasRef = useRef(null);
  const pieChartRef = useRef(null);

  const fetchExpenses = async () => {
    try {
      const res = await fetch("/api/expenses");
      const data = await res.json();
      setExpenses(data);
    } catch (err) {
      console.error("Failed to fetch expenses", err);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    const grouped = {};

    expenses.forEach((exp) => {
      const category = exp.category || "Misc";
      grouped[category] = (grouped[category] || 0) + Number(exp.amount || 0);
    });

    const labels = Object.keys(grouped);
    const values = Object.values(grouped);

    if (pieChartRef.current) {
      pieChartRef.current.destroy();
    }

    if (pieCanvasRef.current) {
      pieChartRef.current = new Chart(pieCanvasRef.current, {
        type: "doughnut",
        data: {
          labels: labels.length ? labels : ["No Data"],
          datasets: [
            {
              data: values.length ? values : [1],
              borderWidth: 2,
            },
          ],
        },
        options: {
          cutout: "64%",
          plugins: {
            legend: {
              display: true,
              labels: {
                color: "#eaf0ff",
              },
            },
          },
        },
      });
    }

    return () => {
      if (pieChartRef.current) {
        pieChartRef.current.destroy();
      }
    };
  }, [expenses]);

  const handleEdit = (expense) => {
    setEditingExpense(expense);
  };

  const deleteExpense = async (id) => {
    try {
      await fetch(`/api/expenses/${id}`, {
        method: "DELETE",
      });
      fetchExpenses();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const totalSpent = expenses.reduce(
    (sum, exp) => sum + Number(exp.amount || 0),
    0
  );

  const remaining = budget - totalSpent;

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
          <div className="value" id="totalBudget">${budget.toFixed(2)}</div>
          <div className="hint muted">
            <span className="muted">Set budget:</span>
            <input
              id="budgetInput"
              className="budgetInput"
              type="number"
              min="0"
              step="1"
              placeholder="e.g., 1000"
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
            />
            <button
              id="saveBudgetBtn"
              className="btn btn-secondary"
              type="button"
              onClick={() => {
                const nextBudget = Number(budgetInput || 0);
                setBudget(nextBudget);
                localStorage.setItem("expenseBudget", String(nextBudget));
                setBudgetInput("");
              }}
            >
              Save
            </button>
          </div>
        </div>

        <div className="card">
          <div className="label">Total Spent</div>
          <div className="value" id="totalSpent">${totalSpent.toFixed(2)}</div>
          <div className="hint muted">Sum of all expenses</div>
        </div>

        <div className="card">
          <div className="label">Remaining</div>
          <div className="value" id="remainingBudget">
            ${remaining.toFixed(2)}
          </div>
          <div className="hint muted">Budget - Spent</div>
        </div>
      </section>

      <section className="grid2">
        <div className="panel">
          <div className="panelTitle">Add Expense</div>

          <form
            key={editingExpense?._id || "new"}
            className="form"
            onSubmit={async (e) => {
              e.preventDefault();

              try {
                const formData = new FormData(e.target);

                const expenseData = {
                  title: formData.get("title"),
                  category: formData.get("category"),
                  amount: formData.get("amount"),
                  date: formData.get("date"),
                };

                if (editingExpense) {
                  await fetch(`/api/expenses/${editingExpense._id}`, {
                    method: "PUT",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(expenseData),
                  });
                } else {
                  await fetch("/api/expenses", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(expenseData),
                  });
                }

                setEditingExpense(null);
                e.target.reset();
                fetchExpenses();
              } catch (err) {
                console.error("Submit failed", err);
              }
            }}
          >
            <label className="field">
              <span className="muted">Category</span>
              <select
                className="select"
                id="category"
                name="category"
                defaultValue={editingExpense?.category || ""}
                required
              >
                <option value="">Select category</option>
                <option>Food</option>
                <option>Transport</option>
                <option>Housing</option>
                <option>Entertainment</option>
                <option>Subscriptions</option>
                <option>Misc</option>
              </select>
            </label>

            <label className="field">
              <span className="muted">Title</span>
              <input
                className="input"
                id="title"
                name="title"
                type="text"
                defaultValue={editingExpense?.title || ""}
                placeholder="e.g., Groceries"
                required
              />
            </label>

            <label className="field">
              <span className="muted">Amount</span>
              <input
                className="input"
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                min="0.01"
                defaultValue={editingExpense?.amount || ""}
                placeholder="e.g., 55.20"
                required
              />
            </label>

            <label className="field">
              <span className="muted">Date</span>
              <input
                className="input"
                id="date"
                name="date"
                type="date"
                defaultValue={editingExpense?.date?.split("T")[0] || ""}
                required
              />
            </label>

            <button className="btn" type="submit">
              {editingExpense ? "Update Expense" : "+ Add Expense"}
            </button>

            {editingExpense && (
              <button
                type="button"
                className="btn btn-secondary"
                style={{ marginTop: "10px" }}
                onClick={() => setEditingExpense(null)}
              >
                Cancel Edit
              </button>
            )}

            <div
              id="formMsg"
              className="muted"
              style={{ marginTop: "10px" }}
            ></div>
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
                {expenses.length === 0 ? (
                  <tr>
                    <td colSpan="5">No expenses yet.</td>
                  </tr>
                ) : (
                  expenses.map((exp) => (
                    <tr key={exp._id}>
                      <td>{exp.title}</td>
                      <td>{exp.category}</td>
                      <td>${Number(exp.amount || 0).toFixed(2)}</td>
                      <td>{new Date(exp.date).toISOString().split("T")[0]}</td>
                      <td>
                        <button
                          type="button"
                          onClick={() => handleEdit(exp)}
                          style={{ marginRight: "8px" }}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteExpense(exp._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div
            id="listMsg"
            className="muted"
            style={{ marginTop: "10px" }}
          ></div>
        </div>

        <div className="panel panel-chart">
          <div className="panelTitle">Spending by Category</div>
          <canvas ref={pieCanvasRef} width="280" height="180"></canvas>
          <div
            className="muted"
            id="pieLegend"
            style={{ marginTop: "10px" }}
          ></div>
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