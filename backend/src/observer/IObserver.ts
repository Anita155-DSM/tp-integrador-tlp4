// Observer: lo implementa quien quiere ser avisado cuando ocurre un evento (NotificationService).
// El Subject (EventPublisher) guarda la lista de observers y les avisa a todos.

export interface IObserver<TipoEvento> { // TipoEvento es genérico: el tipo concreto se define al usarlo
    update(event: TipoEvento): Promise<void>;
}