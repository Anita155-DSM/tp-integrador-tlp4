import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router";
import { createTicket } from "../api/tickets.api";

export function TicketFormPage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [working, setWorking] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setWorking(true);
    setError(null);
    try {
      const ticket = await createTicket({ title, description });
      navigate(`/tickets/${ticket.id}`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "No se pudo crear el ticket");
      setWorking(false);
    }
  }

  return (
    <section>
      <h1>Nuevo ticket</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Título</label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Descripción</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={working}>
          {working ? "Creando..." : "Crear ticket"}
        </button>
        {error !== null && <p>{error}</p>}
      </form>
    </section>
  );
}