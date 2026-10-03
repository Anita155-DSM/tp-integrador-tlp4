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

import { EventPublisher } from "./observer/EventPublisher.js";

const publisher = new EventPublisher<string>();
publisher.attach({ update: async (e) => console.log("recibí:", e) });
await publisher.notify("hola");

import { ConsoleNotifierAdapter } from "./notifications/ConsoleNotifierAdapter.js";

const notifier = new ConsoleNotifierAdapter();
await notifier.send({
    userId: "1",
    userEmail: "usuario@tp.com",
    ticketId: "12",
    ticketTitle: "No anda el mail",
    previousStatus: "ABIERTO",
    newStatus: "EN_PROGRESO",
    read: false,
});

import { PasswordHasher } from "./helpers/PasswordHasher.js";

const hasher = new PasswordHasher();
const h1 = await hasher.hash("secreto123");
const h2 = await hasher.hash("secreto123");

console.log(h1 === h2);                              // false
console.log(await hasher.compare("secreto123", h1)); // true
console.log(await hasher.compare("otra", h1));       // false