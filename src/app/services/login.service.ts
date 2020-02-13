import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { IdentidadPersona } from "app/pages/ciudadano/model/identidad-persona.model";
import { catchError } from '../../../node_modules/rxjs/operators';
import { HttpErrorHandler } from 'app/pages/identidad-electronica/model/http.error.handler';
import { AppConfig } from "app/app.config";
import { IdentidadRespuesta } from "app/pages/identidad-electronica/model/Identidad-respuesta.model";

@Injectable()
export class LoginService {

    constructor(private http: HttpClient, private config: AppConfig) { }

    handler: HttpErrorHandler = new HttpErrorHandler();

    getCantidadOee(): Observable<any[]> {
        return this.http.get<any[]>(this.config.API + "/oee/cantidadOee");
    }

    verifyAuthentication(): Observable<any> {
        return this.http.post<any>(this.config.API + '/auth/validarAcceso', { code: this.getToken(), state: this.getState() }, {})
          .pipe(catchError(this.handler.handleError<any>('verifyAuthentication', {})));
    }
    /*
    verifyAuthentication(): Observable<any[]> {
        console.log('verifyAuthentication');
        return this.http.post<any[]>(this.config.API + '/auth/validarAcceso', {
            code: this.getToken(),
            state: this.getState()
        });
    }*/

    getConfig(){
        return this.http.get<any[]>(this.config.API + '/auth/getConfig', {});
    }

    getImageProfile(token: string) {
        let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
        return this.http.post<any>(this.config.API + '/auth/getImageProfile', {}, { headers: headers })
          .pipe(catchError(this.handler.handleError<any>('getImageProfile', new IdentidadRespuesta())));
    }
    
    setState(state) {
        if(state != null) {
            localStorage.setItem('state', JSON.stringify(state));
        }
    }
    getState() {
        let state = null;
        if(localStorage.getItem('state') != null){
            state = JSON.parse(localStorage.getItem('state'));
        }
        return state;
    }

    setToken(token) {
        if(token != null) {
            this.setStorage('token', token, 3600);
        }
    }

    getToken() {
        let token = null;
        if(localStorage.getItem('token') != null){
            token = this.getStorage('token');
        }
        return token;
    }

    setCurrentUser(user) {
        if(user != null){
            this.setStorage('currentUser', JSON.stringify(user), 3600);
        }
    }

    getCurrentUser(): IdentidadPersona {
        let currentUser = null;
        if(localStorage.getItem('currentUser') != null) {
            currentUser =  JSON.parse(this.getStorage('currentUser'));
        }
        return currentUser;
    }
   
    setTokenTmp(token) {
        if(token != null) {
            this.setStorage('token', token, 3600);
        }
    }

    getTokenTmp() {
        let token = null;
        if(localStorage.getItem('token') != null){
            token = this.getStorage('token');
        }
        return token;
    }

    setImgProf(token) {
        if(token != null) {
            this.setStorage('imageProfile', token, 3600);
        }
    }

    getImgProf() {
        let imageProfile = null;
        if(localStorage.getItem('imageProfile') != null){
            imageProfile = this.getStorage('imageProfile');
        }
        return imageProfile;
    }

    logout() {
        var user = localStorage.getItem('currentUser');
        if (user) {
            localStorage.removeItem('currentUser');
            localStorage.removeItem('imageProfile');
            localStorage.removeItem('token');
            localStorage.removeItem('state');
            localStorage.removeItem('tokenTmp');
        }
    }

    guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    removeStorage(name: string) {
        try {
            localStorage.removeItem(name);
            localStorage.removeItem(name + '_expiresIn');
        } catch(e) {
            console.log('removeStorage: Error removing key from localStorage: ' + JSON.stringify(e) );
            return false;
        }
        return true;
    }
    getStorage(key: string) {
        let current = Date.now();  //epoch time, lets deal only with integer
        let expiresIn: any = localStorage.getItem(key+'_expiresIn'); // set expiration for storage
        if (expiresIn === undefined || expiresIn === null) { expiresIn = 0; }
        if (expiresIn < current) { // expired
            this.removeStorage(key);
            return null;
        } else {
            try {
                return localStorage.getItem(key);
            } catch(e) {
                console.log('token inválido:' + JSON.stringify(e) );
                return null;
            }
        }
    }
    setStorage(key: string, value: any, expires: number) {
        if (expires === undefined || expires === null) { 
            expires = (24*60*60);  
        } else {
            expires = Math.abs(expires);
        }
        let current = Date.now();  
        let schedule: any = current + expires * 1000;
        try {
            localStorage.setItem(key, value);
            localStorage.setItem(key + '_expiresIn', schedule+"");
        } catch(e) {
            console.log('setStorage: Error setting key ['+ key + '] in localStorage: ' + JSON.stringify(e) );
            return false;
        } 
        return true;
    }
    
}
