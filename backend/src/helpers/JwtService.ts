import jwt, { type JwtPayload } from "jsonwebtoken";
import { Env } from "../config/Env.js";
import { AppError } from "../errors/AppError.js";

export interface TokenPayload {
    userId: string;
}

export class JwtService {
    private static readonly EXPIRES_IN_SECONDS = 60 * 60 * 8;

    sign(payload: TokenPayload): string {
        return jwt.sign(payload, Env.JWT_SECRET, {
            expiresIn: JwtService.EXPIRES_IN_SECONDS,
        });
    }

    verify(token: string): TokenPayload {
        let decoded: string | JwtPayload;
        try {
            decoded = jwt.verify(token, Env.JWT_SECRET);
        } catch {
            throw AppError.Unauthorized("Token inválido o vencido");
        }
        if (typeof decoded === "string" || typeof decoded.userId !== "string") {
            throw AppError.Unauthorized("Token inválido");
        }
        return { userId: decoded.userId };
    }
}