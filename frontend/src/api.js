const BASE_URL = import.meta.env.DEV ? "/api" : "";

// Helpers
function authHeaders() {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse(response) {
  if (!response.ok) {
    let message = `Error ${response.status}`;
    try {
      const errorData = await response.json();
      if (typeof errorData.detail === "string") {
        message = errorData.detail;
      } else if (Array.isArray(errorData.detail)) {
        message = errorData.detail.map((d) => d.msg).join(", ");
      }
    } catch {
    }
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }
  if (response.status === 204) {
    return null;
  }
  return response.json();
}

// Auth
export async function login(email, password) {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    body: new URLSearchParams({ username: email, password }),
  });
  const data = await handleResponse(response);
  localStorage.setItem("access_token", data.access_token);
  localStorage.setItem("refresh_token", data.refresh_token);
  return data;
}

export async function register(username, email, password) {
  const response = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });
  return handleResponse(response);
}

export function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

// Users
export async function getMe() {
  const response = await fetch(`${BASE_URL}/users/me`, {
    headers: authHeaders(),
  });
  return handleResponse(response);
}

export async function updateMe(fields) {
  const response = await fetch(`${BASE_URL}/users/me`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(fields),
  });
  return handleResponse(response);
}

export async function deleteMe() {
  const response = await fetch(`${BASE_URL}/users/me`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return handleResponse(response);
}

// Notes
export async function getNotes() {
  const response = await fetch(`${BASE_URL}/notes/`, {
    headers: authHeaders(),
  });
  return handleResponse(response);
}

export async function createNote(title, content) {
  const response = await fetch(`${BASE_URL}/notes/`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ title, content }),
  });
  return handleResponse(response);
}

export async function updateNote(id, title, content) {
  const response = await fetch(`${BASE_URL}/notes/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ title, content }),
  });
  return handleResponse(response);
}

export async function deleteNote(id) {
  const response = await fetch(`${BASE_URL}/notes/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return handleResponse(response);
}

