import { Component, OnInit } from "@angular/core";
import { MessageService } from "../../../services/MessageService";

@Component({
  selector: "paso-final-creacion-clave",
  templateUrl: "paso-final-creacion-clave.html"
})
export class PasoFinalCreacionClaveComponent implements OnInit {

  constructor(
    public messageService: MessageService
  ) {}

  ngOnInit(): void {
  }
}
