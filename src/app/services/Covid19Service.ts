import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AppConfig } from "app/app.config";
import { HttpClient } from "@angular/common/http";

import { HttpErrorHandler } from 'app/pages/identidad-electronica/model/http.error.handler';
import { catchError } from '../../../node_modules/rxjs/operators';
import { FormDatosBasicos } from "app/pages/covid19/model/formDatosBasicos.model";

@Injectable()
export class Covid19Service {

  constructor(private config: AppConfig, private httpClient: HttpClient) {}

  handler: HttpErrorHandler = new HttpErrorHandler();

    sendMessage(phone: string): Observable<any[]>{
      return this.httpClient.get<any[]>(this.config.API +"/covid19/sendMessage?phone="+phone);
    }

    guardarDatosBasicos(formDatosBasicos, rcToken): Observable<string> {
      return this.httpClient.post<string>(this.config.API + '/covid19api/ingresoPais/datosBasicosViajero/'+rcToken, formDatosBasicos)
        //.pipe(catchError(this.handler.handleError<any[]>('/covid19api/ingresoPais/datosBasicosViajero')));
    }

    registrarPaciente(formDatosBasicos): Observable<string> {
      return this.httpClient.post<string>(this.config.API + '/covid19api/aislamiento/datosBasicos', formDatosBasicos);
        //.pipe(catchError(this.handler.handleError<string>('/covid19api/aislamiento/datosBasicos')));
    }

    guardarDatosClinicos(formDatosClinicos): Observable<string> {
      return this.httpClient.post<string>(this.config.API + '/covid19api/aislamiento/datosClinicos', formDatosClinicos);
        //.pipe(catchError(this.handler.handleError<string>('/covid19api/aislamiento/datosClinicos')));
    }

    getDatosBasicos(idRegistro, codigoVerif): Observable<FormDatosBasicos> {
      return this.httpClient.get<FormDatosBasicos>(this.config.API + '/covid19api/aislamiento/datosBasicosAislamiento/'+idRegistro+"/"+codigoVerif)
        .pipe(catchError(this.handler.handleError<FormDatosBasicos>('/covid19api/aislamiento/datosBasicosAislamiento')));
    }

    validarTelefono(idRegistro, codigoVerif, contrasenha): Observable<any> {
      return this.httpClient.post<any>(this.config.API + '/covid19api/aislamiento/validarTelefono/'+idRegistro+"/"+codigoVerif, contrasenha);
        //.pipe(catchError(this.handler.handleError<any>('/covid19api/aislamiento/validarTelefono')));
    }


    validarTelefonoIngresoPais(idRegistro, codigoVerif): Observable<any> {
      return this.httpClient.post<any>(this.config.API + '/covid19api/ingresoPais/validarTelefono/'+idRegistro+"/"+codigoVerif, {});
        //.pipe(catchError(this.handler.handleError<any>('/covid19api/aislamiento/validarTelefono')));
    }
 }



