import { NgModule, Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { EncuestaService } from "./encuesta.service";
import { MatSnackBar } from '@angular/material';
import { environment } from "../../../environments/environment";

@Component({
  selector: 'encuesta',
  templateUrl: './encuesta.component.html',
  styleUrls: ['./encuesta.component.css'],
  providers: [EncuestaService],
  encapsulation: ViewEncapsulation.None
})
export class EncuestaComponent implements OnInit {

  layout: any = {};
  schema: any = {};
  tipoEncuesta: any;
  formulario: any;
  mostrarCaptcha: boolean = false;
  mostrarFormulario: boolean = true;
  googleReCaptchaApiKey = "";
  mostrarMensajeEncuestaEnviada: boolean = false;
  captchaOk = false;
  nuevaEncuesta: any;
  form: any;

  //Requerido
  @Input()
  identificador: string;

  //Requerido
  @Input()
  version: number;

  //Opcional, muestra el titulo por defecto
  @Input()
  mostrarTitulo: boolean = true;

  //Opcional, muestra enviar por defecto
  @Input()
  labelBotonSubmit: string;

  constructor(
    private encuestaService: EncuestaService,
    public snackBar: MatSnackBar
  ) {

  }

  ngOnInit() {
    this.googleReCaptchaApiKey = environment.googleReCaptchaApiKey;
    if (this.identificador && this.version) {
      //Se verifica si la encuesta ya ha sido respondida
      let encuestaEnviada = localStorage.getItem(this.identificador);
      if (!encuestaEnviada) {
        this.encuestaService.getTipoEncuesta(this.identificador, this.version).subscribe(data => {
          console.log("data-tipo-encuesta:", data);
          this.tipoEncuesta = data;
          this.formulario = data.formulario;
          this.establecerValoresJsonSchemaForm();
        }, error => {
          if (error.status === 404) {
            console.log("No existe encuesta o está desactivada.");
          } else {
            console.log("Ocurrió un error al obtener el tipo de encuesta.", error);
          }
          //this.snackBar.open("Ocurrió un error al obtener el tipo de encuesta.", "Cerrar");
        });
      } else {
        this.mostrarFormulario = false;
        this.mostrarMensajeEncuestaEnviada = true;
      }
    } else {
      console.error("El identificador y la versión de la encuesta son requeridos.")
    }

  }

  establecerValoresJsonSchemaForm() {
    let detalleFormulario = this.formulario.formularioDetalle;
    if (detalleFormulario) {
      this.schema = detalleFormulario.jsonSchema.schema;
      this.form = detalleFormulario.jsonSchema.form;
      this.agregarBotonSubmit();
      this.layout = this.form;
    } else {
      console.error("No se encontró la version del detalle de formulario.")
    }

  }

  agregarBotonSubmit() {
    this.form.push({
      "type": "submit",
      "style": "btn-info",
      "title": this.labelBotonSubmit || 'Responder'
    })
  }

  submit(nuevaEncuesta: any) {
    //Se guarda la encuesta
    this.nuevaEncuesta = nuevaEncuesta;
    if (this.tipoEncuesta.captcha && !this.captchaOk) {
      this.mostrarFormulario = false;
      this.mostrarCaptcha = true;
    } else {
      this.encuestaService.create(this.crearNuevaEncuesta(this.nuevaEncuesta)).subscribe(
        data => {
          this.mostrarFormulario = false;
          this.mostrarMensajeEncuestaEnviada = true;
          //Se almacena en el local storage para saber si la encuesta ya ha sido enviada
          localStorage.setItem(this.tipoEncuesta.identificador, "Enviado");
          this.snackBar.open("Respuesta enviada exitósamente.", "Cerrar", {
            duration: 2000,
          });
        },
        error => {
          this.snackBar.open("Ocurrió un erorr inesperado al enviar la respuesta.", "Cerrar");
        });
    }

  }

  private crearNuevaEncuesta(model: any) {
    let tipoEncuesta: any = {};
    tipoEncuesta.id = this.tipoEncuesta.id;
    let encuesta: any = {};
    encuesta.tipoEncuesta = tipoEncuesta;
    encuesta.jsonModel = model;
    encuesta.versionFomulario = this.version;
    return encuesta;
  }

  public resolvedCaptcha(captchaResponse: string) {
    this.mostrarFormulario = true;
    this.mostrarCaptcha = false;
    this.captchaOk = true;
    this.submit(this.nuevaEncuesta);
  }

}
