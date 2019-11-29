import { Component } from '@angular/core';
import { AppConfig } from "app/app.config";
//import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'documentos',
  templateUrl: './documentos.component.html',
  styleUrls: ["./documentos.component.css"]
})

export class DocumentosComponent {
  
  constructor(
    private config: AppConfig,
    //private _route: ActivatedRoute,
   // private router: Router,
  ) {
  }  

}
