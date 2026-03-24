import { useEffect, useMemo, useState } from "react";

export default function InvestmentPage() {
  const [investments, setInvestments] = useState([]);
  const [editingInvestment, setEditingInvestment] = useState(null);

  const fetchInvestments = async () => {
    try {
      const res = await fetch("/api/investments");
      const data = await res.json();
      setInvestments(data);
    } catch (err) {
      console.error("Failed to fetch investments", err);
    }
  };

  useEffect(() => {
    fetchInvestments();
  }, []);

  const handleEdit = (investment) => {
    setEditingInvestment(investment);
  };

  const deleteInvestment = async (id) => {
    try {
      await fetch(`/api/investments/${id}`, {
        method: "DELETE",
      });
      fetchInvestments();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const totals = useMemo(() => {
    const cost = investments.reduce(
      (sum, inv) => sum + Number(inv.buyPrice || 0) * Number(inv.shares || 0),
      0
    );

    const market = investments.reduce(
      (sum, inv) => sum + Number(inv.current || 0) * Number(inv.shares || 0),
      0
    );

    const pl = market - cost;

    return { cost, market, pl };
  }, [investments]);

  const costPercent =
    totals.market > 0 ? Math.min((totals.cost / totals.market) * 100, 100) : 0;
  const marketPercent = totals.market > 0 ? 100 : 0;

  const chartPoints = useMemo(() => {
    const start = totals.cost || 0;
    const end = totals.market || 0;

    const vals = [
      start,
      start + (end - start) * 0.08,
      start + (end - start) * 0.03,
      start + (end - start) * 0.12,
      start + (end - start) * 0.06,
      start + (end - start) * 0.2,
      start + (end - start) * 0.15,
      start + (end - start) * 0.28,
      start + (end - start) * 0.24,
      start + (end - start) * 0.4,
      start + (end - start) * 0.33,
      start + (end - start) * 0.5,
      start + (end - start) * 0.62,
      start + (end - start) * 0.56,
      end,
    ];

    const minY = Math.min(start, end, ...vals);
    const maxY = Math.max(start, end, ...vals);
    const range = maxY - minY || 1;

    const width = 900;
    const height = 320;
    const leftPad = 40;
    const topPad = 20;
    const usableW = width - 80;
    const usableH = height - 60;

    const toPoints = (arr) =>
      arr
        .map((v, i) => {
          const x = leftPad + (i / (arr.length - 1)) * usableW;
          const y = topPad + (1 - (v - minY) / range) * usableH;
          return `${x},${y}`;
        })
        .join(" ");

    const costLine = Array(vals.length).fill(start);

    return {
      marketPolyline: toPoints(vals),
      costPolyline: toPoints(costLine),
      minY,
      maxY,
    };
  }, [totals.cost, totals.market]);

  return (
    <main className="container">
      <header className="hero invest-hero">
        <div>
          <h1>Investments</h1>
        </div>
      </header>

      <section className="invest-grid">
        <section className="card panel">
          <div className="panel-head">
            <h2>Portfolio</h2>
            <button
              className="iconBtn"
              type="button"
              aria-label="Add Investment"
              onClick={() => setEditingInvestment({})}
            >
              +
            </button>
          </div>

          <div className="summary">
            <div>
              <span className="muted">Cost</span>{" "}
              <strong id="costBasis">${totals.cost.toFixed(2)}</strong>
            </div>
            <div>
              <span className="muted">Market</span>{" "}
              <strong id="marketValue">${totals.market.toFixed(2)}</strong>
            </div>
            <div>
              <span className="muted">P/L</span>{" "}
              <strong id="plValue">${totals.pl.toFixed(2)}</strong>
            </div>
          </div>

          <div className="miniBars">
            <div className="barRow">
              <span className="muted small">Cost</span>
              <div className="barTrack">
                <div
                  className="barFill"
                  id="costBar"
                  style={{ width: `${costPercent}%` }}
                ></div>
              </div>
            </div>
            <div className="barRow">
              <span className="muted small">Market</span>
              <div className="barTrack">
                <div
                  className="barFill"
                  id="marketBar"
                  style={{ width: `${marketPercent}%` }}
                ></div>
              </div>
            </div>
          </div>

          {(editingInvestment !== null) && (
            <form
              key={editingInvestment?._id || "new"}
              className="form"
              style={{ marginBottom: "20px" }}
              onSubmit={async (e) => {
                e.preventDefault();

                try {
                  const formData = new FormData(e.target);

                  const investmentData = {
                    ticker: formData.get("ticker"),
                    buyPrice: Number(formData.get("buyPrice")),
                    current: Number(formData.get("current")),
                    shares: Number(formData.get("shares")),
                    buyDate: formData.get("buyDate"),
                  };

                  if (editingInvestment?._id) {
                    await fetch(`/api/investments/${editingInvestment._id}`, {
                      method: "PUT",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify(investmentData),
                    });
                  } else {
                    await fetch("/api/investments", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify(investmentData),
                    });
                  }

                  setEditingInvestment(null);
                  e.target.reset();
                  fetchInvestments();
                } catch (err) {
                  console.error("Submit failed", err);
                }
              }}
            >
              <label className="field">
                <span className="muted">Ticker</span>
                <input
                  className="input"
                  name="ticker"
                  placeholder="AAPL"
                  defaultValue={editingInvestment?.ticker || ""}
                  required
                />
              </label>

              <label className="field">
                <span className="muted">Buy Price</span>
                <input
                  className="input"
                  name="buyPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={editingInvestment?.buyPrice || ""}
                  required
                />
              </label>

              <label className="field">
                <span className="muted">Current Price</span>
                <input
                  className="input"
                  name="current"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={editingInvestment?.current || ""}
                  required
                />
              </label>

              <label className="field">
                <span className="muted">Shares</span>
                <input
                  className="input"
                  name="shares"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={editingInvestment?.shares || ""}
                  required
                />
              </label>

              <label className="field">
                <span className="muted">Buy Date</span>
                <input
                  className="input"
                  name="buyDate"
                  type="date"
                  defaultValue={editingInvestment?.buyDate || ""}
                />
              </label>

              <button className="btn" type="submit">
                {editingInvestment?._id ? "Update Investment" : "+ Add Investment"}
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                style={{ marginTop: "10px" }}
                onClick={() => setEditingInvestment(null)}
              >
                Cancel
              </button>
            </form>
          )}

          <div className="tableWrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Ticker</th>
                  <th>Buy</th>
                  <th>Now</th>
                  <th>Shares</th>
                  <th>Value</th>
                  <th>P/L %</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody id="portfolioBody">
                {investments.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="muted">
                      No investments yet.
                    </td>
                  </tr>
                ) : (
                  investments.map((inv) => {
                    const buy = Number(inv.buyPrice || 0);
                    const current = Number(inv.current || 0);
                    const shares = Number(inv.shares || 0);
                    const value = current * shares;
                    const plPercent =
                      buy > 0 ? (((current - buy) / buy) * 100).toFixed(2) : "0.00";

                    return (
                      <tr key={inv._id}>
                        <td>{inv.ticker}</td>
                        <td>${buy.toFixed(2)}</td>
                        <td>${current.toFixed(2)}</td>
                        <td>{shares}</td>
                        <td>${value.toFixed(2)}</td>
                        <td>{plPercent}%</td>
                        <td style={{ textAlign: "right" }}>
                          <button
                            type="button"
                            onClick={() => handleEdit(inv)}
                            style={{ marginRight: "8px" }}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteInvestment(inv._id)}
                          >
                            ×
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="card panel">
          <div className="panel-head">
            <h2>Watchlist</h2>
            <span className="muted small" id="watchCount">0</span>
            <button
              className="iconBtn"
              type="button"
              aria-label="Add Ticker"
            >
              +
            </button>
          </div>

          <div className="tableWrap">
            <table className="table">
              <thead>
                <tr>
                  <th>Ticker</th>
                  <th>Price</th>
                  <th style={{ textAlign: "right" }}>Remove</th>
                </tr>
              </thead>
              <tbody id="watchlistBody">
                <tr>
                  <td colSpan="3" className="muted">
                    No watchlist items yet.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="card panel">
          <div className="panel-head chartHead">
            <div>
              <h2>Portfolio Performance</h2>
              <span className="muted small">Cost Basis vs Current Value</span>
            </div>

            <div className="rangeTabs" id="chartRangeTabs">
              <button className="rangeTab active" data-range="1D">1 Day</button>
              <button className="rangeTab" data-range="1W">1 Week</button>
              <button className="rangeTab" data-range="1M">1 Month</button>
              <button className="rangeTab" data-range="1Y">1 Year</button>
            </div>
          </div>

          <div className="chartSurface">
            <svg
              id="portfolioChart"
              className="portfolioChart"
              viewBox="0 0 900 320"
            >
              <g id="chartGridLines">
                <line x1="40" y1="40" x2="860" y2="40" stroke="rgba(234,240,255,.08)" />
                <line x1="40" y1="120" x2="860" y2="120" stroke="rgba(234,240,255,.08)" />
                <line x1="40" y1="200" x2="860" y2="200" stroke="rgba(234,240,255,.08)" />
                <line x1="40" y1="280" x2="860" y2="280" stroke="rgba(234,240,255,.08)" />
              </g>

              <polyline
                id="costPolyline"
                className="chartPolyline chartPolylineCost"
                points={chartPoints.costPolyline}
              ></polyline>

              <polyline
                id="marketPolyline"
                className="chartPolyline chartPolylineMarket"
                points={chartPoints.marketPolyline}
              ></polyline>
            </svg>

            <div id="chartTooltip" className="chartTooltip"></div>
          </div>

          <div className="chartAxisLabels" id="chartAxisLabels">
            <span>Feb 5</span>
            <span>Feb 14</span>
            <span>Feb 24</span>
            <span>Mar 6</span>
          </div>

          <div className="chartStats">
            <div>
              <span className="muted small">Range Start</span>{" "}
              <strong id="rangeStartValue">${totals.cost.toFixed(2)}</strong>
            </div>
            <div>
              <span className="muted small">Range End</span>{" "}
              <strong id="rangeEndValue">${totals.market.toFixed(2)}</strong>
            </div>
            <div>
              <span className="muted small">Change</span>{" "}
              <strong id="rangeChangeValue">${(totals.market - totals.cost).toFixed(2)}</strong>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}