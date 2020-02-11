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

  public carpeta: string = "hola";
  public fotoPerfil: any;
  public ciudadano: IdentidadPersona;
  public token: any;

  constructor(
    public messageService: MessageService,
    private router: Router,
    public auth: LoginService
  ) {
    
    this.ciudadano = this.auth.getCurrentUser();

    this.token = this.auth.getToken();

    this.scrollTop();

    if(this.ciudadano != null && this.token != null) {

      if(this.auth.getImgProf() ==  null) {

        this.getImageProfile();

      } else {

        this.fotoPerfil = this.auth.getImgProf();
        
      }

    }
    
  }

  scrollTop() {
    let top = document.getElementById('topcab');
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }
  }

  logout(){
    this.auth.logout();
    this.token = null;
    this.router.navigate(['/']);
  }

  getImageProfile(): void {
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
