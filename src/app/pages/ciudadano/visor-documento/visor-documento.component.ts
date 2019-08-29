import { Component, OnInit } from "@angular/core";
import { MessageService } from "../../../services/MessageService";
import { LoginService } from 'app/services/login.service';
import { AppConfig } from "../../../app.config";
import { Router, ActivatedRoute } from "@angular/router";
import { IdentidadPersona } from "app/pages/ciudadano/model/identidad-persona.model";
import { DocumentosService } from "app/services/documentos.service";
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: "visor-documento",
  styleUrls: ['visor-documento.component.css'],
  providers: [LoginService, DocumentosService],
  templateUrl: "visor-documento.component.html"
})
export class VisorDocumentoComponent implements OnInit {

  public ciudadano: IdentidadPersona;
  public token: string;
  public ruta: string;
  public objId: string;
  public loading: boolean;
  public resultado: any = { status: true, message: ''};
  public linkSource: any;

  constructor(
    public messageService: MessageService,
    public config: AppConfig,
    private _route: ActivatedRoute,
    private router: Router,
    public auth: LoginService,
    public documentosService: DocumentosService,
    public sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.viewScrollTop(100);
    
    this._route.params.subscribe(params => {

      this.ruta = params["ruta"];
      this.objId = params["objId"];
      
      if(this.ruta != 'validar-documento' && this.ruta != 'documentos') {
        this.token = this.auth.getToken();
        this.ciudadano = this.auth.getCurrentUser();
        
        if(this.ciudadano == null || this.token == null) {
          this.router.navigate(['/login-ciudadano']);
          return;
        }
      }

    });
  }

  viewScrollTop(pos: number) {
    window.scrollTo(pos, 1);
  }

  cancelGenerarDocumento() {
    this.router.navigate([this.ruta]);
  }

  getDocumento(download: boolean) {
    if(this.ruta == 'validar-documento' || this.ruta == 'documentos'){
      this.getViewDocument(download);
    }else{
      this.getSingleFileDocument(download);
    }
  }
  
  getSingleFileDocument(download: boolean) {
    if(!download) {
      this.loading = true;
    }
    this.token = this.auth.getToken();
    this.documentosService.getSingleFileDocument(this.token, this.objId).subscribe(response => {
      this.getPDF(this.objId, response.data, download);
      //  this.linkSource = this.sanitizer.bypassSecurityTrustResourceUrl('data:application/pdf;base64,' + response.data);
      this.loading = false;
    }, error => {
      console.log("error", error);
      this.loading = false;
    });
  }

  getViewDocument(download: boolean) {
    if(!download) {
      this.loading = true;
    }
    this.documentosService.getViewDocument(this.objId).subscribe(response => {
      this.getPDF(this.objId, response.data, download);
      this.loading = false;
    }, error => {
      console.log("error", error);
      this.loading = false;
    });
  }

  getPDF(fileName: string, pdfInBase64: any, download: boolean) {
    setTimeout(() => {        
        let linkSource = 'data:application/pdf;base64,' + pdfInBase64;
        let link = document.createElement('a'); 
        link.href = linkSource;  
        link.setAttribute("type", "hidden"); 
        //if(download) 
        link.download = fileName+'.pdf'; 
        //if(!download) link.target = '_blank';
        document.body.appendChild(link); 
        link.click(); 
        link.remove();
    }, 500);
  }

}
