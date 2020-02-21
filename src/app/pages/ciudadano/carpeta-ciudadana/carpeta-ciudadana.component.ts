import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../../services/MessageService';
import { LoginService } from 'app/services/login.service';
import { AppConfig } from '../../../app.config';
import { Router } from '@angular/router';
import { IdentidadPersona } from 'app/pages/ciudadano/model/identidad-persona.model';
import { DocumentosService } from 'app/services/documentos.service';
import { ToastrService } from 'ngx-toastr';
import { ModalService } from 'app/lib/modal-custom';
import { DatePipe } from '@angular/common';
declare var $: any;

@Component({
  selector: 'carpeta-ciudadana',
  styleUrls: ['carpeta-ciudadana.component.css'],
  providers: [LoginService, DocumentosService],
  templateUrl: 'carpeta-ciudadana.component.html'
})
export class CarpetaCiudadanaComponent implements OnInit {

  public ciudadano: IdentidadPersona;
  public token: string;
  public loading: boolean;
  public resultado: any = { status: true, message: ''};
  public menuDocument: any[];
  public servicios: any[] = [];
  public docSelected:any = {};
  public historicoDocumentos: any[] = [];
  public cursos: any;
  public documentosIE: any[] = [];

  constructor(
    public messageService: MessageService,
    public config: AppConfig,
    private router: Router,
    public auth: LoginService,
    public documentosService: DocumentosService,
    private toastrService: ToastrService,
    private modalService: ModalService,
  ) { }

  ngOnInit() {

    this.ciudadano = this.auth.getCurrentUser();

    this.token = this.auth.getToken();

    if(this.ciudadano != null && this.token != null) {

      this.getServicios();

    } else {

      this.getListDocumentos();

    }

    this.scrollTop();
    
  }

  cancelGenerarDocumento() {
    this.scrollTop();
    this.loading = false;
  }

  getServicios() {
    this.documentosService.getServicios(this.token).subscribe(response => {
      this.servicios = response;
    }, error => {
      console.log('error', error);
    });
  }
  
  getHistoricoConsultas(servicio: any) {
    this.loading = true;

    this.docSelected.params = {};

    this.docSelected.name = servicio.descripcion;

    this.docSelected.params.tipo = servicio.idTipoServicio.toString();

    this.documentosService.getHistoricoConsultas(this.token, servicio.idTipoServicio).subscribe(response => {
      
      this.historicoDocumentos = response;

      this.openModalDocument('#modalDetalleDocumento');

      this.loading = false;

    }, error => {
      this.loading = false;
      console.log('error', error);
    });
  }

  generarDocumentoHistorico(result: any) {
    
    this.closeModalDocument('#modalDetalleDocumento');

    $("body").removeClass("modal-open");

    if(result.liq != null) {
      this.router.navigate(['/solicitud-documento/'+result.liq._id]);

    } else {
      this.router.navigate(['/visor/carpeta-ciudadana/'+result._id]);
    }

  }

  redirectMipymes() {
    this.closeModalDocument('#modalDetalleDocumento');
    this.router.navigate(['/documentos/mipymes']);
  }

