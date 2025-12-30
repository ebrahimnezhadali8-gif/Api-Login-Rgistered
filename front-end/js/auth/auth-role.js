import { getAccessToken, getRole } from "./auth-store.js";

export function checkAuth(requiredRole) {
  const token = getAccessToken();
  const role = getRole();

  if (!token) {
    window.location.href = "/login.html";
    return;
  }

  if (requiredRole && role !== requiredRole) {
    window.location.href = "/403.html";
  }
}
