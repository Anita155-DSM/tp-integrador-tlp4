//observer es "avisame cuando pase algo"
//empezamos por aca, teniendo en cuenta la division de trabajos con mi compañero Nata, voy a trabajar las dos interfaces (iObserver e iSubject)

//desenglosando nuestra idea, Subject (EventPublisher) es el que avisa, y tiene una lista de interesados y, cuando ocurre algo, recorre la lista y les avisa

export interface IObserver<TipoEvento> { //aca nosotros dentro de <> le estamos diciendo del tipoq ue va a ser, o sea, en este caso no lo especificamos, dejamos una especie de "hueco" a rellenar posteriormente, es como decir "acá va a ir un tipo, todavía no se cuál"
    update(event: TipoEvento): Promise<void>; //aca decmos que la promesa no devuelve nada, por eso usamos el void
}