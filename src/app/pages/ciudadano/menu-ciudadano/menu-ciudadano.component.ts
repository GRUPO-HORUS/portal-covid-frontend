import { Component } from "@angular/core";
import { MessageService } from "../../../services/MessageService";
import { Router } from "@angular/router";
import { LoginService } from "../../../services/login.service";
import { IdentidadPersona } from "../model/identidad-persona.model";

@Component({
  selector: "menu-ciudadano",
  styleUrls: ['menu-ciudadano.component.css'],
  templateUrl: "menu-ciudadano.component.html"
})
export class MenuCiudadanoComponent {

  public fotoPerfil: any;
  public ciudadano: IdentidadPersona;
  public token: any;

  constructor(
    public messageService: MessageService,
    private router: Router,
    public auth: LoginService
  ) {
    if(this.auth.getImgProf() ==  null) {
      this.getImageProfile();
    } else {
      this.fotoPerfil = this.auth.getImgProf();
    }
  }

  logout(){
    this.auth.logout();
    this.router.navigate(['/login-ciudadano']); 
  }

  getImageProfile(): void {
    this.token = this.auth.getToken();
    this.auth.getImageProfile(this.token).subscribe(response => {
      if(response.status) {
        this.fotoPerfil = response.data.fotoPerfil;
        this.auth.setImgProf(this.fotoPerfil);
      }
    },
    error => {
      console.log("error", error);
    });
  }

}
