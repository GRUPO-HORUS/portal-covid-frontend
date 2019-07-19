import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AppConfig } from "app/app.config";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class NoticiasIppyService {

	constructor(private http: HttpClient, private config: AppConfig) { }

	getListNoticias(): Observable<any> {
		return this.http.get(this.config.API + "/noticiasippy");
	}

	getLinkImagenNoticias(urlImagen: string): Observable<any> {
		return this.http.post(this.config.API + "/noticiasippy/imagen", urlImagen);
	}

} 