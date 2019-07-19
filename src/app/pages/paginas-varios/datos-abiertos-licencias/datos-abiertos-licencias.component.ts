import { Component, OnInit } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { MessageService } from "app/services/MessageService";

@Component({
  selector: "datos-abiertos-licencias",
  templateUrl: "datos-abiertos-licencias.html"
})
export class DatosAbiertosLicenciasComponent implements OnInit {
  public iframeTraductor: string;

  constructor(
    public messageService: MessageService
  ) {}

  ngOnInit(): void {
    window.scrollTo(200, 1);
  }
}
