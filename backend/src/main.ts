// console.log('Backend TP integrador iniciado'); //no ahce nada 
import { DatabaseConnection } from "./database/DatabaseConnection.js";
import { App } from "./app.js";
import { errorMiddleware } from "./middlewares/ErrorMiddleware.js";
import { RoleRepository } from "./repositories/RoleRepository.js";
import { UserRepository } from "./repositories/UserRepository.js";
import { JwtService } from "./helpers/JwtService.js";
import { PasswordHasher } from "./helpers/PasswordHasher.js";
import { Seed } from "./database/Seed.js";
import { AuthRoutes } from "./routes/AuthRoutes.js";
import { AuthService } from "./services/AuthService.js";
import { AuthController } from "./controllers/AuthController.js";
import { AuthMiddleware } from "./middlewares/AuthMiddleware.js";
import { AuthorizeMiddleware } from "./middlewares/AuthorizeMiddleware.js";
import { Router } from "express";


try {
    await DatabaseConnection.getInstance().connectDB() 
    const app = new App() //aca crea el servidor Express, o sea aca va el new, porque main.ts es el unico lugar donde se crean las piezas

    const roleRepository = new RoleRepository()
    const userRepository = new UserRepository();
    const passwordHasher = new PasswordHasher();
    const jwtService = new JwtService();

    await new Seed(roleRepository, userRepository, passwordHasher).run();

    // ESTO ES TODO LO QUE ES Autenticación
    const authService = new AuthService(userRepository, roleRepository, passwordHasher, jwtService);
    const authController = new AuthController(authService);
    const authMiddleware = new AuthMiddleware(jwtService, authService);
    const authorizeMiddleware = new AuthorizeMiddleware();
    app.registerRouter("/api/auth", new AuthRoutes(authController).getRouter());

    const pruebaRouter = Router();
    pruebaRouter.get(
        "/solo-admin",
        authMiddleware.authenticate,
        authorizeMiddleware.authorize("user:read"),
        (_req, res) => { res.json({ ok: true }); },
    );
    app.registerRouter("/api/prueba", pruebaRouter);

    app.registerErrorHandler(new errorMiddleware().handle);
    app.start()//inicializa el servidor
} catch (error) {
    console.error(error)
    process.exit(1)//apaga o corta el servidor paera q no se levante
}