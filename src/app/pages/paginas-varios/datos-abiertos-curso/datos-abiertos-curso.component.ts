import { Component, OnInit } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { MessageService } from "app/services/MessageService";

@Component({
  selector: "datos-abiertos-curso",
  templateUrl: "datos-abiertos-curso.html"
})
export class DatosAbiertosCursoComponent implements OnInit {
  public iframeTraductor: string;

  constructor(
    public messageService: MessageService
  ) {}

  ngOnInit(): void {
    window.scrollTo(200, 1);
  }
}
