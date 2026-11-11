import { INotifier, Notification } from "./INotifier.js";

export class ConsoleNotifierAdapter implements INotifier {
    async send(notification: Notification): Promise<void>{
        console.log(`[NOTIFICACIÓN] Para: ${notification.userEmail} | Ticket #${notification.ticketId} | Estado: ${notification.previousStatus} → ${notification.newStatus}`);
    }
}
