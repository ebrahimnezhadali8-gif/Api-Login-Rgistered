import { clearAuth } from "./auth-store.js";
const BASE = "http://127.0.0.1:3000";
export async function logout() {
  try {
    await fetch(BASE + "/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
  } catch (err) {
    console.error("Logout error:", err);
  } finally {
    clearAuth(); 
    window.location.href = "/index.html";
  }
}
