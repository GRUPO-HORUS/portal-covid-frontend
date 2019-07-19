import { Component, OnInit } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { AppConfig } from "app/app.config";
import { MessageService } from "app/services/MessageService";

@Component({
  selector: "suscripcion",
  templateUrl: "suscripcion.html"
})
export class SuscripcionComponent implements OnInit {
  public url: string;

  constructor(
    public sanitizer: DomSanitizer,
    private config: AppConfig,
    public messageService: MessageService
  ) {}

  ngOnInit(): void {
    window.scrollTo(200, 1);
    this.url = this.config.URL_SUSCRIPCION;
  }
}
