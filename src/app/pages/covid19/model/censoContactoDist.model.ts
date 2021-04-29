
export class CensoContactoDist {
    id: number;
    nroDocumento: string;
    nombre: string;
    apellido: string;
    telefono: string;
    fechaCierreCaso: string;
    fechaInicioSintomas: string;    //Date
    fallecido: string;
    hospitalizado: string;
    personalBlanco: string;
    departamentoId: number;
    departamento: string;
    distritoId: number;
    distrito: string;

    estadoPrimeraLlamada: string;
    comentariosCenso: string;
    cantidadLlamadas: number;
    regionSanitaria: string;
    regionSanitariaId: number;
    fechaHoraUltimaLlamada: string;
    estadoLlamadaCensoContacto: string;
    idOperador: number;
    loginOperador: string;
}