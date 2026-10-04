import type { Request, Response, NextFunction } from "express";
import type { AuthService } from "../services/AuthService.js";
import { AppError } from "../errors/AppError.js";

export class AuthController {
    constructor(private readonly authService: AuthService) {}

    register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { name, email, password } = req.body;
            if (typeof name !== "string" || name.trim() === "") {
                throw AppError.BadRequest("El nombre es obligatorio");
            }
            if (typeof email !== "string" || !email.includes("@")) {
                throw AppError.BadRequest("El email no es válido");
            }
            if (typeof password !== "string" || password.length < 6) {
                throw AppError.BadRequest("La contraseña debe tener al menos 6 caracteres");
            }
            const user = await this.authService.register({ name: name, email, password });
            res.status(201).json(user);
        } catch (error) {
            next(error);
        }
    };

    login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { email, password } = req.body;
            if (typeof email !== "string" || typeof password !== "string") {
                throw AppError.BadRequest("Email y contraseña son obligatorios");
            }
            const result = await this.authService.login(email, password);
            res.json(result);
        } catch (error) {
            next(error);
        }
    };
}