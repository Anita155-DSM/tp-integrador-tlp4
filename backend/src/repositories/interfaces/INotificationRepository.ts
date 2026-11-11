import type { NotificationDocument } from "../../models/Notification.js";
import type { TicketStatus } from "../../models/Ticket.js";

export interface CreateNotificationData {
  user: string;
  ticket: string;
  ticketTitle: string;
  previousStatus: TicketStatus;
  newStatus: TicketStatus;
}

export interface INotificationRepository {
  create(data: CreateNotificationData): Promise<NotificationDocument>;
  findByUser(userId: string): Promise<NotificationDocument[]>;
  markAsRead(notificationId: string, userId: string): Promise<NotificationDocument | null>;
  countUnread(userId: string): Promise<number>;
}