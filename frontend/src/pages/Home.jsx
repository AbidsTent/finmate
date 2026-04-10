import { useEffect, useState } from "react";
import { getExpenses } from "../services/expenseApi";
import { getInvestments } from "../services/investmentApi";
import { Link } from "react-router";
import { Doughnut, Line } from "react-chartjs-2";
import { getBudgetKey, getUser } from "../utils/storage";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

ChartJS.register(ArcElement, Tooltip, Legend);
export default function Home() {
  const [expenses, setExpenses] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [expenseData, investmentData] = await Promise.all([
          getExpenses(),
          getInvestments(),
        ]);

        setExpenses(expenseData || []);
        setInvestments(investmentData || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard data.");
      }
    }

    loadHomeData();
  }, []);
const iconMap = {
  housing: "🏠",
  rent: "🏠",
  food: "🍔",
  groceries: "🛒",
  transport: "🚗",
  transportation: "🚗",
  subscriptions: "🔁",
  entertainment: "🎮",
  shopping: "🛍️",
  bills: "🧾",
  health: "🩺",
  education: "📚",
  travel: "✈️",
  misc: "🧩",
  other: "🧩",
};

function getCategoryIcon(category) {
  const key = String(category || "other").toLowerCase().trim();
  return iconMap[key] || "💸";
}

  const totalExpenses = expenses.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const subscriptionTotal = expenses
    .filter(
      (item) => String(item.category || "").toLowerCase() === "subscriptions"
    )
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const investmentCost = investments.reduce((sum, item) => {
    const buyPrice = Number(item.buyPrice || 0);
    const shares = Number(item.shares || 0);
    return sum + buyPrice * shares;
  }, 0);
  
const topSpendings = Object.entries(
  expenses.reduce((acc, item) => {
    const category = item.category || "Other";
    acc[category] = (acc[category] || 0) + Number(item.amount || 0);
    return acc;
  }, {})
)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 4);

  const spending = expenses.reduce((acc, item) => {
  const category = String(item.category || "other").toLowerCase();
  acc[category] = (acc[category] || 0) + Number(item.amount || 0);
  return acc;
}, {});

function buildTips(spendingData) {
  const totalSpend =
    Object.values(spendingData).reduce((sum, value) => sum + value, 0) || 1;

  const percent = (value) => Math.round((value / totalSpend) * 100);

  const tips = [];

  if (percent(spendingData.housing || 0) >= 40) {
    tips.push({
      icon: "🏠",
      title: "Housing looks high",
      text: `Housing is ${percent(
        spendingData.housing || 0
      )}% of your spending. Try to keep it around 30–35% if possible.`,
    });
  }

  if (percent(spendingData.food || 0) >= 20) {
    tips.push({
      icon: "🍔",
      title: "Food spend is high",
      text: `Food is ${percent(
        spendingData.food || 0
      )}% of your spending. Meal prep or a weekly cap could help.`,
    });
  }

  if (percent(spendingData.subscriptions || 0) >= 8) {
    tips.push({
      icon: "🔁",
      title: "Trim subscriptions",
      text: `Subscriptions are ${percent(
        spendingData.subscriptions || 0
      )}% of your spending. Canceling one unused plan may save money quickly.`,
    });
  }

  if (tips.length === 0) {
    tips.push({
      icon: "✅",
      title: "Spending looks balanced",
      text: "Nice distribution across categories. Keep tracking consistently.",
    });
  }

  return tips.slice(0, 3);
}

const smartTips = buildTips(spending);

const BUDGET_KEY = "finmate_budget";

function getBudget() {
  const raw = localStorage.getItem(getBudgetKey());
  const num = Number(raw);
  if (!Number.isFinite(num) || num < 0) {
    // Set a default budget if none exists
    localStorage.setItem(getBudgetKey(), "0");
    return 0;
  }
  return num;
}

const budget = getBudget();
const availableBalance = budget - totalExpenses;

const categoryTotals = expenses.reduce((acc, item) => {
  const category = item.category || "Other";
  acc[category] = (acc[category] || 0) + Number(item.amount || 0);
  return acc;
}, {});

const categoryChartData = {
  labels: Object.keys(categoryTotals),
  datasets: [
    {
      data: Object.values(categoryTotals),
      backgroundColor: [
        "#27d17f",
        "#60a5fa",
        "#fbbf24",
        "#fb7185",
        "#a78bfa",
        "#34d399",
      ],
      borderWidth: 0,
    },
  ],
};

const categoryChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: "#eaf0ff",
      },
    },
  },
  cutout: "65%",
};

const expensesByDate = expenses.reduce((acc, item) => {
  const date = item.date || "Unknown";
  acc[date] = (acc[date] || 0) + Number(item.amount || 0);
  return acc;
}, {});

const trendLabels = Object.keys(expensesByDate).sort();
const expenseValues = trendLabels.map((date) => expensesByDate[date]);
const incomeValues = trendLabels.map(() => budget);

const trendChartData = {
  labels: trendLabels.length ? trendLabels : ["No data"],
  datasets: [
    {
      label: "Income",
      data: incomeValues.length ? incomeValues : [0],
      borderColor: "#60a5fa",
      backgroundColor: "rgba(96,165,250,0.12)",
      tension: 0.35,
      pointRadius: 2,
    },
    {
      label: "Expenses",
      data: expenseValues.length ? expenseValues : [0],
      borderColor: "#27d17f",
      backgroundColor: "rgba(39,209,127,0.12)",
      tension: 0.35,
      pointRadius: 3,
    },
  ],
};

const trendChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        color: "#eaf0ff",
      },
    },
  },
  scales: {
    x: {
      ticks: { color: "#a9b6d6" },
      grid: { color: "rgba(255,255,255,0.06)" },
    },
    y: {
      ticks: { color: "#a9b6d6" },
      grid: { color: "rgba(255,255,255,0.06)" },
    },
  },
};

  return (
    <>
      <header className="hero">
        <div>
          <h1 id="welcomeTitle">Hello {getUser()?.name || "User"}</h1>
          <p className="muted">
            Here’s your overview report for the selected period.
          </p>
        </div>

        <div className="controls">
          <select className="select" defaultValue="30">
            <option value="30">Last 30 Days</option>
            <option value="7">Last 7 Days</option>
            <option value="month">This Month</option>
          </select>

          <Link to="/expenses" className="btn">
  + Add Transaction
</Link>
        </div>
      </header>

      {error && (
        <div className="error muted" style={{ display: "block" }}>
          {error}
        </div>
      )}

      <section className="cards">
        <div className="card">
          <div className="label">Available Balance</div>
          <div className="value">${availableBalance.toFixed(2)}</div>
<div className="hint muted">Based on saved budget</div>
        </div>

        <div className="card">
          <div className="label">Monthly Subscriptions</div>
          <div className="value">${subscriptionTotal.toFixed(2)}</div>
          <div className="hint muted">Recurring costs</div>
        </div>

        <div className="card">
          <div className="label">Total Expenses</div>
          <div className="value">${totalExpenses.toFixed(2)}</div>
          <div className="hint muted">Spending in list</div>
        </div>

        <div className="card">
          <div className="label">Investment Cost Basis</div>
          <div className="value">${investmentCost.toFixed(2)}</div>
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
            <div className="chartWrap">
  {Object.keys(categoryTotals).length ? (
    <Doughnut data={categoryChartData} options={categoryChartOptions} />
  ) : (
    <p className="muted">No category data yet.</p>
  )}
</div>
          </div>
        </div>

        <div className="panelCard">
          <div className="panelHeader">
            <h3>Top Spendings</h3>
            <span className="muted small">This month</span>
          </div>
          <div className="spendList">
  {topSpendings.length ? (
    topSpendings.map(([category, amount]) => (
      <div className="spendItem" key={category}>
        <div className="spendLeft">
            <div className="spendIcon">{getCategoryIcon(category)}</div>
          <div>
            <div className="spendTitle">{category}</div>
            <div className="muted small">Total spending</div>
          </div>
        </div>
        <div className="spendAmount">${amount.toFixed(2)}</div>
      </div>
    ))
  ) : (
    <p className="muted">No spending data yet.</p>
  )}
</div>
        </div>

        <div className="panelCard">
          <h3>Income vs Expenses</h3>
          <div className="chartWrap">
            <div className="chartWrap">
  <Line data={trendChartData} options={trendChartOptions} />
</div>
          </div>
        </div>
      </section>

      <section className="smartTipsSection">
        <div className="smartTipsInner">
          <div className="panelHeader">
            <h3>Smart Tips</h3>
            <span className="muted small">Coming next</span>
          </div>

          <div className="tipsList">
  {smartTips.map((tip, index) => (
    <div className="tipItem show" key={index}>
      <div className="tipIcon">{tip.icon}</div>
      <div>
        <div className="tipTitle">{tip.title}</div>
        <div className="muted small">{tip.text}</div>
      </div>
    </div>
  ))}
</div>
        </div>
      
      </section>
    </>
  );
}