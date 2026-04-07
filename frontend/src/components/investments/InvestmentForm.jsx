import { useEffect, useState } from "react";

const INITIAL_FORM = {
  ticker: "",
  shares: "",
  buyPrice: "",
  current: "",
  buyDate: "",
};

export default function InvestmentForm({
  mode,
  initialValues,
  submitting,
  onSubmit,
  onCancelEdit,
}) {
  const [form, setForm] = useState(INITIAL_FORM);
  const isEditMode = mode === "edit";

  useEffect(() => {
    if (initialValues) {
      setForm({
        ticker: initialValues.ticker ?? "",
        shares: String(initialValues.shares ?? ""),
        buyPrice: String(initialValues.buyPrice ?? ""),
        current: String(initialValues.current ?? ""),
        buyDate: initialValues.buyDate ?? "",
      });
      return;
    }

    setForm(INITIAL_FORM);
  }, [initialValues]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function buildPayload() {
    const ticker = form.ticker.trim().toUpperCase();
    const shares = Number(form.shares);
    const buyPrice = Number(form.buyPrice);

    if (!ticker) {
      throw new Error("Ticker is required");
    }

    if (!Number.isFinite(shares) || shares <= 0) {
      throw new Error("Shares must be greater than 0");
    }

    if (!Number.isFinite(buyPrice) || buyPrice <= 0) {
      throw new Error("Buy price must be greater than 0");
    }

    const payload = {
      ticker,
      shares,
      buyPrice,
    };

    if (form.current !== "") {
      const current = Number(form.current);
      if (!Number.isFinite(current) || current < 0) {
        throw new Error("Current price must be 0 or higher");
      }
      payload.current = current;
    }

    if (form.buyDate) {
      payload.buyDate = form.buyDate;
    }

    return payload;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const payload = buildPayload();
    await onSubmit(payload);

    if (!isEditMode) {
      setForm(INITIAL_FORM);
    }
  }

  return (
    <section className="panel">
      <div className="panelTitle">{isEditMode ? "Edit Investment" : "Add Investment"}</div>

      <form className="form" onSubmit={handleSubmit}>
        <label className="field">
          <span className="muted">Ticker</span>
          <input
            className="input"
            name="ticker"
            placeholder="AAPL"
            value={form.ticker}
            onChange={handleChange}
            maxLength={8}
            disabled={isEditMode || submitting}
            required
          />
        </label>

        <label className="field">
          <span className="muted">Buy Price</span>
          <input
            className="input"
            name="buyPrice"
            type="number"
            min="0"
            step="0.01"
            value={form.buyPrice}
            onChange={handleChange}
            disabled={submitting}
            required
          />
        </label>

        <label className="field">
          <span className="muted">Shares</span>
          <input
            className="input"
            name="shares"
            type="number"
            min="0.0001"
            step="0.0001"
            value={form.shares}
            onChange={handleChange}
            disabled={submitting}
            required
          />
        </label>

        <label className="field">
          <span className="muted">Current Price (optional)</span>
          <input
            className="input"
            name="current"
            type="number"
            min="0"
            step="0.01"
            value={form.current}
            onChange={handleChange}
            disabled={submitting}
          />
        </label>

        <label className="field">
          <span className="muted">Buy Date (optional)</span>
          <input
            className="input"
            name="buyDate"
            type="date"
            value={form.buyDate}
            onChange={handleChange}
            disabled={submitting}
          />
        </label>

        <div className="actions" style={{ marginTop: 12 }}>
          {isEditMode && (
            <button
              className="btn btn-secondary"
              type="button"
              onClick={onCancelEdit}
              disabled={submitting}
            >
              Cancel Edit
            </button>
          )}
          <button className="btn" type="submit" disabled={submitting}>
            {submitting ? "Saving..." : isEditMode ? "Update Investment" : "Add Investment"}
          </button>
        </div>
      </form>
    </section>
  );
}
