import type { TicketStatus } from "../models/Ticket.js";

export interface Notification {
  userId: string;
  userEmail: string;
  ticketId: string;
  ticketTitle: string;
  previousStatus: TicketStatus;
  newStatus: TicketStatus;
  read: boolean;
}

export interface INotifier {
  send(notification: Notification): Promise<void>;
}