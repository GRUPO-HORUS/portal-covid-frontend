import { Component, OnInit } from "@angular/core";
import { MessageService } from "app/services/MessageService";

@Component({
  selector: "identidad-electronica",
  templateUrl: "identidad-electronica.html"
})
export class IdentidadElectronicaComponent implements OnInit {

  constructor(
    public messageService: MessageService
  ) {}

  ngOnInit(): void {
    window.scrollTo(200, 1);

  }
}
