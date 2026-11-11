import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getUnreadCount } from "../api/notifications.api";

const POLL_INTERVAL_MS = 10000;

export function NotificationBell() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let active = true;

    async function refresh() {
      try {
        const unread = await getUnreadCount();
        if (active) setCount(unread);
      } catch {
        // Si una consulta puntual falla, no rompemos la UI: reintenta en el próximo ciclo.
      }
    }

    refresh();
    const intervalId = setInterval(refresh, POLL_INTERVAL_MS);

    return () => {
      active = false;
      clearInterval(intervalId);
    };
  }, []);

  return (
    <Link to="/notifications">
      Notificaciones{count > 0 ? ` (${count})` : ""}
    </Link>
  );
}