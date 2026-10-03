import { Schema, model, type Types } from "mongoose";
import { HydratedDocument } from "mongoose";

export interface IUser {
    name: string;
    email: string;
    passwordHash: string;
    role: Types.ObjectId;
}

const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: Schema.Types.ObjectId, ref: "Role", required: true },
});

export type UserDocument = HydratedDocument<IUser>;
export const User = model<IUser>("User", userSchema);