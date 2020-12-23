import { FormSeccionReporteSalud } from "./formSeccionReporteSalud.model";

export class FormDatosBasicosPB {
    id: number;
    nombre: string;
    apellido: string;
    paisNacionalidad: string;
    ciudadNacimiento: string;
    tipoDocumento: any;
    numeroDocumento: string;
    numeroCelular: string;
    correoElectronico: string;
    ciudadDomicilio: string;
    paisDomicilio: string;
    departamentoDomicilio: string;
    direccionDomicilio: string;
    paisEmisorDocumento: string;
    tipoInicio: string;
    tipoRegistro: string;
    edad: number;
    rangoEdad: string;
    barrio: string;

    inicioAislamiento:string;
    fechaPrevistaTomaMuestraLaboratorial:string;
    localTomaMuestra:string;
    fechaNacimiento:string;
    sexo:string;

    numeroDocumentoContacto: string;
    nombreContacto: string;
    apellidoContacto: string;
    sexoContacto: string;
    fechaInicioSintoma: string;
    fechaExposicion: string;
    clasificacionRiesgo: string;
    categoriaContagio: string;
    clasificacionFinal: string;
    trabajoExclusion: boolean;
    trabajoAutocontrol: boolean;
    trabajoNada: boolean;
    trabajoOtro: boolean;
    trabajoOtroDescripcion: string;
    laboratorioAntigeno: boolean;
    laboratorioPcr: boolean;

    servicioSalud: string;
    regionSanitaria: string;
    profesion: string;
    especialidadProfesion: string;
    funcion: string;
    otrosLugares: any[];

    otroServicio: boolean;

    reingreso: boolean;
    fallecido: boolean;
    internado: boolean;
    establecimientoInternacion: string;
    especialidadInternacion: string;

    reportes: FormSeccionReporteSalud[];

    contagioAmbiente:string;
    contagioEstablecimiento:string;
    codigoPaciente: string;
    seFis: number;
    sePrimeraMuestra: number;
    fechaPrimeraMuestra: string;
    resultadoPrimeraMuestra: string;
    evolucionFinal: string;
    fechaCierreCaso: string;
    constanciaAislamiento: boolean;
    fichaEpidemiologica: boolean;
    fechaInicioMonitoreo: string;

}