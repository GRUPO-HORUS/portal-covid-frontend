import { Component } from '@angular/core';
import { AppConfig } from "app/app.config";

@Component({
  selector: 'documentos',
  templateUrl: './documentos.component.html',
  styleUrls: ["./documentos.component.css"]
})

export class DocumentosComponent {
  
  constructor(
    private config: AppConfig
  ) {
  }   

}
