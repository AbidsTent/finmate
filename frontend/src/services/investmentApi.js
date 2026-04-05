import { getToken } from "../utils/storage";

const BASE_URL = "http://localhost:8080/api/investments";

function authHeaders(extra = {}) {
  return {
    ...extra,
    Authorization: `Bearer ${getToken()}`,
  };
}

export async function getInvestments() {
  const res = await fetch(BASE_URL, {
    headers: authHeaders(),
  });

  if (!res.ok) throw new Error("Failed to fetch investments");
  return res.json();
}

export async function createInvestment(payload) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to create investment");
  return res.json();
}

export async function updateInvestment(id, payload) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to update investment");
  return res.json();
}

export async function deleteInvestment(id) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  if (!res.ok) throw new Error("Failed to delete investment");
  return res.json();
}