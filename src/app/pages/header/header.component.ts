import { Component, OnInit, Inject, DoCheck } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { ScrollToService } from "ng2-scroll-to-el";
import { MessageService } from "app/services/MessageService";
import { LoginService } from 'app/pages/login/shared/login.service';
import { AppConfig } from "app/app.config";
import { DOCUMENT } from '@angular/common';
import { StorageManagerService } from 'app/pages/login/shared/storage-manager.service';
declare var $: any;

@Component({
  selector: "header-widget",
  templateUrl: "./header.html",
  providers: [LoginService],
  styleUrls: ["./header.component.css"]
})
export class HeaderComponent  implements DoCheck {

  public categoriaTramite: any;
  public lang: string = 'G';
  public ieUrl: string;
  public token: string;
  public currentUser: any;
  public uuid: string;
  public fotoPerfil: any;

  region: string;

  constructor(
    private route: ActivatedRoute,
    private scrollService: ScrollToService,
    public messageService: MessageService,
    private router: Router,
    private auth: LoginService,
    private config: AppConfig,
    @Inject(DOCUMENT) private document: any,
    private storageManagerService: StorageManagerService
  ) {  }

  ngDoCheck() {
    this.currentUser = this.storageManagerService.getLoginData();

    if(this.currentUser!==null){
      console.log(this.currentUser.usuario.regionSanitaria);
      if(this.currentUser.usuario.regionSanitaria ==1){
        this.region = 'Concepción';
      }
      if(this.currentUser.usuario.regionSanitaria ==2){
        this.region = 'San Pedro';
      }
      if(this.currentUser.usuario.regionSanitaria ==3){
        this.region = 'Cordillera';
      }
      if(this.currentUser.usuario.regionSanitaria ==4){
        this.region = 'Guairá';
      } if(this.currentUser.usuario.regionSanitaria ==5){
        this.region = 'Caaguazú';
      }
      if(this.currentUser.usuario.regionSanitaria ==6){
        this.region = 'Caazapá';
      }
      if(this.currentUser.usuario.regionSanitaria ==7){
        this.region = 'Itapúa';
      }
      if(this.currentUser.usuario.regionSanitaria ==8){
        this.region = 'Misiones';
      }
      if(this.currentUser.usuario.regionSanitaria ==9){
        this.region = 'Paraguarí';
      }
      if(this.currentUser.usuario.regionSanitaria ==10){
        this.region = 'Alto Paraná';
      }
      if(this.currentUser.usuario.regionSanitaria ==11){
        this.region = 'Central';
      }
      if(this.currentUser.usuario.regionSanitaria ==12){
        this.region = 'Ñeembucú';
      }
      if(this.currentUser.usuario.regionSanitaria ==13){
        this.region = 'Amambay';
      }
      if(this.currentUser.usuario.regionSanitaria ==14){
        this.region = 'Canindeyú';
      }
      if(this.currentUser.usuario.regionSanitaria ==15){
        this.region = 'Presidente Hayes';
      }
      if(this.currentUser.usuario.regionSanitaria ==16){
        this.region = 'Boquerón';
      }
      if(this.currentUser.usuario.regionSanitaria ==17){
        this.region = 'Alto Paraguay';
      }
      if(this.currentUser.usuario.regionSanitaria ==18){
        this.region = 'Capital';
      }
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

  logout(){
    this.currentUser = null;
    this.storageManagerService.deleteStorage();
    document.cookie = "Authorization=; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    this.router.navigate(['/']);
  }

  redirectExternUrl(url){
    this.router.navigate(["/"]).then(result=>{ window.location.href = url; });
  }

  redirect(datoActualizado){
    if(datoActualizado){
      this.router.navigate(['/perfil-ciudadano']);
    } else {
      this.router.navigate(['/form-perfil-ciudadano']);
    }
  }

  isLogin()
  {
    return window.location.hash=='#/';
  }

}
