import type { Request, Response, NextFunction } from "express";
import type { UserService } from "../services/UserService.js";
import { AppError } from "../errors/AppError.js";
import { RequestHelper } from "../helpers/RequestHelper.js";

export class UserController {
    constructor(private readonly userService: UserService) {}

    list = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            res.json(await this.userService.list());
        } catch (error) {
            next(error);
        }
    };

    assignRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = RequestHelper.requireObjectId(req.params.id, "El id del usuario no es válido");
            const { role } = req.body ?? {};
            if (typeof role !== "string" || role.trim() === "") {
                throw AppError.BadRequest("El rol es obligatorio");
            }
            res.json(await this.userService.assignRole(id, role.trim()));
        } catch (error) {
            next(error);
        }
    };
}
