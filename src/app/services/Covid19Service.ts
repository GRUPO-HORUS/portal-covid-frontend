import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AppConfig } from "app/app.config";
import { HttpClient } from "@angular/common/http";

import { HttpErrorHandler } from 'app/pages/identidad-electronica/model/http.error.handler';
import { catchError } from '../../../node_modules/rxjs/operators';

@Injectable()
export class Covid19Service {

  constructor(private config: AppConfig, private httpClient: HttpClient) {}

  handler: HttpErrorHandler = new HttpErrorHandler();

    sendMessage(phone: string): Observable<any[]>{
      return this.httpClient.get<any[]>(this.config.API +"/covid19/sendMessage?phone="+phone);
    }

    guardarDatosBasicos(formDatosBasicos): Observable<any[]> {
      return this.httpClient.post<any[]>(this.config.API + '/covid19api/ingresoPais/datosBasicosViajero', formDatosBasicos)
        .pipe(catchError(this.handler.handleError<any[]>('/covid19api/ingresoPais/datosBasicosViajero')));
    }

    /*crearConfiguracion(configuracion: Configuracion): Observable<MessageResponse> {
      this.loading.next(true);
      return this.http.post<MessageResponse>(this.url + '/crear', configuracion)
        .pipe(finalize(() => { this.loading.next(false) }))
        .pipe(catchError(this.handler.handlePostError<MessageResponse>('crearConfiguracion')));
    }*/

    enviarCodigo(codigo, idRegistro){

    }
 }



