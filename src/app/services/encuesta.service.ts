import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AppConfig } from "app/app.config";
import { HttpClient } from "@angular/common/http";
import { HttpErrorHandler } from "../pages/identidad-electronica/model/http.error.handler";
import { catchError } from '../../../node_modules/rxjs/operators';

@Injectable()
export class EncuestaService {

    constructor(private http: HttpClient, private config: AppConfig) { }

    handler: HttpErrorHandler = new HttpErrorHandler();

    setVoto(idEncuesta, idServicio, voto) {
        if(idServicio != null && idEncuesta != null && voto != null) {
            let votacion = {
                'idEncuesta': idEncuesta, 'idServicio': idServicio, 'voto': voto,
            };        
            localStorage.setItem('votacion_'+idEncuesta+'_'+idServicio, JSON.stringify(votacion));
        }
    }

    getVoto(idEncuesta: number, idServicio: number) {
        let voto = null;
        if(localStorage.getItem('votacion_'+idEncuesta+'_'+idServicio) != null) {
            voto = JSON.parse(localStorage.getItem('votacion_'+idEncuesta+'_'+idServicio));
        }
        return voto;
    }

    guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    getSatisfaccionTramite(idEncuesta: number): Observable<any> {
        return this.http.get<any[]>(this.config.API + "/oee/getSatisfaccionTramite/" + idEncuesta);
      }

    votacionServicio(idEncuesta, idServicio, voto): Observable<any> {
        return this.http.post<any>(this.config.API + '/oee/votacionServicio/'+idEncuesta+'/'+idServicio+'/'+voto, {})
          .pipe(catchError(this.handler.handleError<any>('votacionServicio', {})));
    }
     
}
