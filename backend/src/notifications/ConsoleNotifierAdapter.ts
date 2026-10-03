import { INotifier, Notification } from "./INotifier.js";

export class ConsoleNotifierAdapter implements INotifier {
    async send(notification: Notification): Promise<void>{
        console.log(`[NNOTIFICACIÓN] Para: ${notification.userEmail} | Ticket ${notification.ticketId} | Estado: ${notification.previousStatus} -> ${notification.newStatus}`) //esta es la notificacion que se envia
    }
}