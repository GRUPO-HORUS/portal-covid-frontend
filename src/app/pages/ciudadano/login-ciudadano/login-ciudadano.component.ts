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
  public loading: boolean = false;

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

            this.loading = true;

            this.auth.setToken(params['code']);
          
            this.auth.verifyAuthentication().subscribe(rsp => {

              let response: any = rsp;

              if (response.error != undefined && !response.error) {

                this.auth.setCurrentUser(response.ipersona);

                this.auth.setToken(response.token);

                this.redirect(response.ipersona.datosActualizado);

              } else {

                this.loading = false;

                this.auth.logout();

                this.messageService.emitChangeCurrentUserService({ currentUser: null, token: null, fotoPerfil: null });

              }

            }, error => {
              console.log("error", error);
              
              this.loading = false;

              this.auth.logout();

              this.messageService.emitChangeCurrentUserService({ currentUser: null, token: null, fotoPerfil: null });

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
    
      this.messageService.emitChangeCurrentUserService({ currentUser: null, token: null, fotoPerfil: null });
    
    });

  }

  getImageProfile() {
    let promise = new Promise((resolve, reject) => {
      this.auth.getImageProfile(this.auth.getToken()).subscribe(response => {
        if(response.status) {
          this.auth.setImgProf(response.data.fotoPerfil);   
          resolve(true);
        } else {
          resolve(false);
        }
      }, error => {
        console.log("error", error);
        resolve(false);
      });
    });
    return promise;
  }

  redirect(datoActualizado: boolean) {
    this.loading = true;
    if(datoActualizado) {

      if(this.auth.getImgProf() ==  null) {
        this.getImageProfile().then((resp) => {
          this.emitUserSession();
          this.loading = false;
        });

      } else {
        this.emitUserSession();
        this.loading = false;
      }

    } else {
      this.loading = false;
      this.router.navigate(['/form-perfil-ciudadano']);
    }
  }

  emitUserSession() {
    this.messageService.emitChangeCurrentUserService({
      currentUser: this.auth.getCurrentUser(),
      token: this.auth.getToken(),
      fotoPerfil: this.auth.getImgProf()
    });
    this.router.navigate(['/carpeta-ciudadana']);
  }

}