  generarDocumento() {
    this.scrollTop();
    
    let paramsAditional = false;
    let modalView = '';
    
    if(this.docSelected.params.tipo == "10") {
      this.getCursosSnpp(this.docSelected.params.tipo);
      return;
    }

    // if(this.docSelected.params.tipo == "11") {
    //   this.docSelected.params.dv = '';
    //   this.docSelected.params.titulo = 'Constancia de RUC (SET)';

    //   paramsAditional = true;
    //   modalView = '#modalRucSet';
    // }

    if(this.docSelected.params.tipo == "15") {
      this.docSelected.params.titulo = 'Acta de Nacimiento (Hijo/a)';
      this.docSelected.params.cedulaHijo = '';

      paramsAditional = true;
      modalView = '#modalActaNHijoRec';
    }

    if(paramsAditional) {
      this.closeModalDocument('#modalDetalleDocumento');
      this.openModalDocument(modalView);
      return;
    }

    let generaDoc: boolean = true;

    if(this.historicoDocumentos.length > 0 && (this.docSelected.params.tipo != '9')) {

      let ultimoDocumentoGenerado = this.historicoDocumentos[0];
      let datePipe = new DatePipe("en-US");
      let fechaActual = datePipe.transform(new Date(), 'yyyy-MM-dd');
      let fechaVencimiento = datePipe.transform(ultimoDocumentoGenerado.fechaVencimiento, 'yyyy-MM-dd');
      //console.log('consulta', this.validarFechaVencimiento(fechaActual, fechaVencimiento));

      // si la fecha actual es menor a la fecha de vencimiento
      if(this.validarFechaVencimiento(fechaActual, fechaVencimiento)) {
        generaDoc = false;
        // proceso de generacion de historico de documento
        this.generarDocumentoHistorico(ultimoDocumentoGenerado);
      }
      
    }

    if(generaDoc) {
      // proceso de generacion de documento
      this.getRptDocument(this.docSelected.params);
    }

  }

  validarFechaVencimiento(sDate: string, eDate: string){
    let isValidDate = true;
    if((sDate == null || eDate ==null)){
      isValidDate = false;
    }
    if((sDate != null && eDate !=null) && (eDate) < (sDate)){
      isValidDate = false;
    }
    return isValidDate;
  }

  getCertificadoSnpp(tipo, curso) {
    this.docSelected.params = {
      'cedula': this.ciudadano.cedula,
      'codEspecialidad': curso.cod_especialidad,
      'codFuente': curso.fuente_consulta,
      'tipo': tipo.toString()
    };

    this.getRptDocument(this.docSelected.params);
  }

  getRptDocument(params: any) {
    this.loading = true;
    this.resultado = { status: true, message: '' };
    
    this.documentosService.getRptDocument(this.token, params).subscribe(response => {
      if(response.status) {

        this.closeModalDocument('#modalDetalleDocumento');

        $("body").removeClass("modal-open");

        if(response.objId != null && response.payment) {
          this.router.navigate(['/solicitud-documento/'+response.objId]);

        } else {
          this.router.navigate(['/visor/carpeta-ciudadana/'+response.objId]);
        }
        
        this.loading = false;

      } else {
        this.resultado = { status: false, message: response.message };
        this.loading = false;
        this.toastrService.warning('', response.message);
      }
    }, error => {
      console.log('error', error);
      this.loading = false;
      this.toastrService.warning('','Ocurrió un error al procesar la operación');
    });
  }

  getCursosSnpp(idTipoServicio) {
    this.documentosService.getCursosSnppIE(this.token, this.ciudadano.cedula).subscribe(response => {
      if(response.status) {
        this.cursos = { 'idTipoServicio': idTipoServicio, 'data': response.data };
        setTimeout(function() { $('#modalView').modal('show'); }, 500);
        this.loading = false;
      } else {
        this.loading = false;
        this.toastrService.warning('','No se encontraron cursos disponibles');
      }
    }, error => {
      console.log('error', error);
      this.loading = false;
      this.toastrService.warning('','Ocurrió un error al procesar la operación');
    });
  }

