import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AppConfig } from "app/app.config";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class BolsaTrabajoService {

	constructor(private http: HttpClient, private config: AppConfig) { }

	getListBolsa(idInst: number): Observable<any> {
		return this.http.get<any[]>(this.config.API_BOLSA_TRABAJO + "/bolsaTrabajo/" + idInst);
	}

} 