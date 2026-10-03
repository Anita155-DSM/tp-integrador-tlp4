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
        for (const observer of this.observers){ //en este caso, para cada observer de la lista observers, llama a su update con el evento   THIS.OBSERVER ES LA LISTA COMPLETA, o sea el array
            await observer.update(event)
        }
    }
}