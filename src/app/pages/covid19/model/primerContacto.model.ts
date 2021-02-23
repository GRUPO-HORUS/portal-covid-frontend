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
    personalBlanco: string;
    departamentoId: number;
    departamento: string;
    distritoId: number;
    distrito: string;
    barrioId: string;
    barrio: string;

    sintomaticoAsintomatico: string;
    comunidadAlbergue: string;

    estadoPrimeraLlamada: string;
    comentarios: string;
    cantidadReintentos: number;
    codigoPaciente: string;
    regionSanitaria: string;
    regionSanitariaId: number;
    fechaUltimaLlamada: string;
    estadoLlamadaCensoContacto: string;

    loginOperador: string;
    operadorAsignado: number;

    editado: boolean;
}