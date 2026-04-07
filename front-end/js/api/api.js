import { getAccessToken, setAuth } from "../auth/auth-store.js";
import { logout } from "../auth/logout.js";

const BASE = "http://127.0.0.1:3000";
let isRefreshing = false;
let refreshPromise = null;

async function request(url, options = {}, retry = true) {
  const token = getAccessToken();

  const res = await fetch(BASE + url, {
    ...options,
    credentials: "include",
    headers: {
      ...(options.body && { "Content-Type": "application/json" }),
      ...(token && { Authorization: "Bearer " + token }),
      ...(options.headers || {}),
    },
  });

  if ((res.status === 401 || res.status === 403) && retry) {
    let data = {};
    try {
      data = await res.json();
    } catch {}

    if (data.errorCode === "TOKEN_EXPIRED") {
      await handleRefresh();
      return request(url, options, false);
    }

    logout();
    throw new Error("Unauthorized");
  }

  let data;
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (!res.ok) {
    throw new Error(data.message || "خطا سرور");
  }

  return data;
}

async function handleRefresh() {
  if (isRefreshing) {
    return refreshPromise;
  }

  isRefreshing = true;

  refreshPromise = fetch(BASE + "/api/auth/refresh", {
    method: "POST",
    credentials: "include",
  })
    .then(async (res) => {
      if (!res.ok) throw new Error();

      const data = await res.json();
      setAuth(data.accessToken);

      return data.accessToken;
    })
    .catch(() => {
      logout();
      throw new Error("Session expired");
    })
    .finally(() => {
      isRefreshing = false;
    });

  return refreshPromise;
}
export const apiGet = (url) => request(url, { method: "GET" });

export const apiPost = (url, body) =>
  request(url, {
    method: "POST",
    body: JSON.stringify(body),
  });

export const apiPut = (url, body) =>
  request(url, {
    method: "PUT",
    body: JSON.stringify(body),
  });
