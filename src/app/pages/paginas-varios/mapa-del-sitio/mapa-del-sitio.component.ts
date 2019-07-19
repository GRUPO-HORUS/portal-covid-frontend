import { Component, OnInit } from "@angular/core";
import { MessageService } from "app/services/MessageService";

@Component({
  selector: "mapa-del-sitio",
  templateUrl: "mapa-del-sitio.html"
})
export class MapaDelSitioComponent implements OnInit {

  constructor(
    public messageService: MessageService
  ) {}

  ngOnInit(): void {
    window.scrollTo(200, 1);
  }
}
