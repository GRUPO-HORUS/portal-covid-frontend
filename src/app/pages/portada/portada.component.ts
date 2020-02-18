import { Component, OnInit } from "@angular/core";
import { MessageService } from "./../../services/MessageService";
import { AppConfig } from "app/app.config";
import { PoderesDelEstadoService } from "app/services/PoderesDelEstadoService";
import { Router, ActivatedRoute } from "@angular/router";
declare var $: any;

@Component({
  selector: "portada",
  templateUrl: "./portada.html",
  styles: [``]
})
export class PortadaComponent implements OnInit {
  public loading: boolean = false;
  public countResults: number = 0;
  public resultTab5: any = {};
  public messageEmpty = "No se encontraron resultados coincidentes";
  public idClasificador: any;
  public nombreClasificador: string;

  ultimosTramitesEnLinea: any;
  tramitesEnLinea: any;
  nroCategoria: number = 1;
  keyCategoria: string = "descripcion";
  reverseCategoria: boolean = false;
  
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    public messageService: MessageService,
    private config: AppConfig,
    private poderesDelEstadoService: PoderesDelEstadoService
  ) {
    this.getListTramitesDestacados();
    this.getListTramitesOnline();
  }

  ngOnInit() {
    this.idClasificador = 1;//trámites con ID-e
    this.getServiciosClasificador();
  }

  getServiciosClasificador() {
    this.resultTab5 = {};
    this.messageService.getSearchServiciosClasificador(this.idClasificador).subscribe(data => {
      if (data != null && data.length > 0) {
        this.resultTab5 = { resultados: data, encuentra: true };
        this.nombreClasificador = this.resultTab5.resultados[0].nombre;
        this.countResults = data.length;
      }
    },
    error => {
      this.resultTab5 = { resultados: [], encuentra: false };
    });
  }

  getUrlServicio(linkDatos, id) {
    let url = "";
    url = this.config.URL_BASE_PORTAL +'/oee/'+ linkDatos;
    if(id != null && Number(id) > 0) {
      url = this.config.URL_BASE_PORTAL +'/oee/'+ linkDatos+'/'+id;
    }
    return url;
  }

  getDataServicio(linkDatos, id) {
    this._router.navigate(["/oee/", linkDatos, id]);
  }

  getListTramitesDestacados(): void {
    this.poderesDelEstadoService.getListTramitesEnLinea(1,3).subscribe(data => {
        this.tramitesEnLinea = data;
      },
      error => {
        console.log("error", error);
      }
    );
  }

  getListTramitesOnline(): void {
    this.poderesDelEstadoService.getListTramitesEnLinea(0,3).subscribe(
      data => {
        this.ultimosTramitesEnLinea = data;
      },
      error => {
        console.log("error", error);
      }
    );
  }

  openMessage(idServicio:number) {
    setTimeout(function() { $(".servicio-modal-"+idServicio).modal("toggle"); }, 500);
  }

}
