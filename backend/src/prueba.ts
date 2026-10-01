// este archivo es nada mas para hacer pruebas 
import { AppError } from "./errors/AppError.js";

console.log(AppError.NotFound("Ticket no encontrado").message);
console.log(AppError.NotFound().message);
console.log(AppError.Forbidden().statusCode);