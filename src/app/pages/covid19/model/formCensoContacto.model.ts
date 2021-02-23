export class FormCensoContacto {
    id: number;
    nroDocumento: string;
    nombre: string;
    apellido: string;
    telefono: string;
    direccion: string;
    sexo: string;
    
    categoriaContagio: string;
    fechaExposicion: Date;
    primerContactoId: number;

    regionSanitariaId: string;
    regionSanitaria: string;
    distritoId: number;
    distrito: string;

    estadoPrimeraLlamada: string;
    fechaHoraActualizacion: string;
    usuarioActual: number;
    usuarioActualNombre: string;

    cantidadReintentos: number;
}