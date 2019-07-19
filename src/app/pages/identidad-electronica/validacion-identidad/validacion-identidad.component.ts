import { Component, OnInit } from "@angular/core";
import { MessageService } from "../../../services/MessageService";

@Component({
  selector: "validacion-identidad",
  templateUrl: "validacion-identidad.html"
})
export class ValidacionIdentidadComponent implements OnInit {

  constructor(
    public messageService: MessageService
  ) {}

  ngOnInit(): void {
  }
}
