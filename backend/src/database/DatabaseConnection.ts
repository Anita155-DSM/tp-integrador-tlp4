// Singleton: una única conexión a MongoDB compartida por todo el backend, en lugar de una por archivo.
import { Env } from "../config/Env.js";
import mongoose from "mongoose";

export class DatabaseConnection {
    private static instance: DatabaseConnection;
    private constructor(){ // privado: nadie puede hacer new DatabaseConnection() desde afuera
    }
    static getInstance(): DatabaseConnection {
        if (DatabaseConnection.instance === undefined){ // se crea solo la primera vez; las siguientes llamadas devuelven la misma instancia
            DatabaseConnection.instance = new DatabaseConnection()
        }
        return DatabaseConnection.instance
    }
    async connectDB(): Promise<void> {
        const uri = `mongodb://${Env.DB_USER}:${Env.DB_PASSWORD}@${Env.DB_HOST}:${Env.DB_PORT}/${Env.DB_NAME}?authSource=admin`;
        await mongoose.connect(uri)
        console.log("conexion realizada correctamente")
    }
    async disconnectDB(): Promise<void>{
        await mongoose.disconnect()
    }
}