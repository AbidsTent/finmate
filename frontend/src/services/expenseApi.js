const BASE_URL = "http://localhost:8080/api/expenses";

export async function getExpenses() {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Failed to fetch expenses");
  return res.json();
}