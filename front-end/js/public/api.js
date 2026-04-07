const BASE = "http://127.0.0.1:3000";

export async function apiPost(url, body) {
  const res = await fetch(BASE + url, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "خطا سرور !");
  return data;
}
