import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getTickets } from "../api/tickets.api";
import type { Ticket } from "../types";

export function TicketListPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await getTickets();
        setTickets(data);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Error al cargar los tickets");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <p>Cargando tickets...</p>;
  if (error) return <p>{error}</p>;

  return (
    <section>
      <header>
        <h1>Tickets</h1>
        <Link to="/tickets/new">Nuevo ticket</Link>
      </header>

      {tickets.length === 0 ? (
        <p>No hay tickets todavía.</p>
      ) : (
        <ul>
          {tickets.map((ticket) => (
            <li key={ticket.id}>
              <Link to={`/tickets/${ticket.id}`}>{ticket.title}</Link> — {ticket.status}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}