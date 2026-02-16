import { clearAuth } from "./auth-store.js";
const BASE = "http://localhost:5500";
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
