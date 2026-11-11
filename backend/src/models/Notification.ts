import { Schema, model, Types, type HydratedDocument } from "mongoose";
import { TICKET_STATUSES, type TicketStatus } from "./Ticket.js";

export interface INotification {
  user: Types.ObjectId;
  ticket: Types.ObjectId;
  ticketTitle: string;
  previousStatus: TicketStatus;
  newStatus: TicketStatus;
  read: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export type NotificationDocument = HydratedDocument<INotification>;

/* Extiende Document implicitamente al crearse con el modelo, aca se describen sus campos */
export interface INotificationDocument {
  user: Types.ObjectId;   //a quien le pertenece la notificacion
  ticket: Types.ObjectId;  //de que ticket salio
  ticketTitle: string;  //titulo congelado al momento del aviso
  previousStatus: TicketStatus;  //estado anterior
  newStatus: TicketStatus;  //estado nuevo
  read: boolean;  //leida, no leida
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    ticket: { type: Schema.Types.ObjectId, ref: "Ticket", required: true },
    ticketTitle: { type: String, required: true },
    previousStatus: { type: String, enum: [...TICKET_STATUSES], required: true },
    newStatus: { type: String, enum: [...TICKET_STATUSES], required: true },
    read: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

export const Notification = model<INotification>("Notification", notificationSchema);