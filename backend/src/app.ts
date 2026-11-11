import express, {Router, type Express} from 'express'
import { Env } from './config/Env.js'
import cors from 'cors'
import { ErrorRequestHandler } from 'express'

export class App {
    private readonly app: Express

    constructor(){
        this.app= express()
        this.app.use(cors())
        this.app.use(express.json())
        this.app.get("/api/health", (_req, res)=>{
            res.json({"status": "ok"})
        })

    }
    registerRouter(path: string, router: Router): void{
        this.app.use(path, router)
    }
    registerErrorHandler(handler: ErrorRequestHandler): void {
       this.app.use(handler);
    }
    start(): void {
        this.app.listen(Env.API_PORT, ()=> { console.log(`puerto escuchando al ${Env.API_PORT}`)})
    }
}