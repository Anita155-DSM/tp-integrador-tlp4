import { Role, type IRole, type RoleDocument } from "../models/Role.js";
import type { IRoleRepository } from "../interfaces/IRoleRepository.js";

export class RoleRepository implements IRoleRepository {
    async findById(id: string): Promise<RoleDocument | null> {
        return Role.findById(id);
    }

    async findByName(name: string): Promise<RoleDocument | null> {
        return Role.findOne({ name });
    }

    async findAll(): Promise<RoleDocument[]> {
        return Role.find();
    }

    async create(data: IRole): Promise<RoleDocument> {
        return Role.create(data);
    }
}