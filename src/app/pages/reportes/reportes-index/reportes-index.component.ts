import { Component, OnInit } from "@angular/core";
import { PoderesDelEstadoService } from "app/services/PoderesDelEstadoService";
import { DomSanitizer } from "@angular/platform-browser";
import { MessageService } from "app/services/MessageService";

@Component({
  selector: "reportes-index",
  templateUrl: "reportes-index.component.html",
  providers: [PoderesDelEstadoService]
})
export class ReportesIndexComponent implements OnInit {

  titulo: string = "Estadísticas";

  constructor(
    public messageService: MessageService,
    public sanitizer: DomSanitizer
  ) {}

  ngOnInit() { 
  }

  
}
