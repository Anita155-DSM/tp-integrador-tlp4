import { Router } from "express";
import type { AuthController } from "../controllers/AuthController.js";

export class AuthRoutes {
    constructor(private readonly controller: AuthController) {}

    getRouter(): Router {
        const router = Router();
        router.post("/register", this.controller.register);
        router.post("/login", this.controller.login);
        return router;
    }
} 