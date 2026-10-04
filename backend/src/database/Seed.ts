import type { IRoleRepository } from "../interfaces/IRoleRepository.js"
import type { IUserRepository } from "../interfaces/IUserRepository.js"
import type { PasswordHasher } from "../helpers/PasswordHasher.js"

export class Seed {
    private static readonly ROLES = [
        {
            name: "usuario",
            permissions: ["ticket:read", "subscription:create", "subscription:delete", "notification:read"],
        },
        {
            name: "operador",
            permissions: [
                "ticket:read", "ticket:create", "ticket:update", "ticket:change-status",
                "subscription:create", "subscription:delete", "notification:read",
            ],
        },
        {
            name: "admin",
            permissions: [
                "ticket:read", "ticket:create", "ticket:update", "ticket:change-status", "ticket:delete",
                "subscription:create", "subscription:delete", "notification:read",
                "user:read", "user:assign-role",
            ],
        },
    ];

    private static readonly USERS = [
        { name: "Admin", email: "admin@tp.com", password: "admin123", role: "admin" },
        { name: "Operador", email: "operador@tp.com", password: "operador123", role: "operador" },
        { name: "Usuario", email: "usuario@tp.com", password: "usuario123", role: "usuario" },
    ];

    constructor(
        private readonly roles: IRoleRepository,
        private readonly users: IUserRepository,
        private readonly hasher: PasswordHasher,
    ) {}

    async run(): Promise<void> {
        for (const data of Seed.ROLES) {
            const existing = await this.roles.findByName(data.name);
            if (existing === null) {
                await this.roles.create(data);
            }
        }

        for (const data of Seed.USERS) {
            const existing = await this.users.findByEmail(data.email);
            if (existing === null) {
                const role = await this.roles.findByName(data.role);
                if (role === null) {
                    throw new Error(`El rol ${data.role} no existe`);
                }
                await this.users.create({
                    name: data.name,
                    email: data.email,
                    passwordHash: await this.hasher.hash(data.password),
                    role: role._id,
                });
            }
        }

        console.log("Seed ejecutado");
    }
}