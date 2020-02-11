import { Component, OnInit } from '@angular/core';
import { MessageService } from "../../../services/MessageService";
import { LoginService } from 'app/services/login.service';
import { AppConfig } from "../../../app.config";
import { Router, ActivatedRoute } from "@angular/router";
import { DocumentosService } from "app/services/documentos.service";
// import { RecaptchaComponent } from 'ng-recaptcha';
import { ToastrService } from 'ngx-toastr';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { Subscription } from 'rxjs';
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
  
  // public captcha: any;
  // @ViewChild('captchaControl') reCaptcha: RecaptchaComponent;

  public mensaje: string;
  public cursos: any;
  
  public loading: boolean;
  public resultado: any = { status: true, message: ''};
  public tipoDocumentosPublicos: any = [
    {
        "id": 2, "title": "Constancia de ser o no Funcionario Público (SFP)", "subTitle": "Descarga de Documentos",
        "url": "funcionario-publico"
    },
    {
        "id": 3, "title": "Consulta de Asegurado (IPS)", "subTitle": "Descarga de Documentos",
        "url": "ips-asegurado"
    },
    {
        "id": 6, "title": "Consulta de Inscripción de  Empleado (Ministerio de Trabajo)", "subTitle": "Descarga de Documentos",
        "url": "inscripcion-empleado"
    },
    {
        "id": 10, "title": "Ministerio de Trabajo, Empleo y Seguridad Social (MTESS)<br/>Servicio Nacional de Promoción Profesional (SNPP)", "subTitle": "Descarga de Certificados de Cursos (SNPP)",
        "url": "snpp"
    },
    {
        "id": 11, "title": "Consulta de Datos de RUC (SET)", "subTitle": "Descarga de Documentos",
        "url": "ruc-set"
    },
    {
        "id": 12, "title": "Consulta de cedula de MIPYMES", "subTitle": "Descarga de Documentos",
        "url": "mipymes"
    },
  ];

  public tipo: string;
  public documento: any;

  // recaptcha
  private subscription: Subscription;
  public recentToken: string = ''
  public recaptchaAvailable = false;

  constructor(
    public messageService: MessageService,
    public config: AppConfig,
    private _route: ActivatedRoute,
    private router: Router,
    public auth: LoginService,
    private toastrService: ToastrService,
    public documentosService: DocumentosService,
    private rcv3Service: ReCaptchaV3Service,
  ) {

    this._route.params.subscribe(params => {
      this.tipo = params['tipo'];
      this.documento = this.tipoDocumentosPublicos.find(x => x.url == this.tipo);
    });

    if(this.auth.getCurrentUser() == null ||  this.auth.getToken() == null) {
      this.auth.setTokenTmp("-");
      this.token = this.auth.getTokenTmp();
    }
  }

  ngOnInit() {
    this.scrollTop();
    this.getRecaptchaToken('register');
  }
  
  getRecaptchaToken(action) {
    this.subscription = this.rcv3Service.execute(action).subscribe(response => {
      // console.log('response', response);
      this.recentToken = response;
      
      this.recaptchaAvailable = true;

      $('.grecaptcha-badge').css({'visibility':'hidden !important'});
      // console.log($('.grecaptcha-badge'));
    }, error =>{
      this.recaptchaAvailable = false;
      console.log("error getting recaptcha", error);
    });
  }

  refreshCaptcha() {
    //this.reCaptcha.reset();
    this.getRecaptchaToken('register');
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  resolved(recentToken: string) {
    this.recentToken = recentToken;
  }

  atras() {
    $("body").removeClass("modal-open");
    this.router.navigate(['/documentos']);
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

    if(this.recaptchaAvailable) {
      // console.log('captcha', this.recentToken);
    }

    this.documentosService.getRptDocumentSinIE(params, this.recentToken).subscribe(response => {
      $("body").removeClass("modal-open");
      
      if(response.status) {
        this.cedula = "";
        this.router.navigate(['/visor/documentos-'+this.tipo+'/'+response.objId+'/'+response.cv]);
        this.closeModalDocument('#modalView');

      } else {
        
        let message = response.message != null && response.message != "undefined" && response.message != '' ? response.message : "No se pudo generar el documento";
        this.resultado = { status: false, message: message };
        this.toastrService.warning('', message);

      }

      this.loading = false;
      this.recentToken = "";
      this.refreshCaptcha();
    }, error => {
      console.log(error);
      this.loading = false;
      this.recentToken = "";
      this.refreshCaptcha();
      this.toastrService.warning('','Ocurrió un error al procesar la operación');
    });
  }

  getCursosSnpp() {
    this.loading = true;
    this.documentosService.getCursosSnpp("-", this.cedula, this.codAlumno, this.recentToken).subscribe(response => {
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
