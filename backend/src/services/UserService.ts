import type { IUserRepository } from "../repositories/interfaces/IUserRepository.js";
import type { IRoleRepository } from "../repositories/interfaces/IRoleRepository.js";
import type { UserDocument } from "../models/User.js";
import { AppError } from "../errors/AppError.js";

export interface UserSummary {
    id: string;
    name: string;
    email: string;
    role: string;
}

export class UserService {
    constructor(
        private readonly users: IUserRepository,
        private readonly roles: IRoleRepository,
    ) { }

    async list(): Promise<UserSummary[]> {
        const users = await this.users.findAll();
        const roles = await this.roles.findAll();

        const result: UserSummary[] = [];
        for (const user of users) {
            const role = roles.find((r) => r._id.toString() === user.role.toString());
            const roleName = role === undefined ? "sin rol" : role.name;
            result.push(this.toSummary(user, roleName));
        }
        return result;
    }

    async assignRole(userId: string, roleName: string): Promise<UserSummary> {
        const role = await this.roles.findByName(roleName);
        if (role === null) {
            throw AppError.BadRequest("El rol no existe");
        }
        const user = await this.users.updateRole(userId, role.id);
        if (user === null) {
            throw AppError.NotFound("Usuario no encontrado");
        }
        return this.toSummary(user, role.name);
    }

    private toSummary(user: UserDocument, roleName: string): UserSummary {
        return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: roleName,
        };
    }
}
