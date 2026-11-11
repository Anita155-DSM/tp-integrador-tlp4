// Punto de entrada de la configuración: lee el .env y valida que no falte ninguna variable.

import dotenv from 'dotenv'
import path from "node:path";

dotenv.config({path: path.resolve(import.meta.dirname, "../../../.env")})
// carga el .env de la raíz del repositorio en process.env (en Docker las variables llegan desde docker-compose)


// si falta alguna variable, la app se detiene al arrancar e indica cuál falta
export class Env {
    private static required(name: string): string {
        const value = process.env[name];
        if (value === undefined || value === "") {
            throw new Error(`falta la variable de entorno ${name}`);
        }
        return value;
    }

    static readonly DB_HOST = Env.required("DB_HOST");
    static readonly DB_PORT = Number(Env.required("DB_PORT")); // las variables de entorno son texto: se convierten a número
    static readonly DB_USER = Env.required("DB_USER");
    static readonly DB_PASSWORD = Env.required("DB_PASSWORD");
    static readonly DB_NAME = Env.required("DB_NAME");
    static readonly JWT_SECRET = Env.required("JWT_SECRET");
    static readonly API_PORT = Number(Env.required("API_PORT"));
}