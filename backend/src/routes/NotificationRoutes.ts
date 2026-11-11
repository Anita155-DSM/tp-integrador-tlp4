import { Router } from "express";
import type { NotificationController } from "../controllers/NotificationController.js";
import type { AuthMiddleware } from "../middlewares/AuthMiddleware.js";
import type { AuthorizeMiddleware } from "../middlewares/AuthorizeMiddleware.js";

export class NotificationRoutes {
  constructor(
    private readonly controller: NotificationController,
    private readonly authMiddleware: AuthMiddleware,
    private readonly authorizeMiddleware: AuthorizeMiddleware
  ) {}

  getRouter(): Router {
    const router = Router();
    router.use(this.authMiddleware.authenticate);

    router.get("/", this.authorizeMiddleware.authorize("notification:read"), this.controller.list);
    router.get("/unread-count", this.authorizeMiddleware.authorize("notification:read"), this.controller.unreadCount);
    router.patch("/:id/read", this.authorizeMiddleware.authorize("notification:read"), this.controller.markAsRead);

    return router;
  }
}