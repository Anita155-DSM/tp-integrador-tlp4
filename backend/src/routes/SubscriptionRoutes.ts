import { Router } from "express";
import type { SubscriptionController } from "../controllers/SubscriptionController.js";
import type { AuthMiddleware } from "../middlewares/AuthMiddleware.js";
import type { AuthorizeMiddleware } from "../middlewares/AuthorizeMiddleware.js";

export class SubscriptionRoutes {
  constructor(
    private readonly controller: SubscriptionController,
    private readonly authMiddleware: AuthMiddleware,
    private readonly authorizeMiddleware: AuthorizeMiddleware
  ) {}

  getRouter(): Router {
    const router = Router();
    router.use(this.authMiddleware.authenticate);

    router.post("/", this.authorizeMiddleware.authorize("subscription:create"), this.controller.subscribe);
    router.delete("/:ticketId", this.authorizeMiddleware.authorize("subscription:delete"), this.controller.unsubscribe);

    return router;
  }
}