import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { PreguntasService } from "./preguntas.service";
import { Persona } from "./persona";
declare var $: any;

@Component({
  selector: "paso-final-creacion-clave-paso3",
  templateUrl: "./paso3.component.html",
  providers: [PreguntasService]
})
export class Paso3Component implements OnInit {

  preguntas: any;
  pregunta: any;
  cedula: string;
  respuesta: any;
  respUsuario: string;
  hash: string;
  clave: string = "";
  claveConf: string = "";
  captcha: any;
  correcto: boolean;
  mensaje: string;
  captchaResponse: string;
  ignoreCaptcha: boolean = true;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _preguntasService: PreguntasService,
  ) {
    this.correcto = false;
    this.mensaje = "";
  }

  ngOnInit(): void { }

  actualizar(cedula: string, clave: string): void {

    let persona = new Persona();
    persona.cedula = cedula;
    persona.password = clave;
    persona.hash = this._route.snapshot.paramMap.get("hash");

    this._preguntasService.actualizarClave(persona).subscribe(data => {
      
      this.correcto = data.success;
      this.mensaje = data.message;

      if (data.success) {
        this.cedula = "";
        this.clave = "";
        this.claveConf = "";

      } else {
        $("#miModal").modal("show");
      }

    });
  }

  resolved(captchaResponse: string) {
    this.captchaResponse = captchaResponse;
    this.ignoreCaptcha = false;
    //this.status = this._preguntasService.validarRecaptcha(captchaResponse);
  }
}
