const BASE_URL = "http://localhost:8080/api/investments";

export async function getInvestments() {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Failed to fetch investments");
  return res.json();
}