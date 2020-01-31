import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { PreguntasService } from "./preguntas.service";
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { Subscription } from 'rxjs';
declare var $: any;

@Component({
  selector: "creacion-cuenta-paso1",
  templateUrl: "./paso1.component.html",
  providers: [PreguntasService]
})
export class Paso1Component implements OnInit {

  public loading: boolean;
  public mensaje: string;

  // datos del formulario 
  public cedula: string;
  public email: string;
  public domicilio: string;
  public telefono: string;
  public telefValido: boolean = false;
  public terminos: boolean;

  // recaptcha
  // public captchaResponse: string;
  // public captcha: any;
  private subscription: Subscription;
  public recentToken: string = ''
  public recaptchaAvailable = false;

  constructor(
    private _router: Router,
    private _preguntasService: PreguntasService,
    private rcv3Service: ReCaptchaV3Service,
  ) {
    this.loading = false;
    if (typeof localStorage !== "undefined") {
      localStorage.clear();
    }
  }

  ngOnInit() {
    this.getRecaptchaToken('registerOAuth');
  }

  getRecaptchaToken(action) {
    this.subscription = this.rcv3Service.execute(action).subscribe(response => {
      console.log('response', response);
      
      this.recentToken = response;
      
      this.recaptchaAvailable = true;

      $('.grecaptcha-badge').css({'visibility':'hidden !important'});

      console.log($('.grecaptcha-badge'));

    }, error =>{
      this.recaptchaAvailable = false;
      console.log("error getting recaptcha", error);
    });
  }

  refreshCaptcha() {
  //   this.captcha = "";
    this.getRecaptchaToken('registerOAuth');
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  // resolved(captchaResponse: string) {
  //   this.captchaResponse = captchaResponse;
  // }

  avanzar(cedula: string, email: string, domicilio: string, telefono: string): void {
    this.loading = true;

    this._preguntasService.verExiste(cedula, email, domicilio, telefono, this.recentToken, false).subscribe(
        response => {
          if (response.success) {
            // save localStorage
            localStorage.setItem("pregunta", JSON.stringify(response.pregunta));
            localStorage.setItem("idIntento", response.idIntento);
            localStorage.setItem("codigoVerificacion", response.codigoVerificacion);
            localStorage.setItem("textoAyuda", response.textoAyuda);
            localStorage.setItem("captchaResponse", this.recentToken);

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
