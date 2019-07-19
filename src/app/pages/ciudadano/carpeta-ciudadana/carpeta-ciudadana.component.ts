import { Component, OnInit } from "@angular/core";
import { MessageService } from "../../../services/MessageService";
import { LoginService } from 'app/services/login.service';
import { AppConfig } from "../../../app.config";
import { Router } from "@angular/router";
import { IdentidadPersona } from "app/pages/ciudadano/model/identidad-persona.model";
import { DocumentosService } from "app/services/documentos.service";

@Component({
  selector: "carpeta-ciudadana",
  styleUrls: ['carpeta-ciudadana.component.css'],
  providers: [LoginService, DocumentosService],
  templateUrl: "carpeta-ciudadana.component.html"
})
export class CarpetaCiudadanaComponent implements OnInit {

  public ciudadano: IdentidadPersona;
  public token: string;
  public dataCarpetaCiudadana: any[] = [];
  public loading: boolean;

  public isTramitesEID: boolean = true;
  public isConfirm: boolean = false;
  public isDocument: boolean = false;
  public isBuyConfirm: boolean = false;

  public resultado: any = { status: true, message: ''};
  public documentData: any;
  public menuDocument: any[];

  public nroLiquidacion: string;
  public nombreApellido: string;
  public nroDocumento: string;
  public fechaSolicitud: string;
  public estadoSolicitud: string;
  public fechaPago: string;
  public lugarPago: string;
  public nroComprobantePago: number;
  public secBuySection: string = '';

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
    this.getMenuIdentidadElectronica();
    this.scrollTop();
  }
  
  getMenuIdentidadElectronica() {
    this.loading = true;
    this.documentosService.getMenuIdentidadElectronica().subscribe(response => {
      this.menuDocument = response;
      this.getHistoricoConsultas();
      this.loading = false;
    }, error => {
      console.log("error", error);
      this.loading = false;
    });
  }

  getHistoricoConsultas() {
    this.documentosService.getHistoricoConsultas(this.token, this.ciudadano.cedula).subscribe(response => {
      this.dataCarpetaCiudadana = response;
      for(let x = 0; x < this.dataCarpetaCiudadana.length; x++){
        for(let k = 0; k < this.menuDocument.length; k++){
          if(this.dataCarpetaCiudadana[x].key == this.menuDocument[k].codigoServicio){
            this.dataCarpetaCiudadana[x].name = this.menuDocument[k].nombreServicio;
          }
        }
      }
    }, error => {
      console.log("error", error);
    });
  }

  generarDocumentoHistorico(data: any) {
    this.router.navigate(["/visor/carpeta-ciudadana/"+data.tipo+"/"+data._id]);
  }

  viewInfo(position: number) {
    if(this.dataCarpetaCiudadana[position] != null) {
      this.dataCarpetaCiudadana[position].view = !this.dataCarpetaCiudadana[position].view;
    }
  }

  formBuyComplete() {
    this.secBuySection = "sec3";
    this.scrollBottom();
  }

  cancelGenerarDocumento() {
    this.documentData = null;
    this.viewTramitesEID();
  }

  descargarDocumento(objId) {
    console.log("documentData", this.documentData);
    this.router.navigate(["/visor/carpeta-ciudadana/"+ this.documentData.key+"/"+objId]);
  }

  descargarTicket() {
    this.viewDocument();
    this.loading = true;
    this.resultado = {status: true, message: ''};
    this.documentosService.getRptDocument(this.token, this.ciudadano.cedula, 1000).subscribe(response => {
      console.log(response.status);
      if(response.status) {
        this.router.navigate(["/visor/carpeta-ciudadana/"+ this.documentData.key+"/"+response.objId]);
        this.resultado = {status: false, message: response.message};
      } else {
        console.log("No se pudo generar el documento");
      }
      this.loading = false;
    }, error => {
      console.log("error", error);
      this.loading = false;
    });
  }

  generarDocumento(data) {
    this.viewDocument();
    this.loading = true;
    this.resultado = {status: true, message: ''};
    this.documentosService.getRptDocument(this.token, this.ciudadano.cedula, data.key).subscribe(response => {
      console.log(response.status);
      if(response.status) {
        this.documentData = data;

        this.nroLiquidacion = "#123456";
        this.estadoSolicitud = "PENDIENTE";
        this.nombreApellido = "Fernando Mancía";
        this.nroDocumento = "1.123.123";
        this.fechaSolicitud = "17/07/2019";
        this.fechaPago = "-";
        this.lugarPago = "-";
        this.nroComprobantePago = 0;
        this.loading = false;

        this.viewBuyConfirm();

      } else {
        this.resultado = {status: false, message: response.message};
        this.loading = false;
      }
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

  viewTramitesEID() {
    this.scrollTop();
    this.loading = false;
    this.isTramitesEID = true;
    this.isConfirm = false;
    this.isDocument = false;
    this.isBuyConfirm = false;
  }

  /*viewConfirm() {
    this.isTramitesEID = false;
    this.isConfirm = true;
    this.isDocument = false;
    this.isBuyConfirm = false;
  }*/

  viewDocument() {
    this.scrollTop();
    this.isDocument = true;
    this.isTramitesEID = false;
    this.isConfirm = false;    
    this.isBuyConfirm = false;
  }

  viewBuyConfirm(){
    this.scrollTop();
    this.secBuySection = "sec1";
    this.isBuyConfirm = true;
    this.isDocument = false;
    this.isTramitesEID = false;
    this.isConfirm = false;
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
