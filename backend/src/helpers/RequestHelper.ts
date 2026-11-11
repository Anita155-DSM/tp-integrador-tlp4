import type { Request } from "express";
import { AppError } from "../errors/AppError.js";

//helpers compartidos por los controllers para leer y validar datos del request
export class RequestHelper {
    private static readonly OBJECT_ID_PATTERN = /^[0-9a-fA-F]{24}$/;

    static getUserId(req: Request): string {
        const user = req.user;
        if (user === undefined) {
            throw AppError.Unauthorized();
        }
        return user.id;
    }

    static requireString(value: unknown, field: string): string {
        if (typeof value !== "string" || value.trim() === "") {
            throw AppError.BadRequest(`El campo ${field} es obligatorio`);
        }
        return value;
    }

    //un id con formato invalido es culpa del cliente: 400 en vez de dejar que mongoose tire CastError (500)
    static requireObjectId(value: unknown, message: string = "Id inválido"): string {
        if (typeof value !== "string" || !RequestHelper.OBJECT_ID_PATTERN.test(value)) {
            throw AppError.BadRequest(message);
        }
        return value;
    }
}
