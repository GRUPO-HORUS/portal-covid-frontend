export class FormSeccionContactoContagio {
    id: number;
    idRegistro: number;
    nroDocumento: string;
    nombre: string;
    apellido: string;
    sexo:string;

    contagioAmbiente: string;
    contagioEstablecimiento: string;
    categoriaContagio: string;
    fechaExposicion: string;

    clasificacionRiesgo: string;
    otroServicioCheck: boolean;
    otroServicioNombre: string;
}