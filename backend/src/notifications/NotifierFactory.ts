import type { INotifier } from "./INotifier.js";
import type { INotificationRepository } from "../repositories/interfaces/INotificationRepository.js";
import { InAppNotifier } from "./InAppNotifier.js";
import { ConsoleNotifierAdapter } from "./ConsoleNotifierAdapter.js";

// Los dos canales que pide el enunciado.
export type NotifierChannel = "inapp" | "console";

// Único lugar que decide qué clase concreta de notificador se crea.
export class NotifierFactory {
  // El canal in-app necesita guardar en la base, así que el repo entra
  // por constructor (se lo inyecta main.ts). El canal consola no necesita nada.
  constructor(
    private readonly notificationRepository: INotificationRepository
  ) {}

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
}