export class PrimerContacto {
    id: number;
    nroDocumento: string;
    nombre: string;
    apellido: string;
    telefono: string;
    direccion: string;
    fechaCierreCaso: Date;
    fechaInicioSintomas: Date;
    tipoExposicion: string;
    fallecido: string;
    hospitalizado: string;
    departamento: string;
    distrito: string;

    estadoPrimeraLlamada: string;
    comentarios: string;
    cantidadReintentos: number;
}