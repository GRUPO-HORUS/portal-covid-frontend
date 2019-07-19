import { Component, OnInit } from "@angular/core";
import { MessageService } from "app/services/MessageService";

@Component({
  selector: "identidad-electronica-terminos",
  templateUrl: "ie-terminos.html"
})
export class IETerminosComponent implements OnInit {
  public iframeTraductor: string;

  constructor(
    public messageService: MessageService
  ) {}

  ngOnInit(): void {
    window.scrollTo(200, 1);
  }
}
