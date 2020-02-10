import { Component, OnInit } from "@angular/core";
import { MessageService } from "app/services/MessageService";
import { PoderesDelEstadoService } from "app/services/PoderesDelEstadoService";
import { Router } from "@angular/router";
import { AppConfig } from "../../../app.config";

@Component({
  selector: "tramites-online-template",
  templateUrl: "tramites-online-template.html"
})
export class TramitesOnlineTemplateComponent implements OnInit {
  
  tramitesEnLinea: any[] = [];
  //tramites y servicios
  keyTramitesServicios: string = "servicio.nombreServicio";
  reverseTramitesServicios: boolean = false;
  countResults: number = 0;
  cantidadTramites: number = 0;

  currentPage: number = 1;
  itemsPerPage: number = 7;
  cantidadInitPorPagina: number = 0;
  cantidadPorPagina: number = 0;

  urlPathPortal: string = '';

  filter: any;

  constructor(
    private _router: Router,
    public messageService: MessageService,
    private poderesDelEstadoService: PoderesDelEstadoService,
    private config: AppConfig,
  ) {}

  ngOnInit() {
    this.viewScrollTop();
    this.getListTramites();
    this.getCantidadTramites();
  }

  sortTramitesServicios(keyTramitesServicios) {
    this.keyTramitesServicios = keyTramitesServicios;
    this.reverseTramitesServicios = !this.reverseTramitesServicios;
  }

  viewScrollTop() {
    window.scrollTo(800, 1);
  }

  pageChange(event){
    this.currentPage = event;
    this.viewScrollTop();
  }

  absoluteIndex(indexOnPage: number) {
    this.cantidadPorPagina =  ((this.itemsPerPage * (this.currentPage - 1) + indexOnPage) + 1);
    this.cantidadInitPorPagina = this.cantidadPorPagina - (this.countResults / this.itemsPerPage);
  }

  actualizarCantidadResultado(event: any){
    if(event != null)
      this.countResults = Number(event);
  }
  

  getListTramites(): void {
    this.poderesDelEstadoService.getListTramitesEnLinea(0,0).subscribe(
      data => {
        for(let x = 0; x < data.length; x++) {
          this.tramitesEnLinea.push({
            // idServicioEtiqueta: data[x].idServicioEtiqueta,
            descripcionServicio: data[x].descripcionServicio,
            idServicio: data[x].idServicio,
            nombreServicio: data[x].nombreServicio,
            urlOee: data[x].oee.urlOee,
          });
        }
        this.countResults = this.tramitesEnLinea.length;
      },
      error => {
        console.log("error", error);
      }
    );
  }

  getCantidadTramites(): void {
    this.poderesDelEstadoService.getCantidadTramites().subscribe(
      data => {
        this.cantidadTramites = Number(data);
      },
      error => {
        console.log("error", error);
      }
    );
  }

  getDataServicio(linkDatos, id) {
    this._router.navigate(["/oee/", linkDatos, id]);
  }

  getUrlServicio(linkDatos, id) {
    return this.config.URL_BASE_PORTAL +'/oee/'+ linkDatos +'/'+ id;
  }

}
