import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MessageService } from "../../../services/MessageService";
import { LoginService } from 'app/services/login.service';
import { AppConfig } from "../../../app.config";
import { Router, ActivatedRoute } from "@angular/router";
import { DocumentosService } from "app/services/documentos.service";
import { RecaptchaComponent } from 'ng-recaptcha';
import { ToastrService } from 'ngx-toastr';
declare var $: any;

@Component({
  selector: "consulta-documento",
  styleUrls: ['consulta-documento.component.css'],
  providers: [LoginService, DocumentosService],
  templateUrl: "consulta-documento.component.html"
})
export class ConsultaDocumentoComponent implements OnInit {

  public token: string;
  public cedula: string;
  public dv: string;
  public fechaNac: string;
  public codAlumno: string;

  public captcha: any;
  @ViewChild('captchaControl') reCaptcha: RecaptchaComponent;

  public captchaResponse: string;
  public mensaje: string;
  public cursos: any;
  
  public loading: boolean;
  public resultado: any = { status: true, message: ''};
  public tipoDocumentos: any = [];

  public tipo: string;
  public documento: any;

  constructor(
    public messageService: MessageService,
    public config: AppConfig,
    private _route: ActivatedRoute,
    private router: Router,
    public auth: LoginService,
    private toastrService: ToastrService,
    public documentosService: DocumentosService
  ) {

    this._route.params.subscribe(params => {
      this.tipo = params['tipo'];
      this.loadTipoServicio();
    });

    if(this.auth.getCurrentUser() == null ||  this.auth.getToken() == null) {
      this.auth.setTokenTmp("-");
      this.token = this.auth.getTokenTmp();
    }
  }

  ngOnInit() {
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

  atras() {
    this.router.navigate(['/documentos']);
  }

  loadTipoServicio() {
    this.documentosService.loadTipoServicio().subscribe(response => {
      this.tipoDocumentos = response;
      this.documento = this.tipoDocumentos.find(x => x.description == this.tipo);
    }, error => {
      console.log(error);
    });
  }

  refreshCaptcha() {
    this.reCaptcha.reset();
  }

  getCertificadoSnpp(tipo, curso) {
    let params = {
      'cedula': this.cedula,
      'codEspecialidad': curso.cod_especialidad,
      'codFuente': curso.fuente_consulta,
      'tipo': tipo.toString()
    };

    this.getRptDocumentSinIE(params);
  }

  getRptDocumentSinIE(params: any) {
    this.loading = true;
    this.resultado = { status: true, message: '' };
    
    if(!params) {
      params = {};
      params.cedula = this.cedula;
      params.tipo = this.documento.id.toString();
    }

    if(this.tipo == 'ruc-set') params.dv = this.dv;

    if(this.tipo == 'cedula-policial') params.fechaNacimiento = this.fechaNac;

    this.documentosService.getRptDocumentSinIE(params, this.captchaResponse).subscribe(response => {
      if(response.status) {
        this.cedula = "";
        this.router.navigate(['/visor/documentos-'+this.tipo+'/'+response.objId+'/'+response.cv]);
        this.closeModalDocument('#modalView');

      } else {
        this.resultado = { status: false, message: response.message };
        this.toastrService.warning('', response.message);
      }

      this.loading = false;
      this.captchaResponse = "";
      this.refreshCaptcha();
      
    }, error => {
      console.log(error);
      this.loading = false;
      this.captchaResponse = "";
      this.refreshCaptcha();
      this.toastrService.warning('','Ocurrió un error al procesar la operación');
    });
  }

  getCursosSnpp() {
    this.loading = true;
    this.documentosService.getCursosSnpp("-", this.cedula, this.codAlumno, this.captchaResponse).subscribe(response => {
      setTimeout(function() { $("#modalView").modal("show"); }, 500);
      if(response.status) {
        this.cursos = { 'key': 10, 'data': response.data };
        this.loading = false;
        this.resultado = {status: true, message: ''};
      } else {
        this.loading = false;
        this.resultado = {status: false, message: 'No se encontraron datos disponibles para el nro. de cédula '+ this.cedula};
      }
    }, error => {
      console.log("error", error);
      this.loading = false;
      this.resultado = {status: false, message: 'No se pudo obtener el listado de cursos'};
    });
  }

  closeModalDocument(name:string) {
    setTimeout(function() {
      $(name).modal('hide'); 
      $('.modal-backdrop').hide();
    }, 500);
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
