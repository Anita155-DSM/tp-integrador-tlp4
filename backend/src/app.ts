import express, {Router, type Express} from 'express'
import { Env } from './config/Env.js'
import cors from 'cors'
import { ErrorRequestHandler } from 'express'

export class App {
    private readonly app: Express

    constructor(){
        this.app= express()
        this.app.use(cors())
        this.app.use(express.json()) //convierte el cuerpo json a un objeto
        this.app.get("/api/health", (_req, res)=>{
            res.json({"status": "ok"}) //si consultan a esta ruta, le dice el estado
        })

    }
    registerRouter(path: string, router: Router): void{//recibe un path y un router
        this.app.use(path, router)
    }
    registerErrorHandler(handler: ErrorRequestHandler): void {
       this.app.use(handler);
    }
    start(): void {
        this.app.listen(Env.API_PORT, ()=> { console.log(`puerto escuchando al ${Env.API_PORT}`)}) //aca le decimos que escuche el puerto de mi variable de entorno
    }
}