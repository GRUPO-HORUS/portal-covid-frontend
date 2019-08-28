import { Component, OnInit } from "@angular/core";
import { MessageService } from "../../../services/MessageService";
import { LoginService } from 'app/services/login.service';
import { AppConfig } from "../../../app.config";
import { Router } from "@angular/router";
import { DocumentosService } from "app/services/documentos.service";
import { IdentidadPersona } from "../model/identidad-persona.model";
declare var $: any;

@Component({
  selector: "consulta-documento",
  styleUrls: ['consulta-documento.component.css'],
  providers: [LoginService, DocumentosService],
  templateUrl: "consulta-documento.component.html"
})
export class ConsultaDocumentoComponent implements OnInit {

  public ciudadano: IdentidadPersona;
  public token: string;
  public cedula: string;
  public captcha: any;
  public captchaResponse: string;
  public mensaje: string;
  public cursos;
  public loading: boolean;
  public resultado: any = { status: true, message: ''};

  constructor(
    public messageService: MessageService,
    public config: AppConfig,
    private router: Router,
    public auth: LoginService,
    public documentosService: DocumentosService
  ) {}

  ngOnInit() {
    if(this.auth.getCurrentUser() == null ||  this.auth.getToken() == null) {
      this.auth.setTokenTmp("123456");
      this.token = this.auth.getTokenTmp();
    }
    this.scrollTop();
  }

  resolved(captchaResponse: string) {
    this.captchaResponse = captchaResponse;
  }

  cancelGenerarDocumento() {
    this.scrollTop();
    this.loading = false;
    this.captchaResponse = "";
  }

  getCertificadoSnpp(tipo, curso) {
    this.resultado = {status: true, message: ''};
    this.documentosService.getRptDocumentSnpp("-", this.cedula, curso.cod_especialidad, tipo, this.captchaResponse).subscribe(response => {
      if(response.status) {
        this.router.navigate(["/visor/consulta-documento/"+response.objId]);

        setTimeout(function() { 
          $("#modalView").modal("hide"); 
          $('.modal-backdrop').hide();
        }, 500);  

        this.loading = false;

      } else {
        this.resultado = {status: false, message: response.message};
        this.loading = false;
      }

      this.captchaResponse = "";
    }, error => {
      console.log("error", error);
      this.loading = false;
      this.captchaResponse = "";
    });
  }

  getCursosSnpp() {
    this.loading = true;
    this.documentosService.getCursosSnpp("-", this.cedula, this.captchaResponse).subscribe(response => {
      setTimeout(function() { $("#modalView").modal("show"); }, 500);
      if(response.status) {
        this.cursos = { 'key': 10, 'data': response.data };
        this.loading = false;
        this.resultado = {status: true, message: ''};
      } else {
        this.loading = false;
        this.resultado = {status: false, message: 'No se encontraron datos disponibles para la cedula '+ this.cedula};
      }
    }, error => {
      console.log("error", error);
      this.loading = false;
      this.resultado = {status: false, message: 'No se pudo obtener el listado de cursos'};
    });
  }

  scrollBottom() {
    let top = document.getElementById('topcc');
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }
  }

  scrollTop() {
    let top = document.getElementById('topcab');
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }
  }
  
}
