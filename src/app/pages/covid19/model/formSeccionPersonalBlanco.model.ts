export class FormSeccionPersonalBlanco {
    id: number;
    idRegistro: number;
    profesion: string;
    especialidadProfesion: string;
    servicioSalud: string;
    regionSanitaria: string;
    funcion: string;
    otrosLugares: any[];

    reingreso: boolean;
    fallecido: boolean;

    codigoPaciente: string;
    otroServicio: boolean;
    otroLugarNoListaCheck: boolean;
    otroLugarNoLista: string;
    reinfeccion: boolean;

    ultimoReingreso: boolean;
}