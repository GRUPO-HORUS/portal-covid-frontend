import { Component } from "@angular/core";
import { MessageService } from "../../../services/MessageService";
import { Router } from "@angular/router";
import { LoginService } from "../../../services/login.service";

@Component({
  selector: "menu-ciudadano",
  styleUrls: ['menu-ciudadano.component.css'],
  templateUrl: "menu-ciudadano.component.html"
})
export class MenuCiudadanoComponent {

  constructor(
    public messageService: MessageService,
    private router: Router,
    public auth: LoginService
  ) { }

  logout(){
    this.auth.logout();
    this.router.navigate(['/login-ciudadano']);
  }

}
