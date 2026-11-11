import { AppError } from "../errors/AppError.js";
import type { IObserver } from "../observer/IObserver.js";
import type { TicketStatusChangedEvent } from "../notifications/TicketStatusChangedEvent.js";
import type { INotifier, Notification } from "../notifications/INotifier.js";
import type { ISubscriptionRepository } from "../repositories/interfaces/ISubscriptionRepository.js";
import type { IUserRepository } from "../repositories/interfaces/IUserRepository.js";
import type { INotificationRepository } from "../repositories/interfaces/INotificationRepository.js";
import type { NotificationDocument } from "../models/Notification.js";
import type { TicketStatus } from "../models/Ticket.js";

export interface NotificationDTO {
  id: string;
  ticketId: string;
  ticketTitle: string;
  previousStatus: TicketStatus;
  newStatus: TicketStatus;
  read: boolean;
  createdAt: string;
}

export class NotificationService implements IObserver<TicketStatusChangedEvent> {
  constructor(
    private readonly subscriptionRepository: ISubscriptionRepository,
    private readonly userRepository: IUserRepository,
    private readonly notificationRepository: INotificationRepository,
    private readonly notifiers: INotifier[]
  ) {}

  async update(event: TicketStatusChangedEvent): Promise<void> {
    const subscriptions = await this.subscriptionRepository.findByTicket(event.ticketId);

    for (const subscription of subscriptions) {
      const userId = subscription.user.toString();
      const user = await this.userRepository.findById(userId);
      if (user === null) {
        continue;
      }

      const notification: Notification = {
        userId,
        userEmail: user.email,
        ticketId: event.ticketId,
        ticketTitle: event.ticketTitle,
        previousStatus: event.previousStatus,
        newStatus: event.newStatus,
        read: false,
      };

      for (const notifier of this.notifiers) {
        try {
          await notifier.send(notification);
        } catch {
          // Si un canal falla, no cortamos el resto ni rompemos el cambio de estado.
        }
      }
    }
  }

  async list(userId: string): Promise<NotificationDTO[]> {
    const notifications = await this.notificationRepository.findByUser(userId);
    return notifications.map((notification) => this.toDTO(notification));
  }

  async markAsRead(notificationId: string, userId: string): Promise<NotificationDTO> {
    const notification = await this.notificationRepository.markAsRead(notificationId, userId);
    if (notification === null) {
      throw AppError.NotFound("Notificación no encontrada");
    }
    return this.toDTO(notification);
  }

  countUnread(userId: string): Promise<number> {
    return this.notificationRepository.countUnread(userId);
  }

  private toDTO(notification: NotificationDocument): NotificationDTO {
    return {
      id: notification._id.toString(),
      ticketId: notification.ticket.toString(),
      ticketTitle: notification.ticketTitle,
      previousStatus: notification.previousStatus,
      newStatus: notification.newStatus,
      read: notification.read,
      createdAt: notification.createdAt!.toISOString(),
    };
  }
}