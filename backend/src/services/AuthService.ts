// aca iria toda nuestra regla de negocio donde implementamos todo lo anterior trabajado, osea repositorios, PasswordHasher y JwtService

import type { IUserRepository } from "../interfaces/IUserRepository.js";
import type { IRoleRepository } from "../interfaces/IRoleRepository.js";
import type { UserDocument } from "../models/User.js";
import type { PasswordHasher } from "../helpers/PasswordHasher.js";
import type { JwtService } from "../helpers/JwtService.js";
import { AppError } from "../errors/AppError.js";

export interface RegisterData {
    name: string;
    email: string;
    password: string;
}

export interface AuthUser {
    id: string;
    name: string;
    email: string;
    role: string;
    permissions: string[];
}

export interface LoginResult {
    token: string;
    user: AuthUser;
}

export class AuthService {
    constructor(
        private readonly users: IUserRepository,
        private readonly roles: IRoleRepository,
        private readonly hasher: PasswordHasher,
        private readonly jwt: JwtService,
    ) {}

    async register(data: RegisterData): Promise<AuthUser> {
        const existing = await this.users.findByEmail(data.email);
        if (existing !== null) {
            throw AppError.BadRequest("el email ya está registrado");
        }
        const role = await this.roles.findByName("usuario");
        if (role === null) {
            throw new Error("el rol usuario no existe: falta ejecutar el seed");
        }
        const user = await this.users.create({
            name: data.name,
            email: data.email,
            passwordHash: await this.hasher.hash(data.password),
            role: role._id,
        });
        return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: role.name,
            permissions: role.permissions,
        };
    }

    async login(email: string, password: string): Promise<LoginResult> {
        const user = await this.users.findByEmail(email);
        if (user === null || !(await this.hasher.compare(password, user.passwordHash))) {
            throw AppError.Unauthorized("email o contraseña incorrectos");
        }
        return {
            token: this.jwt.sign({ userId: user._id.toString() }),
            user: await this.toAuthUser(user),
        };
    }

    async getAuthUser(userId: string): Promise<AuthUser> {
        const user = await this.users.findById(userId);
        if (user === null) {
            throw AppError.Unauthorized("usuario inexistente");
        }
        return this.toAuthUser(user);
    }

    private async toAuthUser(user: UserDocument): Promise<AuthUser> {
        const role = await this.roles.findById(user.role.toString());
        if (role === null) {
            throw new Error("el usuario tiene un rol que no existe");
        }
        return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: role.name,
            permissions: role.permissions,
        };
    }
}