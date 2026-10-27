import { Router } from "express";
import type { UserController } from "../controllers/UserController.js";
import type { AuthMiddleware } from "../middlewares/AuthMiddleware.js";
import type { AuthorizeMiddleware } from "../middlewares/AuthorizeMiddleware.js";

export class UserRoutes {
    constructor(
        private readonly controller: UserController,
        private readonly authMiddleware: AuthMiddleware,
        private readonly authorizeMiddleware: AuthorizeMiddleware,
    ) {}

    getRouter(): Router {
        const router = Router();
        router.use(this.authMiddleware.authenticate);
        router.get("/", this.authorizeMiddleware.authorize("user:read"), this.controller.list);
        router.patch("/:id/role", this.authorizeMiddleware.authorize("user:assign-role"), this.controller.assignRole);
        return router;
    }
}
