const TOKEN_KEY = "finmate_token";
const USER_KEY = "finmate_user";
const LEGACY_BUDGET_KEY = "finmate_budget";

export function setAuth(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY));
  } catch {
    return null;
  }
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isLoggedIn() {
  return !!getToken();
}

export function getBudgetKey() {
  const user = getUser();
  const userId = user?.id || user?._id;
  return userId ? `finmate_budget_${userId}` : "finmate_budget_guest";
}

export function getStoredBudget() {
  const key = getBudgetKey();
  const scopedBudget = localStorage.getItem(key);

  if (scopedBudget !== null) return scopedBudget;

  const legacyBudget = localStorage.getItem(LEGACY_BUDGET_KEY);
  if (legacyBudget !== null) {
    localStorage.setItem(key, legacyBudget);
    return legacyBudget;
  }

  return null;
}

export function setStoredBudget(value) {
  const normalized = String(value);
  localStorage.setItem(getBudgetKey(), normalized);
  localStorage.removeItem(LEGACY_BUDGET_KEY);
}
