import { useEffect, useState } from "react";
import { getNotifications, markNotificationAsRead } from "../api/notifications.api";
import type { Notification } from "../types";

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getNotifications();
        setNotifications(data);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Error al cargar las notificaciones");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function handleMarkAsRead(id: string) {
    try {
      const updated = await markNotificationAsRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "No se pudo marcar como leída");
    }
  }

  if (loading) return <p>Cargando notificaciones...</p>;
  if (error !== null && notifications.length === 0) return <p>{error}</p>;

  return (
    <section>
      <h1>Notificaciones</h1>
      {notifications.length === 0 ? (
        <p>No tenés notificaciones.</p>
      ) : (
        <ul>
          {notifications.map((n) => (
            <li key={n.id}>
              <strong>{n.ticketTitle}</strong>: {n.previousStatus} → {n.newStatus}
              {n.read ? (
                " (leída)"
              ) : (
                <button onClick={() => handleMarkAsRead(n.id)}>Marcar como leída</button>
              )}
            </li>
          ))}
        </ul>
      )}
      {error !== null && <p>{error}</p>}
    </section>
  );
}