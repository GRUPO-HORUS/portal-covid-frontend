import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { finalize, catchError } from 'rxjs/operators';
import {ReporteNoUbicacionModel} from "../model/reporte-no-ubicacion.model";
import { HttpErrorHandler } from 'app/util/http.error.handler';

@Injectable()
export class ReporteNoUbicacionService  {

  url = 'api/covid19/reporte/pacientes';

  constructor(private http: HttpClient, private handler: HttpErrorHandler) {

  }

  getAllQueryReporte(start: number, pageSize: number, filter: string, sortDesc: boolean, sortField: string): Observable<any> {

    let params = new HttpParams();

    if (sortField)
      params = params.set('orderBy', sortField);

    params = params
      .set('page', start.toString())
      .set('pageSize', pageSize.toString())
      .set('orderDesc', sortDesc.toString());

    if (filter)
      params = params.set('ubicacionNoReportada', filter);

    return this.http.get<any>(this.url + '/', { params, observe: 'response'})
      .pipe(finalize(() => { }))
      .pipe(catchError(this.handler.handleError<any>('getAllQueryReporte', new Array<ReporteNoUbicacionModel>())));
  }

}
