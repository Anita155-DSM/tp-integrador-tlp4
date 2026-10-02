// este archivo es nada mas para hacer pruebas 
import { AppError } from "./errors/AppError.js";
// import dotenv from 'dotenv'
// dotenv.config()

console.log(AppError.NotFound("Ticket no encontrado").message);
console.log(AppError.NotFound().message);
console.log(AppError.Forbidden().statusCode);
// console.log(process.env.DB_USER); //prueba sin nuestro archivo Env.ts, imprime undefind

import dotenv from "dotenv";
import path from "node:path";

dotenv.config({ path: path.resolve(import.meta.dirname, "../../.env") });

console.log(process.env.DB_USER);

import { DatabaseConnection } from "./database/DatabaseConnection.js";

const a = DatabaseConnection.getInstance();
const b = DatabaseConnection.getInstance();
console.log(a === b);

await a.connectDB();
await a.disconnectDB();