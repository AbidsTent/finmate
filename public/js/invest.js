let watchlist = [];
let portfolio = [];

const $ = (id) => document.getElementById(id);
const fmt = (n) => n.toLocaleString(undefined, { style: "currency", currency: "USD" });

let modalMode = "portfolio";

function showError(msg) {
  const box = $("errorBox");

  // guard in case errorBox is missing 
  if (!box) return;


  box.textContent = msg;
  box.style.display = "block";
  setTimeout(() => (box.style.display = "none"), 3000);
}

async function loadData() {
  // Fetch data from server API
  const res = await fetch("/api/invest");
  if (!res.ok) throw new Error("Failed to fetch data");
  const data = await res.json();

  // add safe fallbacks if JSON properties are missing
  watchlist = (data.watchlist || []).map(w => ({ ...w, prev: w.price }));
  portfolio = data.portfolio || [];

  renderAll();
}

function renderAll() {
  renderWatchlist();
  renderPortfolio();
  renderSummary();
}

function renderWatchlist() {
  const body = $("watchlistBody");
  body.innerHTML = "";

  watchlist.forEach(w => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${w.ticker}</strong></td>
      <td>${fmt(w.price)}</td>

      <!-- CHANGE: Add Remove button -->
      <td style="text-align:right;">
        <button class="iconBtn" type="button" data-remove-watch="${w.ticker}" aria-label="Remove">✕</button>
      </td>
      <!-- /CHANGE -->
    `;
    body.appendChild(tr);
  });

  $("watchCount").textContent = String(watchlist.length);
  // enable remove buttons (event delegation)
  body.onclick = (e) => {
    const btn = e.target.closest("[data-remove-watch]");
    if (!btn) return;

    const ticker = btn.getAttribute("data-remove-watch");
    watchlist = watchlist.filter(w => w.ticker !== ticker);

    renderAll();
  };
  // Watchlist remove handler 

  body.onclick = (e) => {
    const btn = e.target.closest("[data-remove-watch]");
    if (!btn) return;
    const ticker = btn.getAttribute("data-remove-watch");
    // Remove ONLY from watchlist 
    watchlist = watchlist.filter(w => w.ticker !== ticker);
    renderAll();
  };

}

function renderPortfolio() {
  const body = $("portfolioBody");
  body.innerHTML = "";

  portfolio.forEach(p => {
    const tr = document.createElement("tr");

    // Add Value + P/L % calculations 
    const value = p.current * p.shares;
    const plPercent = ((p.current - p.buyPrice) / p.buyPrice) * 100;
    const plColor = plPercent >= 0 ? "#38d39f" : "#ff6b6b";
 

    tr.innerHTML = `
      <td><strong>${p.ticker}</strong></td>
      <td>${fmt(p.buyPrice)}</td>
      <td>${fmt(p.current)}</td>
      <td>${p.shares}</td>

      <!-- CHANGE: Added analytical columns -->
      <td>${fmt(value)}</td>
      <td style="color:${plColor}">${plPercent.toFixed(2)}%</td>
      <!-- /CHANGE -->

      <!-- CHANGE: Add Remove button -->
      <td style="text-align:right;">
        <button class="iconBtn" type="button" data-remove-port="${p.ticker}" aria-label="Remove">✕</button>
      </td>
      <!-- /CHANGE -->
    `;
    body.appendChild(tr);
  });

  //Portfolio remove handler
  body.onclick = (e) => {
    const btn = e.target.closest("[data-remove-port]");
    if (!btn) return;

    const ticker = btn.getAttribute("data-remove-port");
    portfolio = portfolio.filter(p => p.ticker !== ticker);

    renderAll();
  };
  // /CHANGE
}

function renderSummary() {
  const cost = portfolio.reduce((s, p) => s + p.buyPrice * p.shares, 0);
  const market = portfolio.reduce((s, p) => s + p.current * p.shares, 0);
  const pl = market - cost;

  $("costBasis").textContent = fmt(cost);
  $("marketValue").textContent = fmt(market);
  $("plValue").textContent = `${pl < 0 ? "-" : ""}${fmt(Math.abs(pl))}`;

  const max = Math.max(cost, market, 1);
  $("costBar").style.width = `${Math.max(3, (cost / max) * 100)}%`;
  $("marketBar").style.width = `${Math.max(3, (market / max) * 100)}%`;
}

function simulatePriceTick() {
  watchlist.forEach(w => {
    w.prev = w.price;
    const step = (Math.random() - 0.5) * 0.02;
    w.price = Math.max(0.01, +(w.price * (1 + step)).toFixed(2));
  });

  portfolio.forEach(p => {
    const w = watchlist.find(x => x.ticker === p.ticker);
    if (w) p.current = w.price;
    else {
      const step = (Math.random() - 0.5) * 0.01;
      p.current = Math.max(0.01, +(p.current * (1 + step)).toFixed(2));
    }
  });

  renderAll();
}

/** Modal logic */
const overlay = $("modalOverlay");

function openModal(mode = "portfolio") {
  modalMode = mode;

  overlay.classList.add("open");
  overlay.setAttribute("aria-hidden", "false");

  const buy = $("addForm").buyPrice;
  const sh = $("addForm").shares;

  if (mode === "watchlist") {
    $("modalTitle").textContent = "Add Watchlist Ticker";
    $("investmentFields").style.display = "none";

    buy.required = false;
    sh.required = false;
    buy.disabled = true;
    sh.disabled = true;
  } else {
    $("modalTitle").textContent = "Add Investment";
    $("investmentFields").style.display = "grid";

    buy.disabled = false;
    sh.disabled = false;
    buy.required = true;
    sh.required = true;
  }
}

function closeModal() {
  overlay.classList.remove("open");
  overlay.setAttribute("aria-hidden", "true");
  $("addForm").reset();
  $("addForm").shares.value = "1";
}

$("openModalBtn").addEventListener("click", () => openModal("portfolio"));
$("openWatchModalBtn").addEventListener("click", () => openModal("watchlist"));
$("closeModalBtn").addEventListener("click", closeModal);
$("cancelBtn").addEventListener("click", closeModal);
overlay.addEventListener("click", (e) => { if (e.target === overlay) closeModal(); });

$("addForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const ticker = e.target.ticker.value.trim().toUpperCase();
  if (!ticker) return showError("Ticker is required.");

  if (modalMode === "watchlist") {
    if (watchlist.find(w => w.ticker === ticker)) {
      return showError("Ticker already exists.");
    }

    const price = +(25 + Math.random() * 200).toFixed(2);
    watchlist.unshift({ ticker, price, prev: price });

    closeModal();
    renderWatchlist();
    return;
  }

  const buyPrice = Number(e.target.buyPrice.value);
  const shares = Number(e.target.shares.value);

  if (!Number.isFinite(buyPrice) || buyPrice <= 0)
    return showError("Enter valid buy price.");

  if (!Number.isFinite(shares) || shares <= 0)
    return showError("Enter valid shares.");

  let currentPrice;
  const w = watchlist.find(x => x.ticker === ticker);
  if (w) currentPrice = w.price;
  else currentPrice = +(buyPrice * (1 + (Math.random() - 0.5) * 0.05)).toFixed(2);

  const existing = portfolio.find(p => p.ticker === ticker);

  if (existing) {
    const totalShares = existing.shares + shares;
    const weightedBuy =
      (existing.buyPrice * existing.shares + buyPrice * shares) / totalShares;

    existing.shares = +totalShares.toFixed(4);
    existing.buyPrice = +weightedBuy.toFixed(2);
    existing.current = currentPrice;
  } else {
    portfolio.unshift({
      ticker,
      buyPrice: +buyPrice.toFixed(2),
      shares: +shares.toFixed(4),
      current: currentPrice
    });
  }

  closeModal();
  renderAll();
});

//  guard refreshBtn listener 
//const refreshBtn = $("refreshBtn");
//if (refreshBtn) refreshBtn.addEventListener("click", simulatePriceTick);

// Init
loadData().catch(() => {
  watchlist = [
    { ticker: "AAPL", price: 189.12, prev: 189.12 },
    { ticker: "TSLA", price: 214.70, prev: 214.70 },
    { ticker: "MSFT", price: 412.05, prev: 412.05 }
  ];
  portfolio = [
    { ticker: "AAPL", buyPrice: 160.00, shares: 2, current: 189.12 },
    { ticker: "MSFT", buyPrice: 350.00, shares: 1, current: 412.05 }
  ];
  renderAll();
});

setInterval(simulatePriceTick, 4000);
