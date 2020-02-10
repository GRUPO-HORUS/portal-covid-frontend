import { Component, OnInit } from "@angular/core";
import { MessageService } from "app/services/MessageService";
import { DomSanitizer } from "@angular/platform-browser";
import { AppConfig } from "app/app.config";
import { Router, ActivatedRoute } from "@angular/router";
import { LoginService } from "../../services/login.service";
declare var $: any;

@Component({
  selector: "buscador",
  templateUrl: "./buscador-resultado.html",
  providers: [LoginService],
})
export class BuscadorResultadoComponent implements OnInit {

  public currentUser: any;
  public urlAIP: string;
  public busqueda: any;
  public idData: number;
  
  public visible: boolean = true;
  public loading: boolean = false;
  public countResults: number = 0;

  public resultTab2: any = {};
  public resultTab3: any = {};
  public resultTab4: any = {};
  public resultTab5: any = {};

  public tabActive: string;
  public searchActive: boolean = false;
  public messageEmpty = "No se encontraron resultados coincidentes";

  /* PAGINACION */
  //tramites y servicios
  nroTramitesServicios: number = 1;
  keyTramitesServicios: string = "descripcion";
  reverseTramitesServicios: boolean = false;
  //categoria
  nroCategoria: number = 1;
  keyCategoria: string = "descripcion";
  reverseCategoria: boolean = false;
  //datos abiertos
  nroDatosAbiertos: number = 1;
  keyDatosAbiertos: string = "descripcion";
  reverseDatosAbiertos: boolean = false;
  //informacion publica
  nroAIP: number = 1;
  keyAIP: string = "descripcion";
  reverseAIP: boolean = false;

  public tab: any;
  public origen: any;

  constructor(
    private domSanitizer: DomSanitizer,
    private config: AppConfig,
    public messageService: MessageService,
    private _router: Router,
    private _route: ActivatedRoute,
    private auth: LoginService
  ) {

    this.currentUser = this.auth.getCurrentUser();

    messageService.formDataSearchResult.subscribe(dataSearch => {
      let infoData: any;
      if (dataSearch != null) {
        infoData = dataSearch;
        this.visible = infoData.visible;

        if (dataSearch.data != null && dataSearch.data !== "undefined" && dataSearch.data !== "") {            
          this.busqueda = infoData.data;
          this.idData = infoData.id;
          this.searchData("tramites_servicios", infoData.origen);

        } else { 
          this.searchActive = false;
        }
      } else {
        this.searchActive = false;
      }

    });
  }

  /*ngOnInit(): void {
    this.visible = true;
    this.urlAIP = this.config.URL_AIP_FRONT;

    this.busqueda = "mitic";
    this.searchData('tramites_servicios','search');
  }*/

  ngOnInit() {
    this.viewScrollTop();
    this._route.params.subscribe(params => {
      this.tab = params["tab"];
      this.origen = params["origen"];
      this.busqueda = params["busqueda"];
      this.searchData('tramites_servicios','search');
    });
  }

  viewScrollTop() {
    window.scrollTo(600, 1);
  }

  getUrlServicio(linkDatos, id) {
    let url = "";
    url = this.config.URL_BASE_PORTAL +'/oee/'+ linkDatos;
    if(id != null && Number(id) > 0) {
      url = this.config.URL_BASE_PORTAL +'/oee/'+ linkDatos+'/'+id;
    }
    return url;
  }
  
  searchData(tab: string, origen: string) {
    this.countResults = 0;
    if (origen === "categoria") { tab = "categoria"; }
    this.tabActive = tab;
    this.searchActive = true;
    this.scrollTop();

    switch (tab) {
      case "tramites_servicios":
        this.getTramitesYServicios();
        break;
      case "categoria":
        this.getServiciosClasificador();
        break;
      case "datos_abiertos":
        this.getDatosAbiertos();
        break;
      case "informacion_publica":
        this.getInfoPublica();
        break;
      default:
    }
  }

  scrollTop() {
    let top = document.getElementById('topBusqueda');
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }
  }

  getServiciosClasificador() {
    let idClasificador: string = "";
    if (typeof this.idData !== "undefined" && this.idData != null) {
      idClasificador = String(this.idData);
    } else {
      idClasificador = this.busqueda;
    }
    this.resultTab5 = {};
    this.messageService.getSearchServiciosClasificador(idClasificador).subscribe(data => {
      if (data != null && data.length > 0) {
        this.resultTab5 = { resultados: data, encuentra: true };
        this.countResults = data.length;
      }
    },
    error => {
      this.resultTab5 = { resultados: [], encuentra: false };
    });
  }

  getTramitesYServicios() {
    this.resultTab2 = {};
    this.loading = true;
    this.messageService.getSearchTramitesYServicios(this.busqueda, 0).subscribe(
      data => {
        if (data != null && data.length > 0) {
          this.resultTab2 = { resultados: data, encuentra: true };
          this.countResults = data.length;
        }
        this.loading = false;
      },
      error => {
        this.resultTab2 = { resultados: [], encuentra: false };
        this.loading = false;
      }
    );
  }

  getUrlDatosAbiertos(url) {
    let urlFinal: string = url;
    if (!String(url).startsWith("http")) {
      urlFinal = "http://" + url;
    }
    return this.domSanitizer.bypassSecurityTrustResourceUrl(urlFinal);
  }

  getDatosAbiertos() {
    this.resultTab3 = {};
    this.loading = true;
    this.messageService.getSearchInfoDatosAbiertos(this.busqueda).subscribe(
      data => {
        if (data != null) {
          this.resultTab3 = {
            resultados: data.result.results,
            encuentra: true
          };
          this.countResults = data.result.results.length;
          this.loading = false;
        }
      },
      error => {
        this.resultTab3 = { resultados: [], encuentra: false };
        this.loading = false;
      }
    );
  }

  getInfoPublica() {
    this.resultTab4 = {};
    this.loading = true;
    this.messageService.getSearchInfoPublica(this.busqueda).subscribe(
      data => {
        if (data != null && data.length > 0) {
          this.resultTab4 = { resultados: data, encuentra: true };
          this.countResults = data.length;
        }
        this.loading = false;
      },
      error => {
        this.resultTab4 = { resultados: [], encuentra: false };
        this.loading = false;
      }
    );
  }

  /* SORT COLUMNS */
  sortTramitesServicios(keyTramitesServicios) {
    this.keyTramitesServicios = keyTramitesServicios;
    this.reverseTramitesServicios = !this.reverseTramitesServicios;
  }

  sortCategoria(keyCategoria) {
    this.keyCategoria = keyCategoria;
    this.reverseCategoria = !this.reverseCategoria;
  }

  sortDatosAbiertos(keyDatosAbiertos) {
    this.keyDatosAbiertos = keyDatosAbiertos;
    this.reverseDatosAbiertos = !this.reverseDatosAbiertos;
  }

  sortAIP(keyAIP) {
    this.keyAIP = keyAIP;
    this.reverseAIP = !this.reverseAIP;
  }
}
