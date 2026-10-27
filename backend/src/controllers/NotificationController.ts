import type { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError.js";
import type { NotificationService } from "../services/NotificationService.js";

export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = this.getUserId(req);
      const notifications = await this.notificationService.list(userId);
      res.json(notifications);
    } catch (error) {
      next(error);
    }
  };

  markAsRead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = this.getUserId(req);
      const id = this.getId(req);
      const notification = await this.notificationService.markAsRead(id, userId);
      res.json(notification);
    } catch (error) {
      next(error);
    }
  };

  unreadCount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = this.getUserId(req);
      const count = await this.notificationService.countUnread(userId);
      res.json({ count });
    } catch (error) {
      next(error);
    }
  };

  private getUserId(req: Request): string {
    const user = req.user;
    if (user === undefined) {
      throw AppError.Unauthorized();
    }
    return user.id;
  }

  private getId(req: Request): string {
    const id = req.params.id;
    if (typeof id !== "string") {
      throw AppError.BadRequest("Id inválido");
    }
    return id;
  }
}