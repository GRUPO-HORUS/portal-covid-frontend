import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { PreguntasService } from "./preguntas.service";
declare var $: any;

@Component({
  selector: "creacion-cuenta-paso1",
  templateUrl: "./paso1.component.html",
  providers: [PreguntasService]
})
export class Paso1Component {
  public loading: boolean;
  public captcha: any;
  public captchaResponse: string;
  public mensaje: string;
  // datos del formulario 
  public cedula: string;
  public email: string;
  public domicilio: string;
  public telefono: string;
  public telefValido: boolean = false;
  public terminos: boolean;

  constructor(
    private _router: Router,
    private _preguntasService: PreguntasService
  ) {
    this.loading = false;
    if (typeof localStorage !== "undefined") {
      localStorage.clear();
    }
  }

  resolved(captchaResponse: string) {
    this.captchaResponse = captchaResponse;
  }

  avanzar(cedula: string, email: string, domicilio: string, telefono: string): void {
    this.loading = true;

    this._preguntasService.verExiste(cedula, email, domicilio, telefono, this.captchaResponse, false).subscribe(
        response => {
          if (response.success) {
            // save localStorage
            localStorage.setItem("pregunta", JSON.stringify(response.pregunta));
            localStorage.setItem("idIntento", response.idIntento);
            localStorage.setItem("codigoVerificacion", response.codigoVerificacion);
            localStorage.setItem("textoAyuda", response.textoAyuda);
            localStorage.setItem("captchaResponse", this.captchaResponse);

            this.loading = false;
            // redirect paso 2
            this._router.navigate(["/paso2/", cedula, email]);
          } else {
            this.loading = false;
            this.mensaje = response.message;
            this.openMessageDialog();
          }
        },
        error => {
          this.loading = false;
          this.mensaje = "No se pudo procesar la operación!";
          this.openMessageDialog();
        }
      );
  }

  refreshCaptcha() {
    this.captcha = "";
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
