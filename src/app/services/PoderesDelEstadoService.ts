import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AppConfig } from "app/app.config";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class PoderesDelEstadoService {

  constructor(private httpClient: HttpClient, private config: AppConfig) { }

  getCantidadOee(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.config.API + "/oee/cantidadOee");
  }

  getCantidadTramites(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.config.API + "/tramites/cantidadTramites");
  }

  getListNivel(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.config.API + "/nivel");
  }

  getListEntidad(urlNivel: string): Observable<any[]> {
    return this.httpClient.get<any[]>(this.config.API + "/entidad/" + urlNivel);
  }

  getListOee(urlEntidad: string): Observable<any[]> {
    return this.httpClient.get<any[]>(this.config.API + "/oee/lista/" + urlEntidad);
  }

  getInfoOee(urlOee: string): Observable<any> {
    return this.httpClient.get<any[]>(this.config.API + "/oee/listaOeeInfo/" + urlOee);
  }

  createComentario(idOee: number, content: any): Observable<any> {
    return this.httpClient.post<any>(this.config.API + "/oee/createComentario/" + idOee, content);
  }

  getComentarios(idOee: number): Observable<any> {
    return this.httpClient.get<any[]>(this.config.API + "/oee/getComentarios/" + idOee);
  }

  getListOeeServicios(idOee: number): Observable<any[]> {
    return this.httpClient.get<any[]>(this.config.API + "/oee/listaOeeServicios/" + idOee);
  }

  getTramitesPorEtiqueta(): Observable<any[]>{
    return this.httpClient.get<any[]>(this.config.API+"/oee/getTramitesPorEtiqueta");
  }

  getTramitesPorCategoria(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.config.API + "/oee/getTramitesPorCategoria");;
  }

  getCantidadDocumentos(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.config.API_DOCUMENTOS + "/documento/cantidadDocumentos/2019-08-01/2019-08-28");
  }

  getPorcentajeTramitesOnline(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.config.API + "/oee/getPorcentajeTramitesOnline");;
  }

  getInstitucionesServiciosOnline(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.config.API + "/oee/getInstitucionesServiciosOnline");;
  }

  getTramitesPorCicloDeVida(): Observable<any[]> {
    return this.httpClient.get<any[]>(this.config.API + "/oee/getTramitesPorCicloDeVida");;
  }

  getInfoServicio(idServicio: number): Observable<any[]> {
    return this.httpClient.get<any[]>(this.config.API + "/oee/infoServicio/" + idServicio);
  }

  getListTramitesEnLinea(esDestacado: number, limit: number): Observable<any[]> {
    return this.httpClient.get<any[]>(this.config.API + "/servicioEtiqueta/tramites/"+limit+"/" + esDestacado);
  }

  getCategoriaTramite() {
    return this.httpClient.get(this.config.API + "/categoria/getCategoriaTramite");
  }

  getEstadistica(key: string): Observable<any[]> {
    return this.httpClient.get<any[]>(this.config.API + "/estadistica/data/"+key);
  }
  
}
