import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AppConfig } from "app/app.config";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class ComprasPublicasService {

	constructor(private http: HttpClient, private config: AppConfig) { }

	getListCompras(tipoUC: string, uocCodigo: number): Observable<any> {
		return this.http.get<any[]>(this.config.API_COMPRAS_PUBLICAS + "/comprasPublicas/" + tipoUC + "/" + uocCodigo);
	}

} 