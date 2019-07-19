import { Component, OnInit, Input, Inject } from "@angular/core";
import { MessageService } from "../../../services/MessageService";
import { AppConfig } from "app/app.config";
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from 'app/services/login.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: "login-ciudadano",
  styleUrls: ['login-ciudadano.component.css'],
  providers: [LoginService],
  templateUrl: "login-ciudadano.component.html"
})
export class LoginCiudadanoComponent implements OnInit {
  
  public ieUrl: string;
  public token: string;
  public currentUser: any;
  public uuid: string;

  constructor(
    public messageService: MessageService,
    public config: AppConfig,
    private router: Router,
    private route: ActivatedRoute,
    private auth: LoginService,
    @Inject(DOCUMENT) private document: any
  ) { }

  ngOnInit() {
    this.token = this.auth.getToken();
    this.currentUser = this.auth.getCurrentUser();

    if (!this.currentUser || this.token == null) {

      this.route.queryParams.subscribe(params => {
        if (params['code'] && this.auth.getState() == params['state']) {
            this.auth.setToken(params['code']);
            this.auth.verifyAuthentication().subscribe(rsp => {
              let response: any = rsp;
              if (response.error) {
                this.auth.logout();
                              
              } else {
                this.auth.setCurrentUser(response.ipersona);
                this.auth.setToken(response.token);
                this.redirect(response.ipersona.datosActualizado);
              }
            }, error => {
              console.log("error", error);
              this.auth.logout();
            });
            
        } else {
          this.getConfig();
        }
      });

    } else {
      this.redirect(this.currentUser.datosActualizado);        
    }
  }

  getConfig() {
    this.auth.getConfig().subscribe(response => {
      
      this.uuid = this.auth.guid();
      
      this.ieUrl = response['URL_IDENTIDAD_ELECTRONICA_LOGIN'] + '&state=' + this.uuid;
      
      this.auth.setState(this.uuid);

      this.document.location.href =  this.ieUrl;

    }, error => {
      console.log("error", error);
      this.auth.logout();
    });
  }

  redirect(datoActualizado: boolean) {
    if(datoActualizado){
      this.router.navigate(['/perfil-ciudadano']);
    } else {
      this.router.navigate(['/form-perfil-ciudadano']);
    }
  }

}
