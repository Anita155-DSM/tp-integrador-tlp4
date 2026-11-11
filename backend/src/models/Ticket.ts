import { Schema, model, type HydratedDocument } from "mongoose";

export const TICKET_STATUSES = ["ABIERTO", "EN_PROGRESO", "RESUELTO", "CERRADO"] as const;
export type TicketStatus = (typeof TICKET_STATUSES)[number];

export interface ITicket {
  title: string;
  description: string;
  status: TicketStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export type TicketDocument = HydratedDocument<ITicket>;

const ticketSchema = new Schema<ITicket>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: [...TICKET_STATUSES], required: true, default: "ABIERTO" },
  },
  { timestamps: true }
);

export const Ticket = model<ITicket>("Ticket", ticketSchema);