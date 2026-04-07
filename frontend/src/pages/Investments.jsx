import { useEffect, useState } from "react";
import InvestmentForm from "../components/investments/InvestmentForm";
import InvestmentTable from "../components/investments/InvestmentTable";
import InvestmentSummary from "../components/investments/InvestmentSummary";
import {
  createInvestment,
  deleteInvestment,
  getInvestments,
  updateInvestment,
} from "../services/investmentApi";

export default function Investments() {
  const [investments, setInvestments] = useState([]);
  const [editingInvestment, setEditingInvestment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadInvestments();
  }, []);

  async function loadInvestments() {
    setLoading(true);
    setError("");

    try {
      const data = await getInvestments();
      setInvestments(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load investments");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateOrUpdate(payload) {
    setSaving(true);
    setError("");

    try {
      if (editingInvestment?._id) {
        const updated = await updateInvestment(editingInvestment._id, payload);

        setInvestments((prev) =>
          prev.map((item) => (item._id === updated._id ? updated : item))
        );
        setEditingInvestment(null);
        return;
      }

      const created = await createInvestment(payload);
      setInvestments((prev) => [created, ...prev]);
    } catch (err) {
      setError(err.message || "Failed to save investment");
      throw err;
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(item) {
    const shouldDelete = window.confirm(`Delete ${item.ticker} investment?`);
    if (!shouldDelete) return;

    setDeletingId(item._id);
    setError("");

    try {
      await deleteInvestment(item._id);
      setInvestments((prev) => prev.filter((inv) => inv._id !== item._id));

      if (editingInvestment?._id === item._id) {
        setEditingInvestment(null);
      }
    } catch (err) {
      setError(err.message || "Failed to delete investment");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section>
      <header className="hero invest-hero">
        <div>
          <h1>Investments</h1>
          <p className="muted">Track your portfolio with full CRUD actions.</p>
        </div>
      </header>

      {error && (
        <div className="error muted" style={{ display: "block", marginBottom: 16 }}>
          {error}
        </div>
      )}

      <InvestmentSummary investments={investments} />

      <section className="grid2">
        <InvestmentForm
          mode={editingInvestment ? "edit" : "create"}
          initialValues={editingInvestment}
          submitting={saving}
          onSubmit={handleCreateOrUpdate}
          onCancelEdit={() => setEditingInvestment(null)}
        />

        <InvestmentTable
          investments={investments}
          loading={loading}
          deletingId={deletingId}
          onEdit={setEditingInvestment}
          onDelete={handleDelete}
        />
      </section>

      {!loading && !investments.length && !error && (
        <p className="muted" style={{ marginTop: 12 }}>
          Tip: create your first investment using the form above.
        </p>
      )}
    </section>
  );
}
