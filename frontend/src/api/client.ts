// TEMP: versión provisional. El client.ts definitivo lo hace Ana (maneja el JWT).
// Reemplazar cuando ella lo suba.

const BASE_URL = import.meta.env.VITE_API_URL;

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem("token");

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Error ${response.status}`);
  }

  return response.json() as Promise<T>;
}