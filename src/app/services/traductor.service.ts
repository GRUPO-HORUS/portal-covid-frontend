import { Injectable } from '@angular/core';
import { AppConfig } from 'app/app.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from '../../../node_modules/rxjs/operators';
import { HttpErrorHandler } from 'app/pages/identidad-electronica/model/http.error.handler';

@Injectable({
  providedIn: 'root'
})
export class TraductorService {

  constructor(private http: HttpClient, private config: AppConfig) { }

  handler: HttpErrorHandler = new HttpErrorHandler();

  getTraductor(lang: string, filtro: string): Observable<any> {
    return this.http.post<any>(this.config.API + '/traductor/buscar/'+lang, { filtro: filtro  })
      .pipe(catchError(this.handler.handleError<any>('getTraductor', {})));
  }


}
