import type { INotifier, Notification } from "./INotifier.js";
import type {
  INotificationRepository,
  CreateNotificationData,
} from "../repositories/interfaces/INotificationRepository.js";

export class InAppNotifier implements INotifier {
  constructor(
    private readonly notificationRepository: INotificationRepository
  ) {}

  async send(notification: Notification): Promise<void> {
    const data: CreateNotificationData = {
      user: notification.userId,
      ticket: notification.ticketId,
      ticketTitle: notification.ticketTitle,
      previousStatus: notification.previousStatus,
      newStatus: notification.newStatus,
    };
    await this.notificationRepository.create(data);
  }
}