import { getToken } from "../utils/storage";

const BASE_URL = "http://localhost:8080/api/expenses";

function authHeaders(extra = {}) {
  return {
    ...extra,
    Authorization: `Bearer ${getToken()}`,
  };
}

export async function getExpenses() {
  const res = await fetch(BASE_URL, {
    headers: authHeaders(),
  });

  if (!res.ok) throw new Error("Failed to fetch expenses");
  return res.json();
}

export async function createExpense(payload) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to create expense");
  return res.json();
}

export async function updateExpense(id, payload) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: authHeaders({ "Content-Type": "application/json" }),
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to update expense");
  return res.json();
}

export async function deleteExpense(id) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  if (!res.ok) throw new Error("Failed to delete expense");
  return res.json();
}