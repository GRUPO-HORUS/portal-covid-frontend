export class FormDatosClinicos {
    id: number;
    public empresaTransporte: string;
    public tipoTransporte: string;
    public nroAsiento: string;
    public fechaPartida: Date;
    public fechaLlegada: Date;
    public ocupacion: string;

    public paisOrigen: any;
    public ciudadOrigen: string;
    public paisesCirculacion: string;
    public sintomasFiebre: boolean;
    public sintomasTos: boolean = false;
    public dificultadRespirar: boolean;
    public dolorGarganta: boolean;
    public declarationAgreement: boolean;
    public sintomasOtro: string;

}