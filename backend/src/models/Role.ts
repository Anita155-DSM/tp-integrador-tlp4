import { Schema, model } from "mongoose";

export interface IRole {
    name: string;
    permissions: string[];
}

const roleSchema = new Schema<IRole>({
    name: { type: String, required: true, unique: true },
    permissions: { type: [String], default: [] },
});

export const Role = model<IRole>("Role", roleSchema);