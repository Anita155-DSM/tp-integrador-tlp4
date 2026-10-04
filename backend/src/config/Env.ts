//el env nos sirve como "puerta de entrada de la configuracion", este archivo lee nuestro .env
//revisa que no falte nada del .env y deja los datos a manop

import dotenv from 'dotenv' //limportamos dotenv como siempre
import path from "node:path";

dotenv.config({path: path.resolve(import.meta.dirname, "../../../.env")}) //nada mas que aca en la configuracion como que le agregamosconfiguracion
//va hasta el .env de la rtaiz y copia sus datos a process.env, va aqui de primero para que corra antes de que lea el resto del codigo


//el Env si falta allguna variable, la app se frena al arrancar y nombra la que le falta, ese sería el trabajo de esta clase
export class Env {
    private static required(name: string): string {
        const value = process.env[name];//busca la variable que su nombre que llega en name [] es porque es una variable no un texto fijo
        if (value === undefined || value === "") { //no puede ser undefined ni vacio, por eso si esta condicion se cumple, lanza un error 
            throw new Error(`falta la variable de entorno ${name}`);
        }
        return value;
    }

    static readonly DB_HOST = Env.required("DB_HOST"); //convierte el texto a numero, porque las variables de entorno siempre son texto
    static readonly DB_PORT = Number(Env.required("DB_PORT")); 
    static readonly DB_USER = Env.required("DB_USER");
    static readonly DB_PASSWORD = Env.required("DB_PASSWORD");
    static readonly DB_NAME = Env.required("DB_NAME");
    static readonly JWT_SECRET = Env.required("JWT_SECRET");
    static readonly API_PORT = Number(Env.required("API_PORT"));
}