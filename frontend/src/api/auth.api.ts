import { apiFetch } from "./client";
import type { AuthUser, LoginResponse } from "../types";

export function login(email: string, password: string): Promise<LoginResponse> {
    return apiFetch<LoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
    });
}

export function register(name: string, email: string, password: string): Promise<AuthUser> {
    return apiFetch<AuthUser>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
    });
}

export function getMe(): Promise<AuthUser> {
    return apiFetch<AuthUser>("/auth/me");
}
