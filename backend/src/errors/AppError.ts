//ahora trabajamos el manejo de errores, paraest oel appError
//se sabe que cuando un error ocurre nuestro service tiene que parar y avisar, pero tambien para esto, nostros necesitamos codigo http y msj de error, eso es lo que hace nuestro appError, ya que un error comun solo trae msj

export class AppError extends Error{
    public readonly statusCode: number;
    constructor(message: string, statusCode: number){
        super(message) 
        this.statusCode = statusCode;
    }
    static BadRequest(message: string = "DATOS INVALIDOS"): AppError { //lo que hacemos aca lo entendemos como message es un texto, y si no me pasan ninguno, su valor es 'DATOS INVALIDOS'
        return new AppError(message, 400);
    }
    static Unauthorized(message: string = "sin sesion o sin token valido"): AppError {
        return new AppError(message, 401)
    }
    static Forbidden(message: string = "tienes acceso pero no el permiso"): AppError {
        return new AppError(message, 403)    
    }
    static NotFound(message: string = "recurso no encontrado"): AppError {
        return new AppError(message, 404)
    }
}
