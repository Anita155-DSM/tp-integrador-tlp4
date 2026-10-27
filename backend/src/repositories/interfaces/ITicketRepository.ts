import type { TicketDocument, TicketStatus } from "../../models/Ticket.js";

export interface TicketInput {
  title: string;
  description: string;
}

export interface ITicketRepository {
  findAll(): Promise<TicketDocument[]>;
  findById(id: string): Promise<TicketDocument | null>;
  create(data: TicketInput): Promise<TicketDocument>;
  update(id: string, data: TicketInput): Promise<TicketDocument | null>;
  updateStatus(id: string, status: TicketStatus): Promise<TicketDocument | null>;
  delete(id: string): Promise<TicketDocument | null>;
}