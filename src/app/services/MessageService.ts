import { Injectable } from "@angular/core";
import { Observable , Subject } from "rxjs";
import { AppConfig } from "app/app.config";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class MessageService {

  public divider: string = "45";
  public dividerDefault: string = "0";
  public TITLE_BUSCADOR = "Buscar Información";
  public TITLE_BUSCADOR_OCULTO = "Ocultar Buscador";

  public buscadorVisible: boolean = false;
  // Observable string sources
  private formDataSearch = new Subject<any>();
  // Observable string streams
  public formDataSearchResult = this.formDataSearch.asObservable();
  
  // Observable string sources
  private currentUserService = new Subject<any>();
  // Observable string streams
  public currentUserResult = this.currentUserService.asObservable();

  constructor(private http: HttpClient, private config: AppConfig) { }

  emitChangeCurrentUserService(change: any) {
    this.currentUserService.next(change);
  }

  // Service message commands
  emitChangeDataSearch(change: any) {
    this.formDataSearch.next(change);
  }

  mostrarBuscador(status: boolean) {
    this.buscadorVisible = status;
    this.emitChangeDataSearch({
      data: null,
      origen: null,
      visible: status
    });
  }

  getSearchTramitesYServicios(valorBuscar: string, clasificador: number): Observable<any[]> {
    return this.http.get<any[]>(this.config.API + "/buscar/tramitesYServicios/" + valorBuscar + "/" + clasificador);
  }

  getSearchServiciosClasificador(clasificador: any): Observable<any[]> {
    return this.http.get<any[]>(this.config.API + "/buscar/servicioClasificador/" + clasificador);
  }

  getSearchInfoPublica(dataSearch: string): Observable<any[]> {
    let paramSearch: any = {
      type: "or",
      filters: [
        { path: "descripcion", like: dataSearch },
        { path: "titulo", like: dataSearch },
        { path: "fecha", sortDesc: "true", like: dataSearch },
        { path: "conteoSuscripciones", sortDesc: "true", like: "" },
        { path: "fechaLimite", like: dataSearch },
        { path: "institucion.nombre", like: dataSearch },
        { path: "institucion.ministerio", like: dataSearch },
        { path: "flujosSolicitud.comentario", like: dataSearch },
        { path: "flujosSolicitud.titulo", like: dataSearch },
        { path: "estado.nombre", like: dataSearch },
        { path: "usuario.nombre", like: dataSearch },
        { path: "usuario.apellido", like: dataSearch }
      ]
    };
    let urlSearch =
      this.config.URL_AIP_BACK + encodeURI(JSON.stringify(paramSearch));
    return this.http.get<any[]>(urlSearch);
  }

  getSearchInfoDatosAbiertos(dataSearch: string): Observable<any> {
    let urlDeafult: string =
      this.config.URL_DATOS_ABIERTOS + dataSearch + "&rows=30&start=1";
    return this.http.get<any[]>(urlDeafult);
  }
}
