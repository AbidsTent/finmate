import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Chart from "chart.js/auto";

export default function HomePage() {
  const [summary, setSummary] = useState({
    availableBalance: 0,
    subsMonthly: 0,
    totalExpenses: 0,
    investCost: 0,
    totalIncome: 0,
  });

  const [topSpendings, setTopSpendings] = useState([]);

  const categoryChartRef = useRef(null);
  const trendChartRef = useRef(null);
  const categoryChartInstance = useRef(null);
  const trendChartInstance = useRef(null);

  useEffect(() => {
    const loadSummary = async () => {
      try {
        const [expenseRes, investmentRes] = await Promise.all([
          fetch("/api/expenses"),
          fetch("/api/investments"),
        ]);

        const expenses = await expenseRes.json();
        const investments = await investmentRes.json();

        const totalExpenses = expenses.reduce(
          (sum, exp) => sum + Number(exp.amount || 0),
          0
        );

        const subsMonthly = expenses
          .filter((exp) =>
            ["Subscriptions", "Subscription"].includes(exp.category)
          )
          .reduce((sum, exp) => sum + Number(exp.amount || 0), 0);

        const investCost = investments.reduce(
          (sum, inv) => sum + Number(inv.buyPrice || 0) * Number(inv.shares || 0),
          0
        );

        const savedBudget = Number(localStorage.getItem("expenseBudget") || 0);
        const availableBalance = savedBudget - totalExpenses;

        setSummary({
          availableBalance,
          subsMonthly,
          totalExpenses,
          investCost,
          totalIncome: savedBudget,
        });

        const grouped = {};
        for (const exp of expenses) {
          const cat = exp.category || "Misc";
          grouped[cat] = (grouped[cat] || 0) + Number(exp.amount || 0);
        }

        const categoryLabels = Object.keys(grouped);
        const categoryValues = Object.values(grouped);

        const sortedTop = [...expenses]
          .sort((a, b) => Number(b.amount || 0) - Number(a.amount || 0))
          .slice(0, 5);

        setTopSpendings(sortedTop);

        if (categoryChartInstance.current) {
          categoryChartInstance.current.destroy();
        }

        if (trendChartInstance.current) {
          trendChartInstance.current.destroy();
        }

        if (categoryChartRef.current) {
          categoryChartInstance.current = new Chart(categoryChartRef.current, {
            type: "doughnut",
            data: {
              labels: categoryLabels.length ? categoryLabels : ["No Data"],
              datasets: [
                {
                  data: categoryValues.length ? categoryValues : [1],
                  borderWidth: 1,
                },
              ],
            },
            options: {
              plugins: {
                legend: {
                  display: true,
                  labels: {
                    color: "#a9b6d6",
                  },
                },
              },
            },
          });
        }

        if (trendChartRef.current) {
          trendChartInstance.current = new Chart(trendChartRef.current, {
            type: "bar",
            data: {
              labels: ["Income", "Expenses"],
              datasets: [
                {
                  label: "Amount",
                  data: [savedBudget, totalExpenses],
                },
              ],
            },
            options: {
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                x: {
                  ticks: { color: "#a9b6d6" },
                  grid: { color: "rgba(234,240,255,.08)" },
                },
                y: {
                  ticks: { color: "#a9b6d6" },
                  grid: { color: "rgba(234,240,255,.08)" },
                },
              },
            },
          });
        }
      } catch (err) {
        console.error("Failed to load dashboard summary", err);
      }
    };

    loadSummary();

    return () => {
      if (categoryChartInstance.current) categoryChartInstance.current.destroy();
      if (trendChartInstance.current) trendChartInstance.current.destroy();
    };
  }, []);

  return (
    <main className="container">
      <header className="hero">
        <div>
          <h1 id="welcomeTitle">Hello User</h1>
          <p className="muted">
            Here’s your overview report for the selected period.
          </p>
        </div>

        <div className="controls">
          <select className="select" id="rangeSelect">
            <option value="30">Last 30 Days</option>
            <option value="7">Last 7 Days</option>
            <option value="month">This Month</option>
          </select>

          <Link className="btn" to="/expenses">
            + Add Transaction
          </Link>
        </div>
      </header>

      <section className="cards">
        <div className="card">
          <div className="label">Available Balance</div>
          <div className="value" id="availableBalance">
            ${summary.availableBalance.toFixed(2)}
          </div>
          <div className="hint muted">Based on server summary</div>
        </div>

        <div className="card">
          <div className="label">Monthly Subscriptions</div>
          <div className="value" id="subsMonthly">
            ${summary.subsMonthly.toFixed(2)}
          </div>
          <div className="hint muted">Recurring costs</div>
        </div>

        <div className="card">
          <div className="label">Total Expenses</div>
          <div className="value" id="totalExpenses">
            ${summary.totalExpenses.toFixed(2)}
          </div>
          <div className="hint muted">Spending in list</div>
        </div>

        <div className="card">
          <div className="label">Investment Cost Basis</div>
          <div className="value" id="investCost">
            ${summary.investCost.toFixed(2)}
          </div>
          <div className="hint muted">Shares × avg cost</div>
        </div>
      </section>

      <div className="sectionTitle">
        <span>Overview</span>
        <span className="muted small">Last 30 days</span>
      </div>

      <section className="analytics">
        <div className="panelCard">
          <h3>Category Breakdown</h3>
          <div className="chartWrap">
            <canvas ref={categoryChartRef}></canvas>
          </div>
        </div>

        <div className="panelCard">
          <div className="panelHeader">
            <h3>Top Spendings</h3>
            <span className="muted small">This month</span>
          </div>

          <div className="spendList" id="spendList">
            {topSpendings.length === 0 ? (
              <div className="muted">No spending data yet.</div>
            ) : (
              topSpendings.map((item) => (
                <div
                  key={item._id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px 0",
                    borderBottom: "1px solid rgba(234,240,255,.08)",
                  }}
                >
                  <span>{item.title}</span>
                  <span>${Number(item.amount || 0).toFixed(2)}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="panelCard">
          <h3>Income vs Expenses</h3>
          <div className="chartWrap">
            <canvas ref={trendChartRef}></canvas>
          </div>
        </div>
      </section>

      <section className="smartTipsSection">
        <div className="smartTipsInner">
          <div className="panelHeader">
            <h3>Smart Tips</h3>
            <span className="muted small" id="tipsStatus">
              Ready
            </span>
          </div>

          <div className="tipsProgress">
            <div className="tipsProgressTop">
              <span className="muted small">Generating tips</span>
              <span className="tipsPercent" id="tipsPercent">
                100%
              </span>
            </div>

            <div className="tipsBar">
              <div
                className="tipsFill"
                id="tipsFill"
                style={{ width: "100%" }}
              ></div>
            </div>
          </div>

          <div className="tipsList" id="tipsList">
            <div className="muted">
              Review your top spending categories regularly and keep subscription
              costs under control.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}