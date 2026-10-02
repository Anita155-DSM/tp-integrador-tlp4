//implementamos Singleton en la conexion a la bd, esto lo hacemos sabiendo que en singleton solo puede existir una instancia en una clase
//app habla con Mongo a través de una conexión, si cada archivo abriera la suya, 
//habría decenas de conexiones abiertas gastando recursos, lo que queremos es una sola, compartida por todos, o sea, singleton
import { Env } from "../config/Env.js";
import mongoose from "mongoose";

export class DatabaseConnection {
    private static instance: DatabaseConnection; //instance es de tipo databaseconection
    private constructor(){ //tiene que ser privado para que no se pueda acceder dea fuera
    }
    static getInstance(): DatabaseConnection {  //sin static el metodo perteneceria  a una instancia y nuestro constructor es privado, entonces no se podria instanciar de afuera 
        //una sola instancia
        if (DatabaseConnection.instance === undefined){ //si es undefined instanciamos, ahora agregue el if porque sino no cumplia con el singleton ya que en cada llamada instanciaba, ahora si el valor es vacio instancia una sola vez y lo guarda:)
            DatabaseConnection.instance = new DatabaseConnection() //instanciamos
        }
        return DatabaseConnection.instance //retornamos 
    }
    async connectDB(): Promise<void> {
        const uri = `mongodb://${Env.DB_USER}:${Env.DB_PASSWORD}@${Env.DB_HOST}:${Env.DB_PORT}/${Env.DB_NAME}?authSource=admin`; //la uri que se compunica con nuestro docker, accedemos a las variables de entorno desde Env.ts
        await mongoose.connect(uri)
        console.log("conexion realizada correctamente")
    }
    async disconnectDB(): Promise<void>{
        await mongoose.disconnect() //desconecta la bd
    }
}