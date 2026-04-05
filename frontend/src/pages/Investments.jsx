import { useEffect, useState } from "react";
import {
  getInvestments,
  createInvestment,
  updateInvestment,
  deleteInvestment,
} from "../services/investmentApi";

export default function Investments() {
  const [investments, setInvestments] = useState([]);
  const [form, setForm] = useState({
    ticker: "",
    shares: "",
    buyPrice: "",
    current: "",
    buyDate: "",
  });

  useEffect(() => {
    loadInvestments();
  }, []);

  async function loadInvestments() {
    const data = await getInvestments();
    setInvestments(data || []);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await createInvestment(form);
    setForm({
      ticker: "",
      shares: "",
      buyPrice: "",
      current: "",
      buyDate: "",
    });
    loadInvestments();
  }

  async function handleDelete(id) {
    await deleteInvestment(id);
    loadInvestments();
  }

  async function handleEdit(item) {
    const ticker = prompt("Ticker:", item.ticker);
    const shares = prompt("Shares:", item.shares);
    const buyPrice = prompt("Buy Price:", item.buyPrice);
    const current = prompt("Current Price:", item.current);
    const buyDate = prompt("Buy Date:", item.buyDate);

    await updateInvestment(item._id, {
      ticker,
      shares,
      buyPrice,
      current,
      buyDate,
    });

    loadInvestments();
  }

  return (
    <section>
      <header className="hero">
        <div>
          <h1>Investments</h1>
          <p className="muted">Track and manage your portfolio.</p>
        </div>
      </header>

      <div className="panel">
        <div className="panelTitle">Add Investment</div>
        <form className="form" onSubmit={handleSubmit}>
          <label className="field">
            <span className="muted">Ticker</span>
            <input className="input" name="ticker" value={form.ticker} onChange={handleChange} required />
          </label>

          <label className="field">
            <span className="muted">Shares</span>
            <input className="input" type="number" name="shares" value={form.shares} onChange={handleChange} required />
          </label>

          <label className="field">
            <span className="muted">Buy Price</span>
            <input className="input" type="number" name="buyPrice" value={form.buyPrice} onChange={handleChange} required />
          </label>

          <label className="field">
            <span className="muted">Current Price</span>
            <input className="input" type="number" name="current" value={form.current} onChange={handleChange} />
          </label>

          <label className="field">
            <span className="muted">Buy Date</span>
            <input className="input" type="date" name="buyDate" value={form.buyDate} onChange={handleChange} />
          </label>

          <button className="btn" type="submit">+ Add Investment</button>
        </form>
      </div>

      <div className="panel">
        <div className="panelTitle">Portfolio</div>
        <div className="tableWrap">
          <table className="table">
            <thead>
              <tr>
                <th>Ticker</th>
                <th>Shares</th>
                <th>Buy Price</th>
                <th>Current</th>
                <th>Buy Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {investments.map((item) => (
                <tr key={item._id}>
                  <td>{item.ticker}</td>
                  <td>{item.shares}</td>
                  <td>${Number(item.buyPrice).toFixed(2)}</td>
                  <td>${Number(item.current).toFixed(2)}</td>
                  <td>{item.buyDate}</td>
                  <td>
                    <button className="btn" onClick={() => handleEdit(item)}>Edit</button>{" "}
                    <button className="btn btn-secondary" onClick={() => handleDelete(item._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}