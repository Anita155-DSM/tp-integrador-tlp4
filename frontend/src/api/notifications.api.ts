import { apiFetch } from "./client";
import type { Notification } from "../types";

export function getNotifications(): Promise<Notification[]> {
  return apiFetch<Notification[]>("/notifications");
}

export function markNotificationAsRead(id: string): Promise<Notification> {
  return apiFetch<Notification>(`/notifications/${id}/read`, {
    method: "PATCH",
  });
}

export async function getUnreadCount(): Promise<number> {
  const result = await apiFetch<{ count: number }>("/notifications/unread-count");
  return result.count;
}