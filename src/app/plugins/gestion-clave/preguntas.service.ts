import { Injectable } from "@angular/core";
import { AppConfig } from "app/app.config";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Persona } from "./persona";
import { IdentidadRespuesta } from "app/pages/identidad-electronica/model/Identidad-respuesta.model";
import { catchError } from "rxjs/operators";
import { HttpErrorHandler } from "app/pages/identidad-electronica/model/http.error.handler";

@Injectable()
export class PreguntasService {

  handler: HttpErrorHandler = new HttpErrorHandler();
  constructor(private _http: HttpClient, private config: AppConfig) { }

  verExiste(cedula: string, email: string, domicilio: string, telefono: string, captchaResponse: string, ignoreCaptcha: boolean): Observable<any> {
    let personaDTO: any = {
      'email': email,
      'domicilio': domicilio,
      'telefono': telefono
    };
    return this._http.post<any>(this.config.API_GESTION_CLAVE + "/preguntas/existe/" + cedula + "/" + captchaResponse, personaDTO);
  }

  sendRespuestas(cedula: string, body: any): Observable<any> {
    return this._http.post<any>(this.config.API_GESTION_CLAVE + "/preguntas/respuestas/" + cedula, body);
  }

  guardarPersona(body: any): Observable<any> {
    return this._http.post<any>(this.config.API_GESTION_CLAVE + "/preguntas/guardar/", body);
  }

  actualizarClave(persona: Persona): Observable<IdentidadRespuesta> {
    return this._http.post<IdentidadRespuesta>(this.config.API_GESTION_CLAVE + "/persona/clave/", persona)
      .pipe(catchError(this.handler.handleError<IdentidadRespuesta>('actualizarClave', new IdentidadRespuesta())));
  }

}
