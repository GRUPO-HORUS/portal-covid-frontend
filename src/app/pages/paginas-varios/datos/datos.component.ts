import { Component, OnInit } from "@angular/core";
import { MessageService } from "app/services/MessageService";

@Component({
  selector: "datos",
  templateUrl: "datos.html"
})
export class DatosComponent implements OnInit {

  constructor(
    public messageService: MessageService
  ) {}

  ngOnInit(): void {
    window.scrollTo(200, 1);
  }
}
