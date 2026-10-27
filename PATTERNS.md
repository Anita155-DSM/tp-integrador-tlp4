# Patrones de diseño y principios SOLID

## Singleton

**Archivo:** `backend/src/database/DatabaseConnection.ts`

**Problema que resuelve:** El backend necesita hablar con MongoDB desde varios lugares. Si cada archivo abriera su propia conexión, habría muchas conexiones abiertas a la vez gastando recursos. Con el Singleton hay una sola instancia de `DatabaseConnection`, compartida por todo el backend: la primera vez que se pide se crea, y las siguientes veces se devuelve la misma. El constructor es privado para que nadie pueda hacer `new DatabaseConnection()` por su cuenta.

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

**Problema que resuelve:** El sistema de notificaciones espera algo con la forma `send(notification)`, que es la interfaz `INotifier`. Pero la consola no sabe nada de eso: solo sabe imprimir texto con `console.log`. El Adapter hace de traductor: recibe una `Notification`, arma el texto y lo imprime. Así `NotificationService` puede enviar por consola igual que por cualquier otro canal, sin saber que por debajo hay un `console.log`.

```ts
export class ConsoleNotifierAdapter implements INotifier {
    async send(notification: Notification): Promise<void> {
        console.log(`[NOTIFICACIÓN] Para: ${notification.userEmail} | Ticket #${notification.ticketId} | Estado: ${notification.previousStatus} → ${notification.newStatus}`);
    }
}
```

## Observer

**Archivos:** `backend/src/observer/ISubject.ts`, `backend/src/observer/IObserver.ts` y `backend/src/observer/EventPublisher.ts` (el lado Subject). *Nata agrega acá el lado Observer: `NotificationService`.*

**Problema que resuelve:** Cuando cambia el estado de un ticket, hay que avisar a alguien (las notificaciones), pero `TicketService` no debería saber quién recibe el aviso ni qué hace con él. El `EventPublisher` guarda una lista de interesados (los observers) y, cuando ocurre un evento, los avisa a todos con `notify`. Para sumar un interesado nuevo alcanza con hacer `attach`, sin tocar el servicio de tickets. Es genérico (`<TEvent>`) para poder usarlo con cualquier tipo de evento.

```ts
export class EventPublisher<TEvent> implements ISubject<TEvent> {
    private observers: IObserver<TEvent>[] = [];

    attach(observer: IObserver<TEvent>): void {
        this.observers.push(observer);
    }

    detach(observer: IObserver<TEvent>): void {
        this.observers = this.observers.filter((o) => o !== observer);
    }

    async notify(event: TEvent): Promise<void> {
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

**Problema que resuelve:** Cada capa tiene un solo trabajo. El controller recibe el pedido HTTP, valida lo que llega y responde. El service aplica las reglas de negocio (por ejemplo, que el email no esté repetido o que la contraseña coincida) y no sabe nada de `req` ni `res`. El repository es el único que habla con MongoDB. Gracias a esto, un cambio en la base de datos no obliga a tocar el controller.

```ts
// AuthController: solo recibe el pedido y delega en el service
const result = await this.authService.login(email, password);
res.json(result);
```

### O: Abierto/cerrado
*(Nata: agregar un canal nuevo sin modificar `NotificationService`.)*

### L: Sustitución de Liskov
*(Nata: cualquier `INotifier` reemplaza a otro. Se puede sumar que `ConsoleNotifierAdapter` es uno de ellos.)*

### I: Segregación de interfaces
*(Nata, o ambas: interfaces de repositorio chicas y específicas. `IRoleRepository` tiene solo cuatro métodos, y no obliga a nadie a implementar lo que no usa.)*

### D: Inversión de dependencias

**Archivos:** `backend/src/services/AuthService.ts`, `backend/src/services/UserService.ts` y `backend/src/main.ts`.

**Problema que resuelve:** Los services no dependen de clases concretas sino de interfaces como `IUserRepository`. Por eso no saben que por debajo hay Mongoose, y se podría cambiar la base de datos sin modificarlos. Quien decide qué implementación concreta se usa y arma todas las piezas con `new` es `main.ts`, que las pasa por el constructor.

```ts
export class UserService {
    constructor(
        private readonly users: IUserRepository,
        private readonly roles: IRoleRepository,
    ) {}
}
```
