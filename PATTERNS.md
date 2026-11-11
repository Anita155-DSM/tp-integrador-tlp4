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

**Archivos:** `backend/src/observer/ISubject.ts`, `backend/src/observer/IObserver.ts` y `backend/src/observer/EventPublisher.ts` (el lado Subject). El lado Observer, `backend/src/services/NotificationService.ts`, está detallado más abajo.

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

### Lado Observer: `NotificationService`

**Archivos:** `backend/src/services/NotificationService.ts` y `backend/src/main.ts` (donde se hace el `attach`).

**Problema que resuelve:** `NotificationService` implementa `IObserver<TicketStatusChangedEvent>`, así que el `EventPublisher` lo puede avisar sin conocer su clase concreta. Cuando recibe el evento busca los suscriptores del ticket y le manda la notificación a cada uno por todos los canales configurados. Si un canal falla, el resto sigue y el cambio de estado no se rompe.

```ts
  async update(event: TicketStatusChangedEvent): Promise<void> {
    const subscriptions = await this.subscriptionRepository.findByTicket(event.ticketId);

    for (const subscription of subscriptions) {
      const userId = subscription.user.toString();
      const user = await this.userRepository.findById(userId);
      if (user === null) {
        continue;
      }

      const notification: Notification = {
        userId,
        userEmail: user.email,
        ticketId: event.ticketId,
        ticketTitle: event.ticketTitle,
        previousStatus: event.previousStatus,
        newStatus: event.newStatus,
        read: false,
      };

      for (const notifier of this.notifiers) {
        try {
          await notifier.send(notification);
        } catch {
          // Si un canal falla, no cortamos el resto ni rompemos el cambio de estado.
        }
      }
    }
  }
```

```ts
    eventPublisher.attach(notificationService);
```

## Factory

**Archivos:** `backend/src/notifications/NotifierFactory.ts` (se usa en `backend/src/main.ts`).

**Problema que resuelve:** Hay dos canales de notificación (in-app y consola), y cada uno se construye de forma distinta: el in-app necesita el repositorio para guardar en la base y el de consola no necesita nada. La Factory es el único lugar que decide qué clase concreta se crea a partir del nombre del canal, y devuelve siempre un `INotifier`. Gracias al `never` del `default`, si se agrega un canal al tipo `NotifierChannel` y no se lo contempla en el `switch`, TypeScript da error al compilar.

```ts
  create(channel: NotifierChannel): INotifier {
    switch (channel) {
      case "inapp":
        return new InAppNotifier(this.notificationRepository);
      case "console":
        return new ConsoleNotifierAdapter();
      default: {
        const _exhaustivo: never = channel;
        throw new Error(`Canal de notificación no soportado: ${_exhaustivo}`);
      }
    }
  }
```

```ts
const notifiers = [notifierFactory.create("inapp"), notifierFactory.create("console")];
```

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

**Archivos:** `backend/src/services/NotificationService.ts`, `backend/src/notifications/NotifierFactory.ts` y `backend/src/main.ts`.

**Problema que resuelve:** `NotificationService` recorre una lista de `INotifier` sin saber cuáles son. Para sumar un canal nuevo (por ejemplo, email) alcanza con crear una clase que implemente `INotifier`, agregar su `case` en la Factory y sumarla a la lista en `main.ts`. `NotificationService` queda cerrado a modificaciones y abierto a nuevos canales.

```ts
      for (const notifier of this.notifiers) {
        try {
          await notifier.send(notification);
        } catch {
          // Si un canal falla, no cortamos el resto ni rompemos el cambio de estado.
        }
      }
```

### L: Sustitución de Liskov

**Archivos:** `backend/src/notifications/INotifier.ts`, `backend/src/notifications/InAppNotifier.ts` y `backend/src/notifications/ConsoleNotifierAdapter.ts`.

**Problema que resuelve:** `InAppNotifier` y `ConsoleNotifierAdapter` cumplen el mismo contrato `send(notification): Promise<void>`, así que cualquiera de los dos puede ocupar el lugar de un `INotifier` sin que `NotificationService` note la diferencia ni tenga que preguntar de qué tipo es. Uno guarda en la base y el otro imprime en consola, pero los dos reciben lo mismo y responden igual.

```ts
export interface INotifier {
  send(notification: Notification): Promise<void>;
}
```

```ts
export class ConsoleNotifierAdapter implements INotifier {
    async send(notification: Notification): Promise<void>{
        console.log(`[NOTIFICACIÓN] Para: ${notification.userEmail} | Ticket #${notification.ticketId} | Estado: ${notification.previousStatus} → ${notification.newStatus}`); //esta es la notificacion que se envia
    }
}
```

### I: Segregación de interfaces

**Archivos:** `backend/src/repositories/interfaces/` (`IUserRepository.ts`, `IRoleRepository.ts`, `ITicketRepository.ts`, `ISubscriptionRepository.ts`, `INotificationRepository.ts`).

**Problema que resuelve:** En vez de un único repositorio gigante, hay una interfaz chica por entidad, con solo los métodos que se usan. Cada service depende solo de las interfaces que necesita: por ejemplo, `SubscriptionService` recibe `ISubscriptionRepository` e `ITicketRepository`, y no ve nada de usuarios ni de notificaciones. `IRoleRepository` tiene solo cuatro métodos, y no obliga a nadie a implementar lo que no usa.

```ts
export interface ISubscriptionRepository {
  create(userId: string, ticketId: string): Promise<SubscriptionDocument>;
  delete(userId: string, ticketId: string): Promise<SubscriptionDocument | null>;
  exists(userId: string, ticketId: string): Promise<boolean>;
  findByTicket(ticketId: string): Promise<SubscriptionDocument[]>;
}
```

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
