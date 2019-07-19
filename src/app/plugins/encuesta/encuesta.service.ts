import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class EncuestaService {

	constructor(private http: HttpClient) { }

	getTipoEncuesta(identeficador: string, version: number): Observable<any> {
		return this.http.get<any[]>(environment.apiPortalPluginUrl + "/tipoEncuesta/" + identeficador + "/" + version);
	}

	create(encuesta) {
		return this.http.post(environment.apiPortalPluginUrl + '/encuesta', encuesta);
	}

}