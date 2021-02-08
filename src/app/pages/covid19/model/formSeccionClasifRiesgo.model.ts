export class FormSeccionClasifRiesgo {
    id: number;
    idRegistro: number;
    nroDocumento: string;
    //clasificacionRiesgo: string;
    clasificacionFinal: string;

    trabajoExclusion: boolean;
    trabajoAutocontrol: boolean;
    trabajoNada: boolean;
    trabajoOtro: boolean;
    trabajoOtroDescripcion: string;
    laboratorioAntigeno: boolean;
    laboratorioPcr: boolean;

    laboratorioNinguno: boolean;

    fechaInicioSintomas: string;

    seFis: number;
    fechaInicioMonitoreo: string;
    fechaCierreCaso: string;
    seCierreCaso: number;
    fechaPrimeraMuestra: string;
    sePrimeraMuestra: number;
    resultadoPrimeraMuestra: string;

    constanciaAislamiento: string;
    fichaEpidemiologica: string;
    evolucionFinal: string;

    internado: boolean;
    establecimientoInternacion: string;
    especialidadInternacion: string;

    se: number;
    otroServicioInternadoCheck: boolean;
    otroServicioInternado: string;
    vacunaCovid: boolean;
}