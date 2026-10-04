import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError.js";

export class errorMiddleware {
    handle= (error: unknown, _req: Request, res: Response, _next: NextFunction): void => { //el error puede ser cualquier cosa, usamos unknown para que no sea any
        if (error instanceof AppError){
            res.status(error.statusCode).json({ message: error.message})
            return;
        }
        console.error(error)
        res.status(500).json({message: "error interno del servidor"})
    }
}