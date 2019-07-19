export class IdentidadRespuesta {
    message: string;
    success: boolean;
    idIntento: number;
    codigoVerificacion: string

    constructor() {
        this.success = false;
        this.message = "No se pudo procesar la operación, intente mas tarde por favor";
    }
}