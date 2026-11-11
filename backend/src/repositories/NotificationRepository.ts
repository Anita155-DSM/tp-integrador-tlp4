import { Notification } from "../models/Notification.js";
import type { NotificationDocument } from "../models/Notification.js";
import type {
  INotificationRepository,
  CreateNotificationData,
} from "./interfaces/INotificationRepository.js";

export class NotificationRepository implements INotificationRepository {
  create(data: CreateNotificationData): Promise<NotificationDocument> {
    return Notification.create(data);
  }

  findByUser(userId: string): Promise<NotificationDocument[]> {
    return Notification.find({ user: userId }).sort({ createdAt: -1 }).exec();
  }

  markAsRead(notificationId: string, userId: string): Promise<NotificationDocument | null> {
    return Notification.findOneAndUpdate(
      { _id: notificationId, user: userId },
      { read: true },
      { returnDocument: "after" }
    ).exec();
  }

  countUnread(userId: string): Promise<number> {
    return Notification.countDocuments({ user: userId, read: false }).exec();
  }
}