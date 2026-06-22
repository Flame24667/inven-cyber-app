const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api"

async function request(path, options = {}) {
  const token = localStorage.getItem("cyber_inventory_token")
  let response

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    })
  } catch {
    throw new Error("Unable to reach the API server. Please make sure the backend is running.")
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Request failed" }))
    throw new Error(formatApiError(error))
  }

  if (response.status === 204) {
    return null
  }

  return response.json()
}

function formatApiError(error) {
  const detail = error?.detail

  if (Array.isArray(detail)) {
    return detail.map(formatValidationError).join(" ")
  }

  if (typeof detail === "string") {
    return detail
  }

  if (detail && typeof detail === "object") {
    return JSON.stringify(detail)
  }

  if (typeof error?.message === "string") {
    return error.message
  }

  return "Request failed"
}

function formatValidationError(item) {
  const field = Array.isArray(item.loc) ? item.loc[item.loc.length - 1] : null
  const label = field ? humanizeField(field) : "Field"
  const message = String(item.msg || "Invalid value.").replace(/^Value error,\s*/i, "")
  return `${label}: ${message}`
}

function humanizeField(field) {
  return String(field)
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

export const api = {
  login: (payload) => request("/auth/login", { method: "POST", body: JSON.stringify(payload) }),
  register: (payload) => request("/auth/register", { method: "POST", body: JSON.stringify(payload) }),
  me: () => request("/auth/me"),
  items: () => request("/items"),
  itemDetail: (id) => request(`/items/${id}/detail`),
  createItem: (payload) => request("/items", { method: "POST", body: JSON.stringify(payload) }),
  updateItem: (id, payload) => request(`/items/${id}`, { method: "PATCH", body: JSON.stringify(payload) }),
  deleteItem: (id) => request(`/items/${id}`, { method: "DELETE" }),
  loans: () => request("/loans"),
  createLoan: (payload) => request("/loans", { method: "POST", body: JSON.stringify(payload) }),
  decideLoan: (id, payload) => request(`/loans/${id}/decision`, { method: "PATCH", body: JSON.stringify(payload) }),
  returnLoan: (id, payload) => request(`/loans/${id}/return`, { method: "PATCH", body: JSON.stringify(payload) }),
}
