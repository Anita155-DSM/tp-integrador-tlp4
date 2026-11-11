// Subject: los observers se anotan con attach, se quitan con detach y reciben el aviso por notify (que llama a su update).
import { IObserver } from "./IObserver.js"

export interface ISubject<TipoEvento> {
    attach(observer: IObserver<TipoEvento>): void;
    detach(observer: IObserver<TipoEvento>): void;
    notify(event: TipoEvento): Promise<void>
}