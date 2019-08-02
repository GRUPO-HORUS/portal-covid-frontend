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
  public isLoading: boolean = false;
  public isBuyLiquidacion: boolean = false;

  public resultado: any = { status: true, message: ''};
  public documentData: any;
  public menuDocument: any[];

  public liquidacion: any;
  public nroLiquidacion: string; 

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
    this.documentData = null;
    this.viewTramitesEID();
  }

  
  getHistoricoConsultas() {
    this.documentosService.getHistoricoConsultas(this.token, this.ciudadano.cedula).subscribe(response => {
      this.dataCarpetaCiudadana = response;
    }, error => {
      console.log("error", error);
    });
  }

  generarDocumentoHistorico(result: any, response: any) {
    // console.log('response', response);
    // console.log('result', result);

    if(response.liq != null) {

      this.documentData = {
        key: result.key, 
        name: result.name, 
        objId: (response._id != null ? response._id : response.objId)
      };

      this.liquidacion = response.liq;

      this.nroLiquidacion = response.liq.constanciaNro;

      // console.log('liquidacion: ',this.liquidacion);
      // console.log('documentData: ',this.documentData);

      this.viewBuyLiquidacion();

    } else {
      this.router.navigate(["/visor/carpeta-ciudadana/"+response.tipo+"/"+response._id]);
    }
  }

  descargarTicket() {
    this.loading = true;
    this.viewLoading();
    
    this.token = this.auth.getToken();
    this.documentosService.getSingleFileLiq(this.token, this.liquidacion._id).subscribe(response => {

      this.getPDF(this.liquidacion._id, response.data, false);

      this.loading = false;

      this.cancelGenerarDocumento();

    }, error => {
      console.log("error", error);
      this.loading = false;
    });
  }

  descargarDocumento() {
    console.log(this.documentData);
    this.router.navigate([ "/visor/carpeta-ciudadana/"+ this.documentData.key+"/"+this.documentData.objId ]);
  }

  generarDocumento(result) {
    this.viewLoading();
    this.loading = true;
    this.resultado = {status: true, message: ''};
 
    this.documentosService.getRptDocument(this.token, this.ciudadano.cedula, result.key).subscribe(response => {
      if(response.status) {
        result.objId = response.objId;
        this.generarDocumentoHistorico(result, response);
        // this.documentData = {
        //   key: data.key, 
        //   name: data.name, 
        //   objId: response.objId 
        // };

        // if(response.liq != null){

        //   this.liquidacion = response.liq;

        //   this.nroLiquidacion = response.liq.constanciaNro;

        //   this.viewBuyLiquidacion();

        // } else {
        //   this.router.navigate(["/visor/carpeta-ciudadana/"+data.tipo+"/"+data._id]);
        // }

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
    this.isLoading = false;
    this.isBuyLiquidacion = false;
  }

  viewLoading() {
    this.scrollTop();
    this.isLoading = true;
    this.isTramitesEID = false;
    this.isBuyLiquidacion = false;
  }

  viewBuyLiquidacion(){
    this.scrollTop();
    this.isBuyLiquidacion = true;
    this.isLoading = false;
    this.isTramitesEID = false;
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
