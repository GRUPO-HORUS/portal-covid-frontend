import { Component, OnInit } from "@angular/core";
import { MessageService } from "../../../services/MessageService";

@Component({
  selector: "creacion-cuenta",
  templateUrl: "creacion-cuenta.html"
})
export class CreacionCuentaComponent implements OnInit {

  constructor(
    public messageService: MessageService
  ) {}

  ngOnInit() {
    this.viewScrollTop();
  }

  viewScrollTop() {
    window.scrollTo(600, 1);
  }
}
