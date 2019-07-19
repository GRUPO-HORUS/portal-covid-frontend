import { Component, OnInit } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { AppConfig } from "app/app.config";
import { MessageService } from "app/services/MessageService";

@Component({
  selector: "consulta-publica",
  templateUrl: "consulta-publica.html"
})
export class ConsultaPublicaComponent implements OnInit {
  public iframeConsultaPublica: string;

  constructor(
    public sanitizer: DomSanitizer,
    private config: AppConfig,
    public messageService: MessageService
  ) {}

  ngOnInit(): void {
    window.scrollTo(200, 1);
    this.iframeConsultaPublica = this.config.URL_CONSULTA_PUBLICA;
  }
}
