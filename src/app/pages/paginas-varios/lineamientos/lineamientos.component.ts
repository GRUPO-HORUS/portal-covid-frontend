import { Component, OnInit } from "@angular/core";
import { MessageService } from "app/services/MessageService";

@Component({
  selector: "lineamientos",
  templateUrl: "lineamientos.html"
})
export class LineamientosComponent implements OnInit {

  constructor(
    public messageService: MessageService
  ) {}

  ngOnInit(): void {
    window.scrollTo(200, 1);
  }
}
