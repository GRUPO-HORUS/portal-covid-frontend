import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AppConfig } from "app/app.config";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class CategoriasTramitesService {

  constructor(private config: AppConfig, private httpClient: HttpClient) {}

getListCategorias(pagina: string, cantidadPorPagina: string): Observable<any[]>{
  return this.httpClient.get<any[]>(this.config.API +"/categoria/getAll?start=" + pagina +"&pageSize=" + cantidadPorPagina);
}
 }



