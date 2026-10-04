import { User, type IUser, type UserDocument } from "../models/User.js";
import type { IUserRepository } from "../interfaces/IUserRepository.js";

export class UserRepository implements IUserRepository {
    async findById(id: string): Promise<UserDocument | null> {
        return User.findById(id);
    }

    async findByEmail(email: string): Promise<UserDocument | null> {
        return User.findOne({ email: email.toLowerCase() });
    }

    async findAll(): Promise<UserDocument[]> {
        return User.find().select("-passwordHash");
    }

    async create(data: IUser): Promise<UserDocument> {
        return User.create(data);
    }

    async updateRole(id: string, roleId: string): Promise<UserDocument | null> {
        return User.findByIdAndUpdate(id, { role: roleId }, { new: true });
    }
}