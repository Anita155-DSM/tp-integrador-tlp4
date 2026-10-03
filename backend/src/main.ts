// console.log('Backend TP integrador iniciado'); //no ahce nada 
import { DatabaseConnection } from "./database/DatabaseConnection.js";
import { App } from "./app.js";
import { errorMiddleware } from "./middlewares/ErrorMiddleware.js";


try {
    await DatabaseConnection.getInstance().connectDB() 
    const app = new App() //aca crea el servidor Express, o sea aca va el new, porque main.ts es el unico lugar donde se crean las piezas
    app.start()//inicializa el servidor
    app.registerErrorHandler(new errorMiddleware().handle);
} catch (error) {
    console.error(error)
    process.exit(1)//apaga o corta el servidor paera q no se levante
}