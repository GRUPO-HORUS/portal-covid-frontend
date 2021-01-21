import { FormDatosBasicos } from "./formDatosBasicos.model";
import { FormDatosClinicos } from "./formDatosClinicos.model";
import { FormSeccionClasifRiesgo } from "./formSeccionClasifRiesgo.model";
import { FormSeccionContactoContagio } from "./formSeccionContactoContagio.model";
import { FormSeccionPersonalBlanco } from "./formSeccionPersonalBlanco.model";
import { FormSeccionReporteSalud } from "./formSeccionReporteSalud.model";

export class FichaPersonalBlanco {
    //seccion datos basicos
    formSeccionDatosBasicos: FormDatosBasicos;
    //seccion personal de blanco
    formSeccionPersonalBlanco: FormSeccionPersonalBlanco;
    //sección contacto contagio
    formSeccionContactoContagio: FormSeccionContactoContagio;

    //sección reporte salud y sintomas
    reportesSalud: FormSeccionReporteSalud[];
    //sección clasif riesgo
    formSeccionClasifRiesgo: FormSeccionClasifRiesgo;

    formSeccionDatosClinicos: FormDatosClinicos;

    /*id: number;
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
    inicioAislamiento:string;
    fechaPrevistaTomaMuestraLaboratorial:string;
    localTomaMuestra:string;
    fechaNacimiento:string;
    sexo:string;
    fechaInicioSintomas: string;
    fechaExposicion: string;*/
}