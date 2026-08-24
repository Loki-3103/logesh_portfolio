const API_BASE = "http://localhost:5000/api";

async function apiRequest(path, { method = "GET", body = null, auth = false } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = localStorage.getItem("token");
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

const Api = {
  register: (username, email, password) =>
    apiRequest("/auth/register", { method: "POST", body: { username, email, password } }),
  login: (email, password) =>
    apiRequest("/auth/login", { method: "POST", body: { email, password } }),

  listContent: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return apiRequest(`/catalog${qs ? "?" + qs : ""}`);
  },
  listGenres: () => apiRequest("/catalog/genres"),
  search: (q) => apiRequest(`/catalog/search?q=${encodeURIComponent(q)}`),
  getContent: (id) => apiRequest(`/catalog/${id}`),

  getWatchlist: () => apiRequest("/watchlist", { auth: true }),
  addToWatchlist: (id) => apiRequest(`/watchlist/${id}`, { method: "POST", auth: true }),
  removeFromWatchlist: (id) => apiRequest(`/watchlist/${id}`, { method: "DELETE", auth: true }),

  getHistory: () => apiRequest("/history", { auth: true }),
  logHistory: (id, progressSeconds) =>
    apiRequest(`/history/${id}`, { method: "POST", auth: true, body: { progress_seconds: progressSeconds } }),
};
