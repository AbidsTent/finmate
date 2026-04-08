function formatCurrency(value) {
  return Number(value || 0).toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
  });
}

export default function InvestmentSummary({ investments }) {
  const totals = investments.reduce(
    (acc, item) => {
      const buyPrice = Number(item.buyPrice || 0);
      const current = Number(item.current || 0);
      const shares = Number(item.shares || 0);

      acc.cost += buyPrice * shares;
      acc.market += current * shares;
      return acc;
    },
    { cost: 0, market: 0 }
  );

  const profitLoss = totals.market - totals.cost;
  const plStyle = { color: profitLoss >= 0 ? "#38d39f" : "#ff6b6b" };

  return (
    <section className="cards cards-3" style={{ marginTop: 16, marginBottom: 16 }}>
      <div className="card">
        <div className="label">Cost Basis</div>
        <div className="value">{formatCurrency(totals.cost)}</div>
      </div>
      <div className="card">
        <div className="label">Market Value</div>
        <div className="value">{formatCurrency(totals.market)}</div>
      </div>
      <div className="card">
        <div className="label">Profit / Loss</div>
        <div className="value" style={plStyle}>{formatCurrency(profitLoss)}</div>
      </div>
    </section>
  );
}
