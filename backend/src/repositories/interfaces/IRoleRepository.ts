import type { IRole, RoleDocument } from "../models/Role.js";

export interface IRoleRepository {
    findById(id: string): Promise<RoleDocument | null>;
    findByName(name: string): Promise<RoleDocument | null>;
    findAll(): Promise<RoleDocument[]>;
    create(data: IRole): Promise<RoleDocument>;
}