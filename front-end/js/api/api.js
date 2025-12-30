import { getAccessToken, setAuth, clearAuth } from "../auth/auth-store.js";

const BASE = "http://localhost:5500";

async function request(url, options = {}) {
  const token = getAccessToken();
  console.log(token)
  const res = await fetch(BASE + url, {
    credentials: "include",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: "Bearer " + token }),
      ...(options.headers || {}),
    },
  });

  if (res.status === 401) {
    const data = await res.json();

    if (data.errorCode === "TOKEN_EXPIRED") {
      return refreshAndRetry(url, options);
    }

    logout();
    throw new Error("Unauthorized");
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "خطا سرور");

  return data;
}

async function refreshAndRetry(url, options) {
  try {
    const res = await fetch(BASE + "/api/auth/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) throw new Error("عدم وجود توکن ");

    const data = await res.json();
    setAuth(data.accessToken, data.role);

    return request(url, options);
  } catch {
    logout();
    throw new Error("Session expired");
  }
}

export const apiGet = (url) => request(url, { method: "GET" });

export const apiPost = (url, body) =>
  request(url, { method: "POST", body: JSON.stringify(body) });

export const apiPut = (url, body) =>
  request(url, { method: "PUT", body: JSON.stringify(body) });

