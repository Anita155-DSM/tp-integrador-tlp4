import type { Request, Response, NextFunction, RequestHandler } from "express";
import { AppError } from "../errors/AppError.js";

export class AuthorizeMiddleware {
    authorize(permission: string): RequestHandler {
        return (req: Request, _res: Response, next: NextFunction): void => {
            if (req.user === undefined) {
                next(AppError.Unauthorized("falta autenticarse"));
                return;
            }
            if (!req.user.permissions.includes(permission)) {
                next(AppError.Forbidden("no tenés permiso para esta acción"));
                return;
            }
            next();
        };
    }
}