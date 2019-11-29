import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../../services/MessageService';
import { LoginService } from 'app/services/login.service';
import { AppConfig } from '../../../app.config';
import { Router } from '@angular/router';
import { IdentidadPersona } from 'app/pages/ciudadano/model/identidad-persona.model';
import { DocumentosService } from 'app/services/documentos.service';
import { ToastrService } from 'ngx-toastr';
import { ModalService } from 'app/lib/modal-custom';
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
  
  public dataCC: any[] = [];
  public docSelected:any = {};
  public cursos: any;

  public sistemasDeConsultas: any = [
    { id: 1, descripcion: 'SGR' },
    { id: 2, descripcion: 'SRI' },
  ];

  constructor(
    public messageService: MessageService,
    public config: AppConfig,
    private router: Router,
    public auth: LoginService,
    public documentosService: DocumentosService,
    private toastrService: ToastrService,
    private modalService: ModalService
  ) {}

  ngOnInit() {

    this.ciudadano = this.auth.getCurrentUser();
    this.token = this.auth.getToken();
    
    if(this.ciudadano == null || this.token == null) {
      this.router.navigate(['/login-ciudadano']);
      return;
    }

    this.getHistoricoConsultas();
    this.scrollTop();
  }

  viewInfo(position: number) {
    if(this.dataCC[position] != null) {
      this.docSelected = this.dataCC[position];
      setTimeout(function() { $('#modalDetalleDocumento').modal('show'); }, 300);
    }
  }

  cancelGenerarDocumento() {
    this.viewTramitesEID();
  }
  
  getHistoricoConsultas() {
    this.documentosService.getHistoricoConsultas(this.token, this.ciudadano.cedula).subscribe(response => {
      this.dataCC = response;
    }, error => {
      console.log('error', error);
    });
  }

  generarDocumentoHistorico(result: any) {
    // setTimeout(function() { 
    //   $('#modalDetalleDocumento').modal('hide'); 
    //   $('.modal-backdrop').hide();
    // }, 500);

    this.closeModalDocument('#modalDetalleDocumento');

    if(result.liq  != null) {
      this.router.navigate(['/solicitud-documento/'+result.liq._id]);
    } else {
      this.router.navigate(['/visor/carpeta-ciudadana/'+result._id]);
    }
  }

  generarDocumento(result) {
    this.scrollTop();
    
    this.docSelected.params = {};
    this.docSelected.params.tipo = result.key.toString(); 
    this.docSelected.params.cedula = this.ciudadano.cedula;
    
    if(result.key == 10) {
      this.getCursosSnpp(result);
      return;
    }

    if(result.key == 11) {
      this.docSelected.params.dv = '';
      this.docSelected.params.titulo = 'Constancia de RUC (SET)';
      this.closeModalDocument('#modalDetalleDocumento');
      this.openModalDocument('#modalRucSet');
      return;
    }

    if(result.key == 13 || result.key == 14) {
      let titulo = result.key == 13 ? 'Acta de Nacimiento (REC)' : 'Acta de Matrimonio (REC)';
      //this.docSelected.params = Object.assign({}, this.docSelected.params, { 'sistemaConsulta' : 2, 'titulo': titulo });
      this.docSelected.params.cedula = '1700144';
      this.docSelected.params.sistemaConsulta = 2;
      this.docSelected.params.titulo = titulo;
      this.closeModalDocument('#modalDetalleDocumento');
      this.openModalDocument('#modalActaNMDrec');
      return;
    }

    this.getRptDocument(this.docSelected.params);
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

    this.documentosService.getRptDocument(this.token, params)
    .subscribe(response => {
      if(response.status) {

        this.closeModalDocument('#modalDetalleDocumento');

        if(response.objId != null && response.payment) 
          this.router.navigate(['/solicitud-documento/'+response.objId]);
        else 
          this.router.navigate(['/visor/carpeta-ciudadana/'+response.objId]);
        
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

  getCursosSnpp(result) {
    this.documentosService.getCursosSnppIE(this.token, this.ciudadano.cedula).subscribe(response => {
      if(response.status) {
        this.cursos = { 'key': result.key, 'data': response.data };
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

  addParam(param: any) {

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

  viewTramitesEID() {
    this.scrollTop();
    this.loading = false;
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
