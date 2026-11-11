import { apiFetch } from "./client";
import type { UserSummary } from "../types";

export function getUsers(): Promise<UserSummary[]> {
    return apiFetch<UserSummary[]>("/users");
}

export function assignRole(id: string, role: string): Promise<UserSummary> {
    return apiFetch<UserSummary>(`/users/${id}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role }),
    });
}
