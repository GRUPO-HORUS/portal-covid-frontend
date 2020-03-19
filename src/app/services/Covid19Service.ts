import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AppConfig } from "app/app.config";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class Covid19Service {

  constructor(private config: AppConfig, private httpClient: HttpClient) {}

sendMessage(phone: string): Observable<any[]>{
  return this.httpClient.get<any[]>(this.config.API +"/covid19/sendMessage?phone="+phone);
}
 }



