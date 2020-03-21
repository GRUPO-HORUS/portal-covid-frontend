import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from 'rxjs';
import { Covid19Service } from '../../services/Covid19Service';
declare var $: any;

@Component({
  selector: "datos-clinicos-selector",
  templateUrl: "./datos-clinicos.component.html",
  providers: [Covid19Service]
})
export class DatosClinicosComponent implements OnInit {

  public loading: boolean;
  public mensaje: string;

  //Datos del formulario 
  public empresaTransporte: string;
  public tipoTransporte: string;
  public nroAsiento: string;
  public fechaPartida: Date;
  public fechaLlegada: Date;
  public ocupacion: string;
  public paisOrigenOptions=[{value:0,label:'Argentina'},{value:1,label:'Brasil'},{value:2,label:'Bolivia'},{value:3,label:'Uruguay'}];
  public paisOrigen: any;
  public ciudadOrigen: string;
  public paisesCirculacion: string;
  public sintomasFiebre: boolean;
  public sintomasTos: boolean = false;
  public dificultadRespirar: boolean;
  public dolorGarganta: boolean;
  public declarationAgreement: boolean;
  public sintomasOtro: string;

  private subscription: Subscription;
  public recentToken: string = ''
  public recaptchaAvailable = false;
  public telefValido: boolean;


  constructor(
    private _router: Router,
    private service: Covid19Service
  ) {
    this.loading = false;
    if (typeof localStorage !== "undefined") {
      localStorage.clear();
    }
  }

  ngOnInit() {
    console.log("datos clinicos");
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  enviar(sintomasTos){
    console.log(sintomasTos);
    /*this.service.enviarCodigo(codigo, idRegistro).subscribe(response => { }
    );*/
  }

  avanzar(telefono: string): void {
    this.loading = true;
        this.service.sendMessage(telefono).subscribe(response => {
            console.log(response);
            if (response) {
              this.loading = false;
              this.mensaje = "Mensaje Enviado con Éxito";
              this.openMessageDialog();
            } else {
              this.loading = false;
              this.mensaje = "Fallo";
              this.openMessageDialog();

            }
          }, error => {
            this.loading = false;
            this.mensaje = "No se pudo procesar la operación!";
            this.openMessageDialog();
          }
        );
  }
  
  openMessageDialog() {
    setTimeout(function() { $("#miModal").modal("toggle"); }, 1000);
  }

  keyPress(event: any) { 
    const pattern = /[0-9\+\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (pattern.test(inputChar)) {
      this.telefValido = true;
    }else {
      this.telefValido = false;
    }
  }

}
