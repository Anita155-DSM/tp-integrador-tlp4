import bcrypt from "bcrypt";

export class PasswordHasher {
    private static readonly SALT_ROUNDS = 10;

    async hash(Password: string): Promise<string> {
        return bcrypt.hash(Password, PasswordHasher.SALT_ROUNDS);
    }

    async compare(Password: string, passwordHash: string): Promise<boolean> {
        return bcrypt.compare(Password, passwordHash);
    }
}