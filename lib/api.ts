export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers || {});
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    if (response.status === 401) {
      // Dispatch an event to handle unauthorized access across the app
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("unauthorized"));
      }
    }
    throw new Error(data.error || "An unexpected error occurred");
  }

  return data;
}
