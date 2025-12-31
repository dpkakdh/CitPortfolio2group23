const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export function getBaseUrl() {
  if (!BASE_URL) throw new Error("Missing REACT_APP_API_BASE_URL in .env");
  return BASE_URL;
}

export async function apiFetch(path, { token, method = "GET", body } = {}) {
  const url = `${getBaseUrl()}${path}`;

  const headers = {
    "Content-Type": "application/json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const msg =
      (data && (data.message || data.error)) ||
      `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return data;
}
