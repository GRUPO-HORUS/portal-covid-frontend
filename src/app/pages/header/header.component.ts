import { Component, OnInit, Inject } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { ScrollToService } from "ng2-scroll-to-el";
import { MessageService } from "app/services/MessageService";
import { PoderesDelEstadoService } from "app/services/PoderesDelEstadoService";
import { LoginService } from 'app/services/login.service';
import { IdentidadPersona } from "../ciudadano/model/identidad-persona.model";
import { AppConfig } from "app/app.config";
import { DOCUMENT } from '@angular/common';
declare var $: any;

@Component({
  selector: "header-widget",
  templateUrl: "./header.html",
  providers: [LoginService],
  styleUrls: ["./header.component.css"]
})
export class HeaderComponent  implements OnInit{

  public categoriaTramite: any;
  public lang: string = 'G';
  public ieUrl: string;
  public token: string;
  public currentUser: any;
  public uuid: string;

  public fotoPerfil: any;
  public ciudadano: IdentidadPersona;

  constructor(
    private route: ActivatedRoute,
    private scrollService: ScrollToService,
    public messageService: MessageService,
    private poderesDelEstadoService: PoderesDelEstadoService,
    private router: Router,
    private auth: LoginService,
    private config: AppConfig,
    @Inject(DOCUMENT) private document: any
  ) {

    this.messageService.currentUserResult.subscribe(userSession => {
      this.currentUser = userSession.currentUser;
      this.token = userSession.token;
    });

  }

  ngOnInit() {
    this.verificarSession();
    this.getCategoriaTramite();

    this.ciudadano = this.auth.getCurrentUser();
    this.token = this.auth.getToken();
    if(this.ciudadano != null && this.token != null) {
      if(this.auth.getImgProf() ==  null) {
        this.getImageProfile();
      } else {
        this.fotoPerfil = this.auth.getImgProf();
      }
    }
  }

  verificarSession() {
    if(this.auth.getToken() != null && this.auth.getCurrentUser() != null) {
      this.token = this.auth.getToken();
      this.currentUser = this.auth.getCurrentUser();
    }
  }

  scrollToTop(event) {
    this.scrollService.scrollTo(event);
  }

  colapseMenu(){
    $('#menu-principal').removeClass('show');
  };

  searchDataCategoria(data) {
    this.router.navigate(["/categoria/", data.id_clasificador, 'resultado']);
  }

  searchData(data: any, topSite: any) {
    let busqueda = {};
    if (data != null) {
      busqueda = { data: data.nombre_clasificador, id: data.id_clasificador, origen: "categoria", visible: false };
    } else {
      busqueda = { data: null, id: null, origen: null, visible: true };
    }
    this.messageService.emitChangeDataSearch(busqueda);
  }

  getCategoriaTramite(): void {
    this.poderesDelEstadoService.getCategoriaTramite().subscribe(
      data => {
        this.categoriaTramite = data;
      },
      error => {
        console.log("error", error);
      }
    );
  }

  loginIdentidadElectronica(){
    this.verificarSession();

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

  logout(){
    this.auth.logout();
    this.token = null;
    this.currentUser = null;
    this.router.navigate(['/']);
  }

  redirectExternUrl(url){
    this.router.navigate(["/"]).then(result=>{ window.location.href = url; });
  }

  getConfig() {
    this.auth.getConfig().subscribe(response => {
      this.uuid = this.auth.guid();
      this.ieUrl = response['URL_IDENTIDAD_ELECTRONICA_LOGIN'] + '&state=' + this.uuid;
      this.auth.setState(this.uuid);
      //this.router.navigate(["/"]).then(result=>{ window.location.href = this.ieUrl; });
      this.document.location.href =  this.ieUrl;
    }, error => {
      console.log("error", error);
      this.auth.logout();
      this.token = null;
      this.currentUser = null;
    });
  }

  redirect(datoActualizado){
    if(datoActualizado){
      this.router.navigate(['/perfil-ciudadano']);
    } else {
      this.router.navigate(['/form-perfil-ciudadano']);
    }
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
