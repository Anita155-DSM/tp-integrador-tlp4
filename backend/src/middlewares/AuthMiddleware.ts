import type { Request, Response, NextFunction } from "express";
import type { AuthService, AuthUser } from "../services/AuthService.js";
import type { JwtService } from "../helpers/JwtService.js";
import { AppError } from "../errors/AppError.js";

declare global { // agrega la propiedad user al Request de Express para todo el proyecto
    namespace Express { 
        interface Request {
            user?: AuthUser;
        }
    }
}

export class AuthMiddleware {
    constructor(
        private readonly jwt: JwtService,
        private readonly authService: AuthService,
    ) {}

    authenticate = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
        try {
            const header = req.headers.authorization;
            if (header === undefined || !header.startsWith("Bearer ")) {
                throw AppError.Unauthorized("Falta el token de autenticación");
            }
            const token = header.slice("Bearer ".length);
            const { userId } = this.jwt.verify(token);
            req.user = await this.authService.getAuthUser(userId);
            next();
        } catch (error) {
            next(error);
        }
    };
}