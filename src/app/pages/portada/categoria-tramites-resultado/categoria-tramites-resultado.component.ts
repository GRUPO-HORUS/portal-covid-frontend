import { Component, OnInit } from "@angular/core";
import { MessageService } from "app/services/MessageService";
import { AppConfig } from "app/app.config";
import { Router, ActivatedRoute } from "@angular/router";
declare var $: any;

@Component({
  selector: "categoria-tramites-resultado",
  templateUrl: "categoria-tramites-resultado.html"
})
export class CategoriaTramiteResultadoComponent implements OnInit {

    public loading: boolean = false;
    public countResults: number = 0;
    public resultTab5: any = {};
    public messageEmpty = "No se encontraron resultados coincidentes";
    public idClasificador: any;
    public nombreClasificador: string;
  
    //categoria
    nroCategoria: number = 1;
    keyCategoria: string = "descripcion";
    reverseCategoria: boolean = false;
    
    constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    public messageService: MessageService,
    private config: AppConfig,
    ) {}

    ngOnInit() {
      this.viewScrollTop();
      this._route.params.subscribe(params => {
        this.idClasificador = params["filtro"];
        this.getServiciosClasificador();
      });
    }

    viewScrollTop() {
      window.scrollTo(600, 1);
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

    scrollTop() {
      let top = document.getElementById('topBusqueda');
      if (top !== null) {
        top.scrollIntoView();
        top = null;
      }
    }

}
