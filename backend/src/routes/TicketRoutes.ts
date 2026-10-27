import { Router } from "express";
import type { TicketController } from "../controllers/TicketController.js";
import type { AuthMiddleware } from "../middlewares/AuthMiddleware.js";
import type { AuthorizeMiddleware } from "../middlewares/AuthorizeMiddleware.js";

export class TicketRoutes {
  constructor(
    private readonly controller: TicketController,
    private readonly authMiddleware: AuthMiddleware,
    private readonly authorizeMiddleware: AuthorizeMiddleware
  ) {}

  getRouter(): Router {
    const router = Router();
    router.use(this.authMiddleware.authenticate);

    router.get("/", this.authorizeMiddleware.authorize("ticket:read"), this.controller.list);
    router.post("/", this.authorizeMiddleware.authorize("ticket:create"), this.controller.create);
    router.get("/:id", this.authorizeMiddleware.authorize("ticket:read"), this.controller.getById);
    router.put("/:id", this.authorizeMiddleware.authorize("ticket:update"), this.controller.update);
    router.patch("/:id/status", this.authorizeMiddleware.authorize("ticket:change-status"), this.controller.changeStatus);
    router.delete("/:id", this.authorizeMiddleware.authorize("ticket:delete"), this.controller.delete);

    return router;
  }
}