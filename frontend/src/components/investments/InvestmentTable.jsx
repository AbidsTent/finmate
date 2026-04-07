function formatCurrency(value) {
  return Number(value || 0).toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
  });
}

function formatPercent(value) {
  if (!Number.isFinite(value)) return "0.00%";
  return `${value.toFixed(2)}%`;
}

export default function InvestmentTable({
  investments,
  loading,
  deletingId,
  onEdit,
  onDelete,
}) {
  if (loading) {
    return (
      <section className="panel">
        <div className="panelTitle">Portfolio</div>
        <p className="muted">Loading investments...</p>
      </section>
    );
  }

  if (!investments.length) {
    return (
      <section className="panel">
        <div className="panelTitle">Portfolio</div>
        <p className="muted">No investments yet. Add your first one.</p>
      </section>
    );
  }

  return (
    <section className="panel">
      <div className="panelTitle">Portfolio</div>

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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {investments.map((item) => {
              const buyPrice = Number(item.buyPrice || 0);
              const current = Number(item.current || 0);
              const shares = Number(item.shares || 0);
              const value = current * shares;
              const plPercent = buyPrice > 0 ? ((current - buyPrice) / buyPrice) * 100 : 0;
              const plStyle = { color: plPercent >= 0 ? "#38d39f" : "#ff6b6b" };

              return (
                <tr key={item._id}>
                  <td><strong>{item.ticker}</strong></td>
                  <td>{formatCurrency(buyPrice)}</td>
                  <td>{formatCurrency(current)}</td>
                  <td>{shares}</td>
                  <td>{formatCurrency(value)}</td>
                  <td style={plStyle}>{formatPercent(plPercent)}</td>
                  <td>
                    <button
                      className="btn"
                      type="button"
                      onClick={() => onEdit(item)}
                      style={{ marginRight: 8 }}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-secondary"
                      type="button"
                      onClick={() => onDelete(item)}
                      disabled={deletingId === item._id}
                    >
                      {deletingId === item._id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
