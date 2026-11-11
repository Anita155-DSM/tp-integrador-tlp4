import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useParams } from "react-router";
import { createTicket, getTicket, updateTicket } from "../api/tickets.api";

export function TicketFormPage() {
  const { id } = useParams();
  const isEdit = id !== undefined;
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [working, setWorking] = useState(false);
  const [loading, setLoading] = useState(isEdit);

  useEffect(() => {
    if (id === undefined) return;
    const ticketId = id;
    async function load() {
      try {
        const ticket = await getTicket(ticketId);
        setTitle(ticket.title);
        setDescription(ticket.description);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Error al cargar el ticket");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setWorking(true);
    setError(null);
    try {
      const ticket = isEdit
        ? await updateTicket(id, { title, description })
        : await createTicket({ title, description });
      navigate(`/tickets/${ticket.id}`);
    } catch (e: unknown) {
      const fallback = isEdit ? "No se pudo guardar el ticket" : "No se pudo crear el ticket";
      setError(e instanceof Error ? e.message : fallback);
      setWorking(false);
    }
  }

  if (loading) return <p>Cargando ticket...</p>;

  const submitLabel = isEdit ? "Guardar cambios" : "Crear ticket";
  const workingLabel = isEdit ? "Guardando..." : "Creando...";

  return (
    <section>
      <h1>{isEdit ? "Editar ticket" : "Nuevo ticket"}</h1>
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
          {working ? workingLabel : submitLabel}
        </button>
        {error !== null && <p>{error}</p>}
      </form>
    </section>
  );
}
