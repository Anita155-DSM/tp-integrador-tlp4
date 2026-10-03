import type { IUser, UserDocument } from "../models/User.js"

export interface IUserRepository {
    findById(id: string): Promise<UserDocument | null>;
    findByEmail(email: string): Promise<UserDocument | null>;
    findAll(): Promise<UserDocument[]>;
    create(data: IUser): Promise<UserDocument>;
    updateRole(id: string, roleId: string): Promise<UserDocument | null>;
}