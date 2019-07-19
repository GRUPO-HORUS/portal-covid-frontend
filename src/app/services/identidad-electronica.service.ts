import { Injectable } from '@angular/core';
import { AppConfig } from 'app/app.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from '../../../node_modules/rxjs/operators';
import { IdentidadRespuesta } from 'app/pages/identidad-electronica/model/Identidad-respuesta.model';
import { Persona } from 'app/plugins/gestion-clave/persona';
import { HttpErrorHandler } from 'app/pages/identidad-electronica/model/http.error.handler';
import { IdentidadPersona } from '../pages/ciudadano/model/identidad-persona.model';

@Injectable({
  providedIn: 'root'
})
export class IdentidadElectronicaService {

  constructor(private http: HttpClient, private config: AppConfig) { }

  handler: HttpErrorHandler = new HttpErrorHandler();

  send(req: Persona, catpcha: string): Observable<IdentidadRespuesta> {
    return this.http.post<IdentidadRespuesta>(this.config.API_GESTION_CLAVE + '/persona/resetear-clave?captcha=' + catpcha, req)
      .pipe(catchError(this.handler.handleError<IdentidadRespuesta>('sendResetearClave', new IdentidadRespuesta())));
  }

  actualizarDatosPersona(token: string, req: IdentidadPersona): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
    return this.http.post<any>(this.config.API + '/auth/actualizar-datos', req, { headers: headers })
      .pipe(catchError(this.handler.handleError<any>('actualizarDatosPersona', new IdentidadRespuesta())));
  }

  actualizarDatosIPersona(token: string, req: any): Observable<any> {
    let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
    return this.http.post<any>(this.config.API + '/auth/actualizar-datos-ipersona', req, { headers: headers })
      .pipe(catchError(this.handler.handleError<any>('actualizarDatosIPersona', new IdentidadRespuesta())));
  }

  getDepartamentos(): Observable<any[]> {
    return this.http.get<any[]>(this.config.API_GESTION_CLAVE + "/departamento/obtenerDepartamento");
  }

  getCiudades(idDepartamento: number): Observable<any[]> {
    return this.http.get<any[]>(this.config.API_GESTION_CLAVE + "/ciudad/obtenerCiudad/" + idDepartamento);
  }

  getByIdCiudad(idCiudad: number): Observable<any[]> {
    return this.http.get<any[]>(this.config.API_GESTION_CLAVE + "/ciudad/obtenerCiudadPorId/" + idCiudad);
  }

  getByIdBarrio(idBarrio: number): Observable<any[]> {
    return this.http.get<any[]>(this.config.API_GESTION_CLAVE + "/barrio/obtenerBarrioPorId/" + idBarrio);
  }

  getBarrios(idCiudad: number): Observable<any[]> {
    return this.http.get<any[]>(this.config.API_GESTION_CLAVE + "/barrio/obtenerBarrio/" + idCiudad);
  }


}
