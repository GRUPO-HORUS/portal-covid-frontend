import { Component, Output } from "@angular/core";
import { LoginService } from "./services/login.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  providers: [LoginService],
  styleUrls: ["./app.component.css"]
})
export class AppComponent {

  constructor(
    private auth: LoginService,
  ) {
  }

}
