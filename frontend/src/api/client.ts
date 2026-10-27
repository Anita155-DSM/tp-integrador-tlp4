const API_URL: string = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";
const TOKEN_KEY = "token";

export const tokenStorage = {
    get: (): string | null => localStorage.getItem(TOKEN_KEY),
    set: (token: string): void => localStorage.setItem(TOKEN_KEY, token),
    clear: (): void => localStorage.removeItem(TOKEN_KEY),
};

export class ApiError extends Error {
    constructor(
        message: string,
        public readonly status: number,
    ) {
        super(message);
    }
}

interface RequestOptions {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: string;
}

export async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const headers: Record<string, string> = {};
    if (options.body !== undefined) {
        headers["Content-Type"] = "application/json";
    }
    const token = tokenStorage.get();
    if (token !== null) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${path}`, {
        method: options.method ?? "GET",
        headers,
        body: options.body,
    });

    if (!response.ok) {
        let message = "Error inesperado";
        try {
            const data: { message?: string } = await response.json();
            if (typeof data.message === "string") {
                message = data.message;
            }
        } catch {
            // la respuesta no traía JSON: queda el mensaje por defecto
        }
        throw new ApiError(message, response.status);
    }

    if (response.status === 204) {
        return undefined as T;
    }
    return (await response.json()) as T;
}
