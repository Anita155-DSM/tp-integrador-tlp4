// console.log('Backend TP integrador iniciado'); //no hace nada
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
import { UserService } from "./services/UserService.js"; //importaciones para administracion de usuario, nuevo trabajado, de aca hasta userroutes:)
import { UserController } from "./controllers/UserController.js";
import { UserRoutes } from "./routes/UserRoutes.js";
import { TicketRepository } from "./repositories/TicketRepository.js";
import { SubscriptionRepository } from "./repositories/SubscriptionRepository.js";
import { NotificationRepository } from "./repositories/NotificationRepository.js";
import { EventPublisher } from "./observer/EventPublisher.js";
import { NotifierFactory } from "./notifications/NotifierFactory.js";
import { TicketService } from "./services/TicketService.js";
import { SubscriptionService } from "./services/SubscriptionService.js";
import { NotificationService } from "./services/NotificationService.js";
import { TicketController } from "./controllers/TicketController.js";
import { SubscriptionController } from "./controllers/SubscriptionController.js";
import { NotificationController } from "./controllers/NotificationController.js";
import { TicketRoutes } from "./routes/TicketRoutes.js";
import { SubscriptionRoutes } from "./routes/SubscriptionRoutes.js";
import { NotificationRoutes } from "./routes/NotificationRoutes.js";
import type { TicketStatusChangedEvent } from "./notifications/TicketStatusChangedEvent.js";


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
    app.registerRouter("/api/auth", new AuthRoutes(authController, authMiddleware).getRouter());

    // administración de usuarios
    const userService = new UserService(userRepository, roleRepository);
    const userController = new UserController(userService);
    app.registerRouter(
        "/api/users",
        new UserRoutes(userController, authMiddleware, authorizeMiddleware).getRouter(),
    );

    // tickets, suscripciones y notificaciones
    const ticketRepository = new TicketRepository();
    const subscriptionRepository = new SubscriptionRepository();
    const notificationRepository = new NotificationRepository();

    const eventPublisher = new EventPublisher<TicketStatusChangedEvent>();
    const notifierFactory = new NotifierFactory(notificationRepository);
    const notifiers = [notifierFactory.create("inapp"), notifierFactory.create("console")];
    const notificationService = new NotificationService(
        subscriptionRepository,
        userRepository,
        notificationRepository,
        notifiers,
    );
    eventPublisher.attach(notificationService);

    const ticketService = new TicketService(ticketRepository, subscriptionRepository, eventPublisher);
    const ticketController = new TicketController(ticketService);
    app.registerRouter(
        "/api/tickets",
        new TicketRoutes(ticketController, authMiddleware, authorizeMiddleware).getRouter(),
    );

    const subscriptionService = new SubscriptionService(subscriptionRepository, ticketRepository);
    const subscriptionController = new SubscriptionController(subscriptionService, ticketService);
    app.registerRouter(
        "/api/subscriptions",
        new SubscriptionRoutes(subscriptionController, authMiddleware, authorizeMiddleware).getRouter(),
    );

    const notificationController = new NotificationController(notificationService);
    app.registerRouter(
        "/api/notifications",
        new NotificationRoutes(notificationController, authMiddleware, authorizeMiddleware).getRouter(),
    );

    app.registerErrorHandler(new errorMiddleware().handle);
    app.start()//inicializa el servidor
} catch (error) {
    console.error(error)
    process.exit(1)//apaga o corta el servidor paera q no se levante
}