import { Component } from "@angular/core";
import { AppConfig } from "app/app.config";

@Component({
  selector: "sitios-interes",
  templateUrl: "./sitios-interes.html"
})
export class SitiosInteresComponent {
  constructor(
    private config: AppConfig,
  ) {}

  getRssNoticias() {
    return this.config.URL_RSS_IPPARAGUAY;
  }

}
