import { Component, OnInit } from "@angular/core";
import { MessageService } from "../../../services/MessageService";
import { LoginService } from 'app/services/login.service';
import { AppConfig } from "../../../app.config";
import { Router } from "@angular/router";
import { IdentidadPersona } from "app/pages/ciudadano/model/identidad-persona.model";

@Component({
  selector: "marco-legal",
  styleUrls: ['marco-legal.component.css'],
  providers: [LoginService],
  templateUrl: "marco-legal.component.html"
})
export class MarcoLegalComponent implements OnInit {

  public token: string;
  public ciudadano: IdentidadPersona;

  constructor(
    public messageService: MessageService,
    public config: AppConfig,
    private router: Router,
    public auth: LoginService,
  ) {}

  ngOnInit() {
    // this.token = this.auth.getToken();
    // this.ciudadano = this.auth.getCurrentUser();
    // if(this.ciudadano == null || this.token == null) {
    //   this.router.navigate(['/login-ciudadano']);
    //   return;
    // }

  }
  
}
