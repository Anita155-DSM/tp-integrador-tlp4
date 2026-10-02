import express, {type Express, type Router} from 'express'
import { Env } from './config/Env.js'
import cors from 'cors'

export class App {
    private readonly app: Express

    constructor(app: Express){
        this.app= express()
        //ya voy a agregar cors, express.json
    }
    registerRouter(){//tiene que recibir un path y un router

    }
    start(): void {
        this.app.listen(Env.API_PORT, ()=> { console.log(`puerto escuchando al ${Env.API_PORT}`)}) //aca le decimos que escuche el puerto de mi variable de entorno
    }
}