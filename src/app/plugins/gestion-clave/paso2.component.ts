import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { Respuesta } from "./respuesta";
import { Pregunta } from "./pregunta";
import { PreguntasService } from "./preguntas.service";
declare var $: any;

@Component({
  selector: "validacion-identidad-paso2",
  templateUrl: "./paso2.component.html",
  providers: [PreguntasService]
})
export class Paso2Component implements OnInit {
  public loading: boolean;
  // parametros de la trivia
  public idIntento: any;
  public codigoVerificacion: any;
  public textoAyuda: any;
  public captchaResponse: string;

  // datos de la pregunta
  public idPregunta: number;
  public pregunta: any;
  public tipoPregunta: number = 0;
  public posiblesRespuestas: string[];

  public siguiente: boolean;
  public mensaje: string;
  public respUsuario: string;

  public cedula: string;
  public email: string;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _preguntasService: PreguntasService,
  ) {
    this.loading = false;
    this.siguiente = false;
    this.mensaje = '';
  }

  ngOnInit(): void {
    this._route.queryParams.subscribe(params => {
      this.cedula = this._route.snapshot.paramMap.get("cedula");
      this.email = this._route.snapshot.paramMap.get("email");

      // validacion datos en memoria
      if (typeof localStorage !== "undefined") {
        // datos de la trivia
        this.idIntento = localStorage.getItem("idIntento");
        this.codigoVerificacion = localStorage.getItem("codigoVerificacion");
        this.captchaResponse = localStorage.getItem("captchaResponse");
        this.textoAyuda = localStorage.getItem("textoAyuda");

        // retorna datos de la pregunta
        let resultsPregunta = JSON.parse(localStorage.getItem("pregunta"));
        this.idPregunta = resultsPregunta.id;
        this.pregunta = resultsPregunta.pregunta;
        this.tipoPregunta = resultsPregunta.tipo;

        if (this.tipoPregunta === 3) {
          this.posiblesRespuestas = resultsPregunta.posiblesRespuestas;
        }

        this.siguiente = true;
      } else {
        this.siguiente = false;
        this.mensaje = "No se pudo obtener las preguntas";
      }
    });
  }

  avanzar(respUsuario, id): void {
    this.loading = true;

    let resp = new Respuesta();
    resp.idPregunta = id;
    resp.contenido = respUsuario;
    resp.idIntento = this.idIntento;
    resp.codigoVerificacion = this.codigoVerificacion;

    if (typeof respUsuario === "undefined" || respUsuario == null || $.trim(respUsuario) === '') {
      this.loading = false;
      this.mensaje = "Debe completar la pregunta!";
      this.openMessageDialog();

    } else {

      this._preguntasService.sendRespuestas(this.cedula, resp).subscribe(response => {
          if (!response.success) {
            this.siguiente = false;
            this.mensaje = response.message;

          } else {
            this.siguiente = true;
            this.respUsuario = null;

            this.idPregunta = response.pregunta.id;
            this.pregunta = response.pregunta.pregunta;
            this.tipoPregunta = response.pregunta.tipo;
            this.textoAyuda = response.textoAyuda;

            if (this.tipoPregunta === 3) {
              this.posiblesRespuestas = response.pregunta.posiblesRespuestas;
            }

          }
          this.loading = false;

        }, error => {
          this.loading = false;
          this.mensaje = "No se pudo procesar la operación. Intente responder nuevamente!";
          this.openMessageDialog();
        });
    }
    
  }

  openMessageDialog() {
    setTimeout(function () { $("#miModal").modal("toggle"); }, 1000);
  }

  retornar(): void {
    this._router.navigate(["/crear-cuenta"]);
  }

  resolved(captchaResponse: string) {
    console.log("Resolved captcha with response ${captchaResponse}:");
  }
}
