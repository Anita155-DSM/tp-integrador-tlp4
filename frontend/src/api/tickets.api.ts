import { apiFetch } from "./client";
import type { Ticket, TicketDetail, TicketStatus, CreateTicketInput } from "../types";

export function getTickets(): Promise<Ticket[]> {
  return apiFetch<Ticket[]>("/tickets");
}

export function getTicket(id: string): Promise<TicketDetail> {
  return apiFetch<TicketDetail>(`/tickets/${id}`);
}

export function createTicket(input: CreateTicketInput): Promise<Ticket> {
  return apiFetch<Ticket>("/tickets", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function updateTicket(id: string, input: CreateTicketInput): Promise<Ticket> {
  return apiFetch<Ticket>(`/tickets/${id}`, {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export function deleteTicket(id: string): Promise<void> {
  return apiFetch<void>(`/tickets/${id}`, {
    method: "DELETE",
  });
}

export function changeTicketStatus(id: string, status: TicketStatus): Promise<TicketDetail> {
  return apiFetch<TicketDetail>(`/tickets/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export function subscribeToTicket(ticketId: string): Promise<TicketDetail> {
  return apiFetch<TicketDetail>("/subscriptions", {
    method: "POST",
    body: JSON.stringify({ ticketId }),
  });
}

export function unsubscribeFromTicket(ticketId: string): Promise<TicketDetail> {
  return apiFetch<TicketDetail>(`/subscriptions/${ticketId}`, {
    method: "DELETE",
  });
}