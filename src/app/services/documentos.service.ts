import { Injectable } from '@angular/core';
import { AppConfig } from 'app/app.config';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from '../../../node_modules/rxjs/operators';
import { HttpErrorHandler } from 'app/pages/identidad-electronica/model/http.error.handler';

@Injectable({
  providedIn: 'root'
})
export class DocumentosService {

  constructor(private http: HttpClient, private config: AppConfig) { }

  handler: HttpErrorHandler = new HttpErrorHandler();

  // autenticationFastpay(params: any) {
  //   let apiKey = 'FeUhdTu2XzXEtFYvnEpB9blrq7GJXuWt';
  //   let apiSecret = 'Zykpd0QqBUKZLXFM';
  //   let headers = new HttpHeaders()
  //     .set('Content-Type', 'application/json')
  //     .set('Accept', 'application/json')
  //     .set('Authorization', 'Basic '+btoa(apiKey+':'+apiSecret));
  //   return this.http.post<any>('https://dev.fastpay.com.py/transaction/transactionRequest', params, { headers: headers })
  //     .pipe(catchError(this.handler.handleError<any>('autenticationFastpay', {})));
  // }

  autenticationFastpay(token, transactionId) {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Accept', 'application/json').set('Authorization', token);
    return this.http.post<any>(this.config.API_DOCUMENTOS + '/fpTransaction/transactionRequest', { 'transactionId': transactionId }, { headers: headers })
          .pipe(catchError(this.handler.handleError<any>('autenticationFastpay', {})));
  }

  getCursosSnpp(token, cedula: string): Observable<any> {
    cedula = '2064197';
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Accept', 'application/json').set('Authorization', token);
    return this.http.get<any>(this.config.API_DOCUMENTOS + '/documento/getCursosSnpp/'+cedula, { headers: headers })
      .pipe(catchError(this.handler.handleError<any>('getCursosSnpp', {})));
  }

  getRptDocument(token, cedula: string, tipo: number): Observable<any> {
    //cedula = '3236538';
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Accept', 'application/json').set('Authorization', token);
    return this.http.get<any>(this.config.API_DOCUMENTOS + '/documento/getRptDocument?cedula='+cedula+'&tipo='+tipo, { headers: headers })
      .pipe(catchError(this.handler.handleError<any>('getRptDocument', {})));
  }

  getRptDocumentSnpp(token, cedula: string, codEspecialidad: number, tipo: number): Observable<any> {
    cedula = '2064197';
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Accept', 'application/json').set('Authorization', token);
    return this.http.get<any>(this.config.API_DOCUMENTOS + '/documento/getRptDocument?cedula='+cedula+'&codEspecialidad='+codEspecialidad+'&tipo='+tipo, { headers: headers })
      .pipe(catchError(this.handler.handleError<any>('getRptDocument', {})));
  }

  getHistoricoConsultas(token, cedula: string): Observable<any[]> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Accept', 'application/json').set('Authorization', token);
    return this.http.get<any[]>(this.config.API_DOCUMENTOS + "/documento/getHistoricoConsultas/"+cedula, { headers: headers })
    .pipe(catchError(this.handler.handleError<any>('getHistoricoConsultas', {})));
  }

  getMenuIdentidadElectronica(): Observable<any[]> {
    return this.http.get<any[]>(this.config.API + "/tramites/identidadElectronica");
  }

  getSingleFileDocument(token, objId: string): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Accept', 'application/json').set('Authorization', token).set('responseType','blob');
    return this.http.get<any>(this.config.API_DOCUMENTOS + '/documento/getFileDocument/'+objId, { headers: headers });
  }

  getSingleFileLiq(token, objId: string): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Accept', 'application/json').set('Authorization', token).set('responseType','blob');
    return this.http.get<any>(this.config.API_DOCUMENTOS + '/documento/getFileLiq/'+objId, { headers: headers });
  }

  getSingleLiquidacion(token, objId: string): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Accept', 'application/json').set('Authorization', token).set('responseType','blob');
    return this.http.get<any>(this.config.API_DOCUMENTOS + '/documento/getSingleLiquidacion/'+objId, { headers: headers });
  }

  getViewDocument(objId: string): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Accept', 'application/json').set('Authorization', objId).set('responseType','blob');
    return this.http.get<any>(this.config.API_DOCUMENTOS + '/documento/getViewDocument/'+objId, { headers: headers });
  }

  validacionDocumento(constancia_nro: string, identificador_unico: string): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Accept', 'application/json')/*.set('Authorization', token)*/.set('responseType','blob');
    return this.http.get<any>(this.config.API_DOCUMENTOS + '/documento/getDocumentValidate/'+constancia_nro+'/'+identificador_unico, { headers: headers });
  }

  /*downloadFileDocument(objId: string): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/pdf').set('Content-Type', 'application/octet-stream');
    return this.http.get<any>(this.config.API_DOCUMENTOS + '/documento/downloadFileDocument/'+objId, { headers: headers, responseType: 'json' } )
      .pipe(catchError(this.handler.handleError<any>('downloadFileDocument', {})));
  }*/

}
