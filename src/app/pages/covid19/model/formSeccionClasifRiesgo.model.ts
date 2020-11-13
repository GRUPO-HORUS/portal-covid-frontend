export class FormSeccionClasifRiesgo {
    id: number;
    idRegistro: number;
    nroDocumento: string;
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

    fechaInicioSintomas: string;
    fechaExposicion: string;
}