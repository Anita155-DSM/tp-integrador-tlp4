import { Schema, model } from "mongoose";
import { HydratedDocument } from "mongoose";

export interface IRole {
    name: string;
    permissions: string[];
}

const roleSchema = new Schema<IRole>({
    name: { type: String, required: true, unique: true },
    permissions: { type: [String], default: [] },
});

export type RoleDocument = HydratedDocument<IRole>;
export const Role = model<IRole>("Role", roleSchema);