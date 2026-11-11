import type { Request, Response, NextFunction } from "express";
import { RequestHelper } from "../helpers/RequestHelper.js";
import type { NotificationService } from "../services/NotificationService.js";

export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = RequestHelper.getUserId(req);
      const notifications = await this.notificationService.list(userId);
      res.json(notifications);
    } catch (error) {
      next(error);
    }
  };

  markAsRead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = RequestHelper.getUserId(req);
      const id = RequestHelper.requireObjectId(req.params.id);
      const notification = await this.notificationService.markAsRead(id, userId);
      res.json(notification);
    } catch (error) {
      next(error);
    }
  };

  unreadCount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = RequestHelper.getUserId(req);
      const count = await this.notificationService.countUnread(userId);
      res.json({ count });
    } catch (error) {
      next(error);
    }
  };
}
