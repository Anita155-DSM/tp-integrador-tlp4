import { useEffect, useState } from "react";
import { useParams } from "react-router";
import {
  getTicket,
  subscribeToTicket,
  unsubscribeFromTicket,
  changeTicketStatus,
} from "../api/tickets.api";
import type { TicketDetail, TicketStatus } from "../types";

const STATUSES: TicketStatus[] = ["ABIERTO", "EN_PROGRESO", "RESUELTO", "CERRADO"];

export function TicketDetailPage() {
  const { id } = useParams();
  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [working, setWorking] = useState(false);

  useEffect(() => {
    if (id === undefined) return;
    const ticketId = id;
    async function load() {
      try {
        const data = await getTicket(ticketId);
        setTicket(data);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Error al cargar el ticket");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function handleSubscription() {
    if (ticket === null) return;
    setWorking(true);
    try {
      const updated = ticket.isSubscribed
        ? await unsubscribeFromTicket(ticket.id)
        : await subscribeToTicket(ticket.id);
      setTicket(updated);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "No se pudo actualizar la suscripción");
    } finally {
      setWorking(false);
    }
  }

  async function handleStatusChange(status: TicketStatus) {
    if (ticket === null) return;
    setWorking(true);
    try {
      const updated = await changeTicketStatus(ticket.id, status);
      setTicket(updated);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "No se pudo cambiar el estado");
    } finally {
      setWorking(false);
    }
  }

  if (loading) return <p>Cargando ticket...</p>;
  if (error !== null && ticket === null) return <p>{error}</p>;
  if (ticket === null) return <p>Ticket no encontrado.</p>;

  return (
    <section>
      <h1>{ticket.title}</h1>
      <p>{ticket.description}</p>
      <p>Estado: {ticket.status}</p>

      <button onClick={handleSubscription} disabled={working}>
        {ticket.isSubscribed ? "Desuscribirse" : "Suscribirse"}
      </button>

      <div>
        <label htmlFor="status">Cambiar estado: </label>
        <select
          id="status"
          value={ticket.status}
          disabled={working}
          onChange={(e) => handleStatusChange(e.target.value as TicketStatus)}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {error !== null && <p>{error}</p>}
    </section>
  );
}