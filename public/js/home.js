let categoryChart = null;
let trendChart = null;

const BUDGET_KEY = "finmate_budget";
function updateSummaryCards(expenses) {
  const availableEl = document.getElementById("availableBalance");
  const subsEl = document.getElementById("subsMonthly");
  const totalEl = document.getElementById("totalExpenses");

  const total = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0);

  const subs = expenses
    .filter((e) => String(e.category || "").toLowerCase() === "subscriptions")
    .reduce((sum, e) => sum + Number(e.amount || 0), 0);

  const budget = getBudget();         // income (from expense page localStorage)
  const available = budget - total;   // balance

  if (totalEl) totalEl.textContent = money(total);
  if (subsEl) subsEl.textContent = money(subs);

  // show balance even if budget is 0
  if (availableEl) availableEl.textContent = money(available);
}


async function fetchExpenses() {
  try {
    const res = await fetch("/api/expenses");
    if (!res.ok) throw new Error();
    return await res.json();
  } catch {
    return [];
  }
}

function money(n) {
  return `$${Number(n || 0).toFixed(2)}`;
}

function getBudget() {
  const raw = localStorage.getItem(BUDGET_KEY);
  const num = Number(raw);
  return Number.isFinite(num) && num >= 0 ? num : 0;
}
function parseISODate(s) {
  // expects "YYYY-MM-DD"
  if (!s) return null;
  const [y, m, d] = s.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d); // local time, avoids UTC shifting bugs
}

function startOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function filterExpensesByRange(expenses, rangeValue) {
  const today = startOfToday();

  // keep only expenses with valid dates
  const withDates = expenses
    .map(e => ({ ...e, _dateObj: parseISODate(e.date) }))
    .filter(e => e._dateObj);

  if (rangeValue === "month") {
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    return withDates.filter(e => e._dateObj >= start && e._dateObj <= today);
  }

  const days = Number(rangeValue || 30);
  const start = new Date(today);
  start.setDate(start.getDate() - (days - 1)); // include today

  return withDates.filter(e => e._dateObj >= start && e._dateObj <= today);
}

async function fetchSummary() {
  const res = await fetch("/api/summary");
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to load summary");
  return data;
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (el) el.textContent = value;
}

document.addEventListener("DOMContentLoaded", async () => {
  window.scrollTo(0, 0);
  const rangeSelect = document.getElementById("rangeSelect");

  const allExpenses = await fetchExpenses();

  function render(rangeVal) {
    const filtered = filterExpensesByRange(allExpenses, rangeVal);

    updateSummaryCards(filtered);
    initCategoryChart(filtered);
    initTrendChart(filtered);
    renderSpendings(filtered);
    initSmartTips(filtered);
  }

  // initial render
  render(rangeSelect?.value || "30");

  // re-render when user changes range
  rangeSelect?.addEventListener("change", () => {
    render(rangeSelect.value);
  });

  // keep your chart resize fix
  window.addEventListener("load", () => {
    requestAnimationFrame(() => {
      categoryChart?.update();
      trendChart?.update();
    });
  });
});



function initCategoryChart(expenses) {
  const el = document.getElementById("categoryChart");
  if (!el) return;
  if (categoryChart) categoryChart.destroy();

  const byCategory = {};

  expenses.forEach(e => {
    const cat = e.category || "Other";
    byCategory[cat] = (byCategory[cat] || 0) + Number(e.amount || 0);
  });

  const labels = Object.keys(byCategory);
  const data = Object.values(byCategory);

  categoryChart = new Chart(el, {
    type: "doughnut",
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: [
          "#27d17f",
          "#60a5fa",
          "#fbbf24",
          "#fb7185",
          "#a78bfa",
          "#34d399"
        ],
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "65%",
      plugins: {
        legend: { labels: { color: "#eaf0ff" } }
      }
    }
  });
}


function initTrendChart(expenses) {
  const el = document.getElementById("trendChart");
  if (!el) return;
  if (trendChart) trendChart.destroy();

  // group expenses by date
  const byDate = {};
  for (const e of expenses) {
    const d = e.date || "Unknown";
    byDate[d] = (byDate[d] || 0) + Number(e.amount || 0);
  }

  const labels = Object.keys(byDate).sort();
  const expenseValues = labels.map(d => byDate[d]);

  // income = your saved budget (localStorage)
  const budget = getBudget();
  const incomeValues = labels.map(() => budget);

  trendChart = new Chart(el, {
    type: "line",
    data: {
      labels: labels.length ? labels : ["No data"],
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
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { labels: { color: "#eaf0ff" } } },
      scales: {
        x: { ticks: { color: "#a9b6d6" }, grid: { color: "rgba(255,255,255,0.06)" } },
        y: { ticks: { color: "#a9b6d6" }, grid: { color: "rgba(255,255,255,0.06)" } },
      },
    },
  });
}




// ===== Smart Tips (now accepts real category totals) =====
function initSmartTips(expenses) {
  const tipsStatus = document.getElementById("tipsStatus");
  const tipsPercent = document.getElementById("tipsPercent");
  const tipsFill = document.getElementById("tipsFill");
  const tipsList = document.getElementById("tipsList");
  if (!tipsStatus || !tipsPercent || !tipsFill || !tipsList) return;

  const spending = {};
  for (const e of expenses) {
    const cat = String(e.category || "Other").toLowerCase();
    spending[cat] = (spending[cat] || 0) + Number(e.amount || 0);
  }

  const tips = buildTips({
    rent: spending.housing || 0,
    food: spending.food || 0,
    subscriptions: spending.subscriptions || 0,
    investments: spending.investments || 0,
  });

  let p = 0;
  const timer = setInterval(() => {
    p += Math.floor(Math.random() * 7) + 3;
    if (p >= 100) p = 100;

    tipsPercent.textContent = `${p}%`;
    tipsFill.style.width = `${p}%`;

    if (p === 100) {
      clearInterval(timer);
      renderTips(tipsList, tips);
      revealTips(tipsList);
    }
  }, 70);
}



function buildTips(spending) {
  const totalSpend = Object.values(spending).reduce((a, b) => a + b, 0) || 1;
  const pct = (x) => Math.round((x / totalSpend) * 100);

  const tips = [];

  if (pct(spending.rent) >= 40) {
    tips.push({
      icon: "🏠",
      title: "Housing looks high",
      text: `Housing is ${pct(spending.rent)}% of your spending. Target ~30–35% if possible.`,
    });
  }

  if (pct(spending.food) >= 20) {
    tips.push({
      icon: "🍔",
      title: "Food spend is high",
      text: `Food is ${pct(spending.food)}%. Try meal prep twice a week or set a weekly cap.`,
    });
  }

  if (pct(spending.subscriptions) >= 8) {
    tips.push({
      icon: "🔁",
      title: "Trim subscriptions",
      text: `Subscriptions are ${pct(spending.subscriptions)}%. Cancel 1 unused plan to save quickly.`,
    });
  }

  if (tips.length === 0) {
    tips.push({
      icon: "✅",
      title: "Spending looks balanced",
      text: "Nice distribution across categories. Keep going — aim to increase savings slowly.",
    });
  }

  return tips.slice(0, 3);
}
function renderSpendings(expenses) {
  const container = document.getElementById("spendList");
  if (!container) return;

  const byCategory = {};

  expenses.forEach(e => {
    const cat = e.category || "Other";
    byCategory[cat] =
      (byCategory[cat] || 0) + Number(e.amount || 0);
  });

  const sorted = Object.entries(byCategory)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4); // 👈 TOP 4 ONLY

  container.innerHTML = sorted.map(([cat, val]) => `
    <div class="spendItem">
      <div class="spendLeft">
        <div class="spendIcon">💸</div>
        <div>
          <div class="spendTitle">${cat}</div>
          <div class="muted small">Total spending</div>
        </div>
      </div>
      <div class="spendAmount">$${val.toFixed(2)}</div>
    </div>
  `).join("");
}


function renderTips(container, tips) {
  container.innerHTML = tips
    .map(
      (t) => `
      <div class="tipItem">
        <div class="tipIcon">${t.icon}</div>
        <div>
          <div class="tipTitle">${t.title}</div>
          <div class="muted small">${t.text}</div>
        </div>
      </div>
    `
    )
    .join("");
}

function revealTips(container) {
  const items = container.querySelectorAll(".tipItem");
  items.forEach((el, i) => {
    setTimeout(() => el.classList.add("show"), 150 + i * 180);
  });
}
