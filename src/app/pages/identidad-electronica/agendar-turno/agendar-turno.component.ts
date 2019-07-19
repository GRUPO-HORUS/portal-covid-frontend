import { Component, OnInit } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { AppConfig } from "../../../app.config";

@Component({
  selector: "agendar-turno",
  templateUrl: "agendar-turno.html"
})
export class AgendarTurnoComponent implements OnInit {
  public url: string;

  constructor(
    public sanitizer: DomSanitizer,
    private config: AppConfig,
  ) {}

  ngOnInit(): void {
    window.scrollTo(200, 1);
    this.url = this.config.URL_AGENDA_TURNO;
  }
}
