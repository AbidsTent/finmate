import { useEffect, useState } from "react";
import {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} from "../services/expenseApi";
import { getBudgetKey } from "../utils/storage";

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "",
    date: "",
  });
  const [budget, setBudget] = useState(0);

  useEffect(() => {
    loadExpenses();
    const raw = localStorage.getItem(getBudgetKey());
    setBudget(Number(raw) || 0);
  }, []);

  async function loadExpenses() {
    const data = await getExpenses();
    setExpenses(data || []);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await createExpense(form);
    setForm({ title: "", amount: "", category: "", date: "" });
    loadExpenses();
  }

  async function handleDelete(id) {
    await deleteExpense(id);
    loadExpenses();
  }

  async function handleEdit(item) {
    const title = prompt("Edit title:", item.title);
    const category = prompt("Edit category:", item.category);
    const amount = prompt("Edit amount:", item.amount);
    const date = prompt("Edit date:", item.date);

    await updateExpense(item._id, { title, category, amount, date });
    loadExpenses();
  }

  function saveBudget() {
    localStorage.setItem(getBudgetKey(), String(budget));
  }

  const totalSpent = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);
  const remaining = budget - totalSpent;

  return (
    <section>
      <header className="hero">
        <div>
          <h1>💳 Expense Manager</h1>
          <p className="muted">Track, edit and control your spending.</p>
        </div>
      </header>

      <section className="cards cards-3">
        <div className="card">
          <div className="label">Total Income</div>
          <div className="value">${budget.toFixed(2)}</div>
          <div className="hint muted">
            <span className="muted">Set budget:</span>
            <input
              className="input"
              type="number"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
            />
            <button className="btn btn-secondary" type="button" onClick={saveBudget}>
              Save
            </button>
          </div>
        </div>

        <div className="card">
          <div className="label">Total Spent</div>
          <div className="value">${totalSpent.toFixed(2)}</div>
        </div>

        <div className="card">
          <div className="label">Remaining</div>
          <div className="value">${remaining.toFixed(2)}</div>
        </div>
      </section>

      <section className="grid2">
        <div className="panel">
          <div className="panelTitle">Add Expense</div>
          <form className="form" onSubmit={handleSubmit}>
            <label className="field">
              <span className="muted">Category</span>
              <select className="select" name="category" value={form.category} onChange={handleChange} required>
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
              <input className="input" name="title" value={form.title} onChange={handleChange} required />
            </label>

            <label className="field">
              <span className="muted">Amount</span>
              <input className="input" type="number" name="amount" value={form.amount} onChange={handleChange} required />
            </label>

            <label className="field">
              <span className="muted">Date</span>
              <input className="input" type="date" name="date" value={form.date} onChange={handleChange} required />
            </label>

            <button className="btn" type="submit">+ Add Expense</button>
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
                {expenses.map((e) => (
                  <tr key={e._id}>
                    <td>{e.title}</td>
                    <td>{e.category}</td>
                    <td>${Number(e.amount).toFixed(2)}</td>
                    <td>{e.date}</td>
                    <td>
                      <button className="btn" onClick={() => handleEdit(e)}>Edit</button>{" "}
                      <button className="btn btn-secondary" onClick={() => handleDelete(e._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </section>
  );
}