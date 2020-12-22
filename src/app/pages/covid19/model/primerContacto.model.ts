export class PrimerContacto {
    id: number;
    nroDocumento: string;
    nombre: string;
    apellido: string;
    telefono: string;
    direccion: string;
    fechaCierreCaso: string;
    fechaInicioSintomas: string;    //Date
    tipoExposicion: string;
    fallecido: string;
    hospitalizado: string;
    departamento: string;
    distrito: string;

    estadoPrimeraLlamada: string;
    comentarios: string;
    cantidadReintentos: number;
    codigoPaciente: string;
    regionSanitaria: string;
}