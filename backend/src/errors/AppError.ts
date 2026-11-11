// Error con código HTTP: los services lo lanzan y ErrorMiddleware lo convierte en la respuesta.

export class AppError extends Error{
    public readonly statusCode: number;
    constructor(message: string, statusCode: number){
        super(message) 
        this.statusCode = statusCode;
    }
    static BadRequest(message: string = "DATOS INVALIDOS"): AppError {
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
