# Patrones de diseño y principios SOLID

## Singleton

**Archivo:** `backend/src/database/DatabaseConnection.ts`

**Problema que resuelve:** *(escribilo con tus palabras: dos o tres oraciones. Idea: si cada archivo abriera su propia conexión a Mongo habría decenas de conexiones abiertas gastando recursos. El Singleton garantiza una sola instancia, compartida por todo el backend.)*

```ts
export class DatabaseConnection {
    private static instance: DatabaseConnection | undefined;

    private constructor() {}

    static getInstance(): DatabaseConnection {
        if (DatabaseConnection.instance === undefined) {
            DatabaseConnection.instance = new DatabaseConnection();
        }
        return DatabaseConnection.instance;
    }
}
```

## Adapter

**Archivo:** `backend/src/notifications/ConsoleNotifierAdapter.ts`

**Problema que resuelve:** *(idea: el sistema espera algo con la forma `send(notification)` (`INotifier`), pero la consola solo sabe imprimir texto con `console.log`. El Adapter traduce una cosa en la otra, y así `NotificationService` envía por consola sin saber que existe `console.log`.)*

```ts
export class ConsoleNotifierAdapter implements INotifier {
    async send(notification: Notification): Promise<void> {
        console.log(`[NOTIFICACIÓN] Para: ${notification.userEmail} | Ticket #${notification.ticketId} | Estado: ${notification.previousStatus} → ${notification.newStatus}`);
    }
}
```

## Observer

**Archivos:** `backend/src/observer/ISubject.ts`, `backend/src/observer/IObserver.ts` y `backend/src/observer/EventPublisher.ts` *(el lado Subject)*. *Nata agrega acá el lado Observer: `NotificationService`.*

**Problema que resuelve:** *(idea: `TicketService` necesita avisar cuando cambia un estado, pero no debe conocer qué se hace con el aviso. El `EventPublisher` guarda una lista de interesados y los avisa a todos, y se puede sumar uno nuevo sin tocar el servicio de tickets.)*

```ts
export class EventPublisher<TipoEvento> implements ISubject<TipoEvento> {
    private observers: IObserver<TipoEvento>[] = [];

    attach(observer: IObserver<TipoEvento>): void {
        this.observers.push(observer);
    }

    detach(observer: IObserver<TipoEvento>): void {
        this.observers = this.observers.filter((o) => o !== observer);
    }

    async notify(event: TipoEvento): Promise<void> {
        for (const observer of this.observers) {
            await observer.update(event);
        }
    }
}
```

## Factory

*(Sección de Nata: `NotifierFactory`.)*

## Principios SOLID

### S: Responsabilidad única

**Archivos:** `backend/src/controllers/AuthController.ts`, `backend/src/services/AuthService.ts` y `backend/src/repositories/UserRepository.ts`.

**Problema que resuelve:** *(idea: cada capa tiene un solo trabajo. El controller valida la entrada y responde, el service aplica las reglas de negocio, y el repository es el único que habla con Mongo. Un cambio en la base no toca al controller.)*

```ts
// AuthController: solo valida el pedido y delega
const result = await this.authService.login(email, password);
res.json(result);
```

### O: Abierto/cerrado
*(Nata: agregar un canal nuevo sin modificar `NotificationService`.)*

### L: Sustitución de Liskov
*(Nata: cualquier `INotifier` reemplaza a otro. Podés sumar que `ConsoleNotifierAdapter` es uno de ellos.)*

### I: Segregación de interfaces
*(Nata, o ambas: interfaces de repositorio chicas y específicas. `IRoleRepository` tiene solo cuatro métodos, y no obliga a nadie a implementar lo que no usa.)*

### D: Inversión de dependencias

**Archivos:** `backend/src/services/AuthService.ts`, `backend/src/services/UserService.ts` y `backend/src/main.ts`.

**Problema que resuelve:** *(idea: los services reciben interfaces (`IUserRepository`), no clases concretas, así que no saben que debajo hay Mongoose. Quien arma las piezas con `new` es `main.ts`.)*

```ts
export class UserService {
    constructor(
        private readonly users: IUserRepository,
        private readonly roles: IRoleRepository,
    ) {}
}
```
