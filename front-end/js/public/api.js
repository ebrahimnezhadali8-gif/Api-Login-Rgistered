const BASE = "http://localhost:5500";

export async function apiPost(url, body) {
  console.log(body);
  console.log(BASE + url)
  const res = await fetch(BASE + url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "خطا سرور !");
  return data;
}
