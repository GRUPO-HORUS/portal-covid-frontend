import { Component, OnInit } from "@angular/core";
import { MessageService } from "app/services/MessageService";

@Component({
  selector: "ie-preguntas-frecuentes-creacion",
  templateUrl: "ie-preguntas-frecuentes-creacion.html"
})
export class IEPreguntasFrecuentesCreacionComponent implements OnInit {

   panelOpenState = false;
  constructor(
    public messageService: MessageService
  ) {}

  ngOnInit(): void {
    window.scrollTo(200, 1);
  }
}




