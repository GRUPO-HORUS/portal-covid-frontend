import { Injectable } from '@angular/core';
import { AppConfig } from 'app/app.config';
import { HttpClient, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from '../../../node_modules/rxjs/operators';
import { HttpErrorHandler } from 'app/pages/identidad-electronica/model/http.error.handler';

@Injectable({
  providedIn: 'root'
})
export class DocumentosService {

  constructor(private http: HttpClient, private config: AppConfig) { }

  handler: HttpErrorHandler = new HttpErrorHandler();

  loadTipoServicio(): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get<any>('assets/data/tipo_servicios.json', { headers: headers });
  }

  autenticationFastpay(token, transactionId) {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Accept', 'application/json').set('Authorization', token);
    return this.http.post<any>(this.config.API_DOCUMENTOS + '/fpTransaction/transactionRequest', { 'transactionId': transactionId }, { headers: headers })
          .pipe(catchError(this.handler.handleError<any>('autenticationFastpay', {})));
  }

  getCursosSnppIE(token, cedula: string): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Accept', 'application/json').set('Authorization', token);
    return this.http.get<any>(this.config.API_DOCUMENTOS + '/documento/getCursosSnppIE/'+cedula, { headers: headers })
      .pipe(catchError(this.handler.handleError<any>('getCursosSnpp', {})));
  }

  getCursosSnpp(token, cedula: string, codAlumno: string, captchaResponse: string): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Accept', 'application/json').set('Authorization', token);
    return this.http.get<any>(this.config.API_DOCUMENTOS + '/documento/getCursosSnpp/'+cedula+'/'+codAlumno+'/'+captchaResponse, { headers: headers })
      .pipe(catchError(this.handler.handleError<any>('getCursosSnpp', {})));
  }

  getRptDocumentSinIE(objParams: any, captchaResponse: string): Observable<any> {
    let params = new HttpParams();
    
    Object.keys(objParams).forEach(p => {
        params = params.append(p.toString(), objParams[p].toString());
    });

    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Accept', 'application/json');
    return this.http.get<any>(this.config.API_DOCUMENTOS + '/documento/getRptDocumentSinIE/'+captchaResponse, { headers: headers, params: params })
      .pipe(catchError(this.handler.handleError<any>('getRptDocumentSinIE', {})));
  }

  getRptDocument(token, objParams: any): Observable<any> {
      let params = new HttpParams();
      Object.keys(objParams).forEach(p => {
          params = params.append(p, objParams[p]);
      });
    
      let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Accept', 'application/json').set('Authorization', token);

      return this.http.get<any>(this.config.API_DOCUMENTOS + '/documento/getRptDocument', { headers: headers, params: params })
        .pipe(catchError(this.handler.handleError<any>('getRptDocument', {})));
  }

  getServicios(token): Observable<any[]> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Accept', 'application/json').set('Authorization', token);
    return this.http.get<any[]>(this.config.API_DOCUMENTOS + "/documento/getServicios", { headers: headers })
    .pipe(catchError(this.handler.handleError<any>('getServicios', {})));
  }

  getHistoricoConsultas(token, idTipoServicio): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Accept', 'application/json').set('Authorization', token);
    return this.http.get<any[]>(this.config.API_DOCUMENTOS + "/documento/getHistoricoConsultas/"+idTipoServicio, { headers: headers })
    .pipe(catchError(this.handler.handleError<any>('getHistoricoConsultas', {})));
  }

  getMenuIdentidadElectronica(): Observable<any[]> {
    return this.http.get<any[]>(this.config.API + "/tramites/identidadElectronica");
  }

  getFileDocument(token, objId: string): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Accept', 'application/json').set('Authorization', token).set('responseType','blob');
    return this.http.get<any>(this.config.API_DOCUMENTOS + '/documento/getFileDocument/'+objId, { headers: headers });
  }

  getViewDocument(cv: string, objId: string): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Accept', 'application/json').set('responseType','blob');
    return this.http.get<any>(this.config.API_DOCUMENTOS + '/documento/getViewDocument/'+cv+'/'+objId, { headers: headers });
  }

  getSingleFileLiq(token, objId: string): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Accept', 'application/json').set('Authorization', token).set('responseType','blob');
    return this.http.get<any>(this.config.API_DOCUMENTOS + '/documento/getFileLiq/'+objId, { headers: headers });
  }

  getSingleLiquidacion(token, objId: string): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Accept', 'application/json').set('Authorization', token).set('responseType','blob');
    return this.http.get<any>(this.config.API_DOCUMENTOS + '/documento/getSingleLiquidacion/'+objId, { headers: headers });
  }

  validacionDocumento(constancia_nro: string, identificador_unico: string): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Accept', 'application/json')/*.set('Authorization', token)*/.set('responseType','blob');
    return this.http.get<any>(this.config.API_DOCUMENTOS + '/documento/getDocumentValidate/'+constancia_nro+'/'+identificador_unico, { headers: headers });
  }

}
