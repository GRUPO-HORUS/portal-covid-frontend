import { Component, OnInit } from "@angular/core";
import { MessageService } from "../../../services/MessageService";
import { LoginService } from 'app/services/login.service';
import { AppConfig } from "../../../app.config";
import { Router, ActivatedRoute } from "@angular/router";
import { IdentidadPersona } from "app/pages/ciudadano/model/identidad-persona.model";
import { DocumentosService } from "app/services/documentos.service";
import { DomSanitizer } from "@angular/platform-browser";
declare var $: any;

@Component({
  selector: "solicitud-documento",
  styleUrls: ['solicitud-documento.component.css'],
  providers: [LoginService, DocumentosService],
  templateUrl: "solicitud-documento.component.html"
})
export class SolicitudDocumento implements OnInit {

  public ciudadano: IdentidadPersona;
  public token: string;
  public loading: boolean;
  public resultado: any = { status: true, message: ''};
  public liquidacion: any;
  public idLiquidacion: string;
  public nroLiquidacion: string; 
  public transactionFp: any;

  constructor(
    public messageService: MessageService,
    public config: AppConfig,
    private router: Router,
    private _route: ActivatedRoute,
    public auth: LoginService,
    public sanitizer: DomSanitizer,
    public documentosService: DocumentosService
  ) {}

  ngOnInit() {
    this.ciudadano = this.auth.getCurrentUser();
    this.token = this.auth.getToken();
    
    if(this.ciudadano == null || this.token == null) {
      this.router.navigate(['/login-ciudadano']);
      return;
    }

    this._route.params.subscribe(params => {
      let idLiquidacion = params["liquidacion"];
      this.generarDocumento(idLiquidacion);
    });

    this.scrollTop();
  }

  authenticationFastPay(monto, transactionId) {
    let params = {
      "amount": 17000.0,
      "transactionId": this.nroLiquidacion, 
      "email": 'test@test.com', 
      "phoneNumber": '0981111111'
    };
    console.log('init fp');
    this.documentosService.autenticationFastpay(params).subscribe(response => {
      this.transactionFp = response;
      console.log('authenticationFastPay', response);

      setTimeout(function() { $("#modalFp").modal("toggle"); }, 500);
    }, error => {
      console.log("error:authenticationFastPay", error);
    });
  }

  generarDocumento(objId: string) {
    this.scrollTop();
    this.loading = true;
    this.resultado = {status: true, message: ''};
 
    this.documentosService.getSingleLiquidacion(this.token, objId).subscribe(response => {
      console.log('response', response);
      if(response) {
        this.liquidacion = response;
        this.nroLiquidacion = response.constanciaNro;

        this.loading = false;
      } else {
        this.resultado = {status: false, message: 'No se pudo obtener la liquidacion'};
        this.loading = false;
      }
    }, error => {
      console.log("error", error);
      this.loading = false;
    });
  }

  atras() {
    this.router.navigate(["/carpeta-ciudadana"]);
  }
  
  descargarDocumento() {
    this.router.navigate([ "/visor/carpeta-ciudadana/9/"+this.liquidacion.documento ]);
  }

  descargarTicket() {
    this.loading = true;
    this.token = this.auth.getToken();
    this.documentosService.getSingleFileLiq(this.token, this.liquidacion._id).subscribe(response => {
      this.getPDF(this.liquidacion._id, response.data, false);
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

  scrollTop() {
    let top = document.getElementById('topcab');
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }
  }
  
}
