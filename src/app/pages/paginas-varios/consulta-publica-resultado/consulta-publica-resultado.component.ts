import { Component, OnInit } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { AppConfig } from "app/app.config";
import { MessageService } from "app/services/MessageService";

@Component({
  selector: "consulta-publica-resultado",
  templateUrl: "consulta-publica-resultado.html"
})
export class ConsultaPublicaResultadoComponent implements OnInit {
  public iframeConsultaPublicaResultado: string;

  constructor(
    public sanitizer: DomSanitizer,
    private config: AppConfig,
    public messageService: MessageService
  ) {}

  ngOnInit(): void {
    window.scrollTo(200, 1);
    this.iframeConsultaPublicaResultado = this.config.URL_CONSULTA_PUBLICA_RESULTADO;
  }
}
