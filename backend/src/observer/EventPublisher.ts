import { ISubject } from "./ISubject.js";
import { IObserver } from "./IObserver.js";

export class EventPublisher<TipoEvento> implements ISubject<TipoEvento> {
    private observers: IObserver<TipoEvento>[] = [];
    attach(observer: IObserver<TipoEvento>): void {
        this.observers.push(observer)
    }
    detach(observer: IObserver<TipoEvento>): void {
        this.observers = this.observers.filter((o) => o !== observer);
    }
    async notify(event: TipoEvento): Promise<void> {
        for (const observer of this.observers){ // avisa a cada observer registrado llamando a su update
            await observer.update(event)
        }
    }
}