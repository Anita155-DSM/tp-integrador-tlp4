import { Router } from "express";
import type { AuthController } from "../controllers/AuthController.js";
import type { AuthMiddleware } from "../middlewares/AuthMiddleware.js";

export class AuthRoutes {
    constructor(
        private readonly controller: AuthController,
        private readonly authMiddleware: AuthMiddleware,
    ) {}

    getRouter(): Router {
        const router = Router();
        router.post("/register", this.controller.register);
        router.post("/login", this.controller.login);
        router.get("/me", this.authMiddleware.authenticate, this.controller.me); //nueva ruta, con lo el metodo me que agregamos en nuestro controlador
        return router;
    }
}
