const BASE_URL = "http://localhost:5000";

/**
 * Token Helpers
 */
export const getToken = () => localStorage.getItem("auth_token");
export const setToken = (token) => localStorage.setItem("auth_token", token);
export const removeToken = () => {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("auth_user");
};

/**
 * Centralized response handler with 401 token expiry handling
 */
async function handleResponse(res) {
  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;
    let errorData = null;

    try {
      errorData = await res.json();
      message =
        errorData.error ||
        (errorData.errors && Object.values(errorData.errors).join(", ")) ||
        message;
    } catch {
      // Non-JSON response
    }

    // Supplementary Problem 2: Token expiry handling on the frontend
    // Redirect to login if a protected request returns 401
    if (res.status === 401) {
      removeToken();
      window.dispatchEvent(
        new CustomEvent("auth:expired", {
          detail: { message: message || "Session expired. Please log in again." }
        })
      );
    }

    const err = new Error(message);
    err.status = res.status;
    err.data = errorData;
    throw err;
  }
  return res.json();
}

/**
 * Helper to build auth headers
 */
function authHeaders() {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

/* ─────────────────────────────────────────────
 Auth API Calls
───────────────────────────────────────────── */

export const registerUser = (userData) =>
  fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData)
  }).then(handleResponse);

export const loginUser = (credentials) =>
  fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials)
  }).then(handleResponse);

// Supplementary Problem 1: /me endpoint
export const getCurrentUser = () =>
  fetch(`${BASE_URL}/auth/me`, {
    method: "GET",
    headers: authHeaders()
  }).then(handleResponse);

/* ─────────────────────────────────────────────
 Protected Task API Calls (Require Bearer Token)
───────────────────────────────────────────── */

export const getTasks = () =>
  fetch(`${BASE_URL}/tasks`, {
    method: "GET",
    headers: authHeaders()
  }).then(handleResponse);

export const createTask = (task) =>
  fetch(`${BASE_URL}/tasks`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(task)
  }).then(handleResponse);

export const updateTask = (id, task) =>
  fetch(`${BASE_URL}/tasks/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(task)
  }).then(handleResponse);

export const deleteTask = (id) =>
  fetch(`${BASE_URL}/tasks/${id}`, {
    method: "DELETE",
    headers: authHeaders()
  }).then(handleResponse);
