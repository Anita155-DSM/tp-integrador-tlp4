//observer es "avisame cuando pase algo"
//empezamos por aca, teniendo en cuenta la division de trabajos con mi compañero Nata, voy a trabajar las dos interfaces (iObserver e iSubject)

//desenglosando nuestra idea, Subject (EventPublisher) es el que avisa, y tiene una lista de interesados y, cuando ocurre algo, recorre la lista y les avisa

export interface IObserver<ticket> {
    update(event: ticket): Promise<void>;
}