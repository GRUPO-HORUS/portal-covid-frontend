import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AppConfig } from "app/app.config";
import { HttpClient } from "@angular/common/http";
import { IdentidadPersona } from "app/pages/ciudadano/model/identidad-persona.model";

@Injectable()
export class LoginService {

    constructor(private httpClient: HttpClient, private config: AppConfig) { }

    getCantidadOee(): Observable<any[]> {
        return this.httpClient.get<any[]>(this.config.API + "/oee/cantidadOee");
    }

    verifyAuthentication(): Observable<any[]> {
        return this.httpClient.post<any[]>(this.config.API + '/auth/validarAcceso', {
            code: this.getToken(),
            state: this.getState()
        });
    }

    getConfig(){
        return this.httpClient.get<any[]>(this.config.API + '/auth/getConfig', {});
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
   
    logout() {
        var user = localStorage.getItem('currentUser');
        if (user) {
            localStorage.removeItem('currentUser');
            localStorage.removeItem('state');
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
            console.log("token inválido: removed", "expiresIn:  "+expiresIn +" < current: "+ current);
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
