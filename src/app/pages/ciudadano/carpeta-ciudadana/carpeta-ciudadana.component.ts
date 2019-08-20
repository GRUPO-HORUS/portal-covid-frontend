import { Component, OnInit } from "@angular/core";
import { MessageService } from "../../../services/MessageService";
import { LoginService } from 'app/services/login.service';
import { AppConfig } from "../../../app.config";
import { Router } from "@angular/router";
import { IdentidadPersona } from "app/pages/ciudadano/model/identidad-persona.model";
import { DocumentosService } from "app/services/documentos.service";
declare var $: any;

@Component({
  selector: "carpeta-ciudadana",
  styleUrls: ['carpeta-ciudadana.component.css'],
  providers: [LoginService, DocumentosService],
  templateUrl: "carpeta-ciudadana.component.html"
})
export class CarpetaCiudadanaComponent implements OnInit {

  public ciudadano: IdentidadPersona;
  public token: string;
  public loading: boolean;
  public resultado: any = { status: true, message: ''};
  public menuDocument: any[];
  public dataCarpetaCiudadana: any[] = [];
  public cursos: any;

  constructor(
    public messageService: MessageService,
    public config: AppConfig,
    private router: Router,
    public auth: LoginService,
    public documentosService: DocumentosService
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
    if(this.dataCarpetaCiudadana[position] != null) {
      this.dataCarpetaCiudadana[position].view = !this.dataCarpetaCiudadana[position].view;
    }
  }

  cancelGenerarDocumento() {
    this.viewTramitesEID();
  }
  
  getHistoricoConsultas() {
    this.documentosService.getHistoricoConsultas(this.token, this.ciudadano.cedula).subscribe(response => {
      this.dataCarpetaCiudadana = response;
    }, error => {
      console.log("error", error);
    });
  }

  generarDocumentoHistorico(result: any) {
    if(result.liq  != null) {
      this.router.navigate(["/solicitud-documento/"+result.liq._id]);
    } else {
      this.router.navigate(["/visor/carpeta-ciudadana/"+result.tipo+"/"+result._id]);
    }
  }

  generarDocumento(result) {
    this.scrollTop();
    this.loading = true;
    this.resultado = {status: true, message: ''};
    
    if(result.key == 10) {
      this.getCursosSnpp(result);
      return;
    }

    this.getRptDocument(result); 
  }

  getRptDocument(result) {
    this.documentosService.getRptDocument(this.token, this.ciudadano.cedula, result.key).subscribe(response => {
      if(response.status) {
        if(response.objId != null && response.payment) {
          this.router.navigate(["/solicitud-documento/"+response.objId]);
        } else {
          this.router.navigate(["/visor/carpeta-ciudadana/"+result.tipo+"/"+response.objId]);
        }
        this.loading = false;
      } else {
        this.resultado = {status: false, message: response.message};
        this.loading = false;
      }
    }, error => {
      console.log("error", error);
      this.loading = false;
    });
  }

  getCertificadoSnpp(tipo, curso) {
    this.loading = true;
    this.resultado = {status: true, message: ''};
    this.documentosService.getRptDocumentSnpp(this.token, this.ciudadano.cedula, curso.cod_especialidad, tipo).subscribe(response => {
      if(response.status) {
        if(response.objId != null && response.payment) {
          this.router.navigate(["/solicitud-documento/"+response.objId]);
        } else {
          this.router.navigate(["/visor/carpeta-ciudadana/"+tipo+"/"+response.objId]);
        }
        setTimeout(function() { 
          $("#modalView").modal("hide"); 
          $('.modal-backdrop').hide();
      }, 500);
        this.loading = false;
      } else {
        this.resultado = {status: false, message: response.message};
        this.loading = false;
      }
    }, error => {
      console.log("error", error);
      this.loading = false;
    });
  }

  getCursosSnpp(result) {
    this.documentosService.getCursosSnpp(this.token, this.ciudadano.cedula).subscribe(response => {
      if(response.status) {
        this.cursos = { 'key': result.key, 'data': response.data };
        setTimeout(function() { $("#modalView").modal("show"); }, 500);
        this.loading = false;
      } else {
        this.loading = false;
      }
    }, error => {
      console.log("error", error);
      this.loading = false;
    });
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
