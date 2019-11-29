import { Component, OnInit } from "@angular/core";
import { MessageService } from "../../../services/MessageService";
import { LoginService } from 'app/services/login.service';
import { AppConfig } from "../../../app.config";
import { Router } from "@angular/router";
import { IdentidadPersona } from "app/pages/ciudadano/model/identidad-persona.model";
import { DocumentosService } from "app/services/documentos.service";
import { DomSanitizer } from '@angular/platform-browser';
import { HttpParams } from "@angular/common/http";
declare var $: any;

@Component({
  selector: "tramites-con-eid",
  styleUrls: ['tramites-con-eid.component.css'],
  providers: [LoginService, DocumentosService],
  templateUrl: "tramites-con-eid.component.html"
})
export class TramitesConEidComponent implements OnInit {

  public ciudadano: IdentidadPersona;
  public token: string;
  public objId: string;
  public tipoId: number;
  public loading: boolean;
  public menuIE: any[];
  public resultado: any = { status: true, message: ''};

  public linkSource: any;
  public isTramitesEID: boolean = true;
  public isConfirm: boolean = false;
  public isDocument: boolean = false;

  constructor(
    public messageService: MessageService,
    public config: AppConfig,
    private router: Router,
    public auth: LoginService,
    public documentosService: DocumentosService,
    public sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.viewScrollTop(100);
    this.viewTramitesEID();    

    this.token = this.auth.getToken();
    this.ciudadano = this.auth.getCurrentUser();
    
    if(this.ciudadano == null || this.token == null) {
      this.router.navigate(['/login-ciudadano']);
      return;
    }

    this.getMenuIdentidadElectronica();
  }

  confirmarGeneracionDocumento(tipoId: number){
    this.tipoId = tipoId;
    //$("#miModalConfirm").modal("show");
    this.viewConfirm();
  }

  viewScrollTop(pos: number) {
    window.scrollTo(pos, 1);
  }

  getMenuIdentidadElectronica() {
    this.loading = true;
    this.documentosService.getMenuIdentidadElectronica().subscribe(response => {
      this.menuIE = response;
      this.loading = false;
    }, error => {
      console.log("error", error);
      this.loading = false;
    });
  }

  cancelGenerarDocumento(){
    this.viewTramitesEID();
  }

  generarDocumento(tipo: number) {
    this.viewDocument();
    this.loading = true;
    this.resultado = {status: true, message: ''};

    let params = new HttpParams().set("cedula", this.ciudadano.cedula).set("tipo", this.tipoId.toString());

    this.documentosService.getRptDocument(this.token, params).subscribe(response => {
      if(response.status) {
        
        this.objId = response.objId;

        this.router.navigate(["/visor/tramites-con-eid/"+this.objId]);
      } else {
        this.resultado = {status: false, message: response.message};
        this.loading = false;
      }      
      //$("#miModal").modal("show");
    }, error => {
      console.log("error", error);
      this.loading = false;
    });
  }

  viewTramitesEID(){
    this.loading = false;
    this.isTramitesEID = true;
    this.isConfirm = false;
    this.isDocument = false;
  }

  viewConfirm(){
    this.isTramitesEID = false;
    this.isConfirm = true;
    this.isDocument = false;
  }

  viewDocument(){
    this.isTramitesEID = false;
    this.isConfirm = false;
    this.isDocument = true;
  }

}
