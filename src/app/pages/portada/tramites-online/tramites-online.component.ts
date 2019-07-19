import { Component, OnInit } from "@angular/core";
import { MessageService } from "app/services/MessageService";

@Component({
  selector: "tramites-online",
  templateUrl: "tramites-online.html"
})
export class TramitesOnlineComponent implements OnInit {

  constructor(
    public messageService: MessageService,
  ) {}

  ngOnInit() {
   
  }

}
