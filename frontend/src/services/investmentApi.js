import { getToken } from "../utils/storage";

const BASE_URL = "http://localhost:8080/api/investments";

function authHeaders(extra = {}) {
  return {
    ...extra,
    Authorization: `Bearer ${getToken()}`,
  };
}

async function parseJsonResponse(res, fallbackMessage) {
  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message = data?.message || fallbackMessage;
    throw new Error(message);
  }

  return data;
}

export async function getInvestments() {
  const res = await fetch(BASE_URL, {
    headers: authHeaders(),
  });

  return parseJsonResponse(res, "Failed to fetch investments");
}

export async function getInvestmentById(id) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    headers: authHeaders(),
  });

  return parseJsonResponse(res, "Failed to fetch investment");
}

export async function createInvestment(payload) {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });

  return parseJsonResponse(res, "Failed to create investment");
}

export async function updateInvestment(id, payload) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: authHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify(payload),
  });

  return parseJsonResponse(res, "Failed to update investment");
}

export async function deleteInvestment(id) {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  return parseJsonResponse(res, "Failed to delete investment");
}