  getListDocumentos() {
    this.documentosIE = [
        /** NO REQUIERE I.E */
        {
          "name": "Constancia de ser o no Funcionario Público (SFP)", "isSession": false, 
          "linkExternal": false, "link": "/documentos/funcionario-publico", "title": "Obtené la constancia de ser o no ser funcionario público, proveniente de la Secretaría de la Función Pública (SFP) con datos consultados desde el SINARH y Nómina de Funcionarios Permanentes o Contratos."
        }, 
        {
          "name": "Consulta de Asegurado (IPS)", "isSession": false, 
          "linkExternal": false, "link": "/documentos/ips-asegurado", "title": "Consultá si una persona está o no inscripta como asegurada ante el IPS, y los datos respectivos en caso de estarlo."
        },   
        {
          "name": "Consulta de Inscripción de  Empleado (Ministerio de Trabajo)", "isSession": false, 
          "linkExternal": false, "link": "/documentos/inscripcion-empleado", "title": "Obtené la información de estar o no inscripto ante la Dirección de Registro Obrero Patronal del Ministerio de Trabajo, Empleo y Seguridad Social (MTEES)."
        },
        {
          "name": "Consulta de Datos de RUC (SET)", "isSession": false, 
          "linkExternal": false, "link": "/documentos/ruc-set", "title": "Accede a los datos de la Cédula Tributaria de contribuyentes provenientes de la Subsecretaría de Estado de Tributación (SET)."
        },
        {
          "name": "Certificado de Cumplimiento  Tributario (SET)", "isSession": false, 
          "linkExternal": true, "link": "https://servicios.set.gov.py/eset-publico/certificadoCumplimientoIService.do", "title": "Obtené el Certificado de Cumplimiento Tributario emitido en línea por la Subsecretaría de Estado de Tributación (SET)"
        },
        {
          "name": "Consulta de Cédula de MIPYMES", "isSession": false, 
          "linkExternal": false, "link": "/documentos/mipymes", "title": "Podrás validar y verificar datos de una Cédula de MIPYMES con la información del Viceministerio de Micro, Pequeñas y Medianas Empresas del Ministerio de Industria y Comercio."
        },
        {
          "name": "Descarga de Certificados de Cursos (SNPP)", "isSession": false, 
          "linkExternal": false, "link": "/documentos/snpp", "title": ""
        },

        /** REQUIERE I.E */
        {
          "name": "Consulta de Datos de Cédula (Policía Nacional)", "isSession": true, 
          "linkExternal": false, "link": '/login-ciudadano',  "title": "Podrás validar y verificar datos de una Cédula de Identidad con la información proveniente en línea desde el Departamento de Identificaciones de la Policía Nacional."
        },
        {
          "name": "Constancia de Acta de Nacimiento (Registro Civil)", "isSession": true, 
          "linkExternal": false, "link": "/login-ciudadano", "title": ""
        },
        {
          "name": "Constancia de Acta de Matrimonio (Registro Civil)", "isSession": true, 
          "linkExternal": false, "link": "/login-ciudadano", "title": ""
        },
        {
          "name": "Constancia de Acta de Defunción (Registro Civil)", "isSession": true, 
          "linkExternal": false, "link": "/login-ciudadano", "title": ""
        },
        {
          "name": "Consulta de Salario del Asegurado (IPS)", "isSession": true, 
          "linkExternal": false, "link": "/login-ciudadano", "title": ""
        },
        {
          "name": "Consulta de Nivel Académico (MEC)", "isSession": true, 
          "linkExternal": false, "link": "/login-ciudadano", "title": ""
        },
        {
          "name": "Constancia de Acta de Nacimiento Hijo/a (Registro Civil)", "isSession": true, 
          "linkExternal": false, "link": "/login-ciudadano", "title": ""
        },
        {
          "name": "Constancia de vacunación (MSPyBS)", "isSession": true, 
          "linkExternal": false, "link": "/login-ciudadano", "title": ""
        },
        {
          "name": "Constancia de Vacunación - Hijo/a (MSPyBS)", "isSession": true, 
          "linkExternal": false, "link": "/login-ciudadano", "title": ""
        },
        {
          "name": "Consulta de Certificados (SNPP)", "isSession": true, 
          "linkExternal": false, "link": "/login-ciudadano", "title": ""
        },
    ];
  }

  redirect(doc) {
    if(doc.linkExternal) {
      window.location.href = doc.link;
      return true;

    } else {
      this.router.navigate([doc.link]);
    }
  }

  openModal(id: string) {
    this.modalService.open(id);
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }

  openModalDocument(name:string) {
    setTimeout(function() { $(name).modal('show'); }, 500);
  }

  closeModalDocument(name:string) {
    setTimeout(function() {
      $(name).modal('hide'); 
      $('.modal-backdrop').hide();
    }, 500);
  }

  scrollTop() {
    let top = document.getElementById('topcab');
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }
  }
  
}
