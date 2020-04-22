import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {HttpClient, HttpParams, HttpResponse} from '@angular/common/http';
import {finalize, catchError, map} from 'rxjs/operators';
import {ReporteNoUbicacionModel} from "../model/reporte-no-ubicacion.model";
import { HttpErrorHandler } from 'app/util/http.error.handler';

@Injectable()
export class ReporteNoUbicacionService  {

  url = 'api/covid19/reporte/pacientes';

  constructor(private http: HttpClient, private handler: HttpErrorHandler) {

  }

  getAllQueryReporte(start: number, pageSize: number, search: string, sortDesc: boolean, sortField: string, filterList: string[]): Observable<any> {

    let params = new HttpParams();

    if (sortField)
      params = params.set('orderBy', sortField);

    params = params
      .set('page', start.toString())
      .set('pageSize', pageSize.toString())
      .set('orderDesc', sortDesc.toString());

    if (search) {
      params = params.set('search', search);
    }

    params = params.set('filters', 'ubicacionNoReportada:720');

    if(filterList && filterList.length > 0) {
      for (let filter of filterList) {
        params = params.append('filters', filter);
      }
    }

    return this.http.get<any>(this.url + '/', { params, observe: 'response'})
      .pipe(finalize(() => { }))
      .pipe(catchError(this.handler.handleError<any>('getAllQueryReporte', new Array<ReporteNoUbicacionModel>())));
  }

  downloadCSV(filter: string, sortDesc: boolean, sortField: string): Observable<any> {

    let params = new HttpParams();

    if (sortField)
      params = params.set('orderBy', sortField);

    params = params.set('orderDesc', sortDesc.toString());

    params = params.set('filters', 'ubicacionNoReportada:720');

    return this.http.get(this.url + "/csv/", {params, responseType: 'blob', observe: 'response' })
      .pipe(map((data: HttpResponse<Blob>) => {
          return new Blob([data.body], { type: 'text/csv;charset=utf-8' });
      }));

  }

}
