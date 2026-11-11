import type { TicketStatus } from "../models/Ticket.js";

export interface TicketStatusChangedEvent {
  ticketId: string; //qué ticket es
  ticketTitle: string; //para que el mensaje se pueda leer
  previousStatus: TicketStatus; //estado anterior
  newStatus: TicketStatus;  //estado nuevo
}