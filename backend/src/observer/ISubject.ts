//los Observers (NotificationService) son los interesados, se anotan en la lista (attach), se pueden borrar de ella (detach) y reciben el aviso con un método update
//update viene de iObserver.ts

// attach(observer: IObserver<T>): void, detach(observer: IObserver<T>): void y notify(event: T): Promise<void>
import { IObserver } from "./IObserver.js" //importamos el observer

export interface ISubject<ticket> {
    attach(observer: IObserver<ticket>): void;
    detach(observer: IObserver<ticket>): void;
    notify(event: ticket): Promise<void>
}