import { Component, OnInit } from "@angular/core";
import { MessageService } from "../../../services/MessageService";
import { LoginService } from 'app/services/login.service';
import { AppConfig } from "../../../app.config";
import { Router } from "@angular/router";
import { IdentidadPersona } from "app/pages/ciudadano/model/identidad-persona.model";

@Component({
  selector: "otros-tramites-en-linea",
  styleUrls: ['otros-tramites-en-linea.component.css'],
  providers: [LoginService],
  templateUrl: "otros-tramites-en-linea.component.html"
})
export class OtrosTramitesEnLineaComponent implements OnInit {

  public token: string;
  public ciudadano: IdentidadPersona;

  constructor(
    public messageService: MessageService,
    public config: AppConfig,
    private router: Router,
    public auth: LoginService,
  ) {}

  ngOnInit() {
    this.token = this.auth.getToken();
    this.ciudadano = this.auth.getCurrentUser();
    if(this.ciudadano == null || this.token == null) {
      this.router.navigate(['/login-ciudadano']);
      return;
    }

    if(!this.ciudadano.idDepartamento) {
      this.ciudadano.idDepartamento = 0;
    }
    if(!this.ciudadano.idCiudad) {
      this.ciudadano.idCiudad = 0;
    }
  }

}
