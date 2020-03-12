import { Component, OnInit } from "@angular/core";
import { MessageService } from "../../../services/MessageService";
import { LoginService } from 'app/services/login.service';
import { AppConfig } from "../../../app.config";
import { Router } from "@angular/router";
import { IdentidadPersona } from "app/pages/ciudadano/model/identidad-persona.model";
import { IdentidadElectronicaService } from "app/services/identidad-electronica.service";
declare var $: any;

@Component({
  selector: "form-perfil-ciudadano",
  styleUrls: ['form-perfil-ciudadano.component.css'],
  providers: [LoginService, IdentidadElectronicaService],
  templateUrl: "form-perfil-ciudadano.component.html"
})
export class FormPerfilCiudadanoComponent implements OnInit {

  public token: string;
  public ciudadano: IdentidadPersona;
  public loading: boolean;
  public message: string;

  public departamentos: any[];
  public ciudades: any[];
  public barrios: any[] = [];
  public terminos: boolean;

  constructor(
    public messageService: MessageService,
    public config: AppConfig,
    private router: Router,
    public auth: LoginService,
    public identidadService: IdentidadElectronicaService,
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
    if(!this.ciudadano.idBarrio) {
      this.ciudadano.idBarrio = 0;
    }

    this.getDepartamentos();
    this.getCiudades(this.ciudadano.idDepartamento);
    this.getBarrios(this.ciudadano.idCiudad);
  }

  actualizarDatosPersona() {
    this.loading = true;
    if(this.validarDatos()) {
      this.identidadService.actualizarDatosPersona(this.token, this.ciudadano).subscribe(rsp => {
        let response: any = rsp;
        
        this.message = null;
        this.loading = false;

        if(response.status) {
          this.auth.setCurrentUser(this.ciudadano);
          this.router.navigate(['/perfil-ciudadano']);

        }else{
          this.message = response.message;
        }
      }, error => {
        this.loading = false;
        this.message = 'No se pudo procesar la operación. Favor intente nuevamente..';
      });

    } else {
      this.loading = false;
      this.message = '';
      this.openMessageDialog();
    }
  }

  validarDatos(): boolean {
    let valido = true;
    if(
          this.ciudadano.idDepartamento == null || this.ciudadano.idDepartamento <= 0 
       || this.ciudadano.idCiudad == null  || this.ciudadano.idCiudad <= 0
       || this.ciudadano.idBarrio == null  || this.ciudadano.idBarrio <= 0
       || this.ciudadano.domicilio == null || this.ciudadano.domicilio.length <= 0
       || this.ciudadano.telefonoParticular == null  || this.ciudadano.telefonoParticular.length <= 0
       || this.ciudadano.telefonoMovil == null  || this.ciudadano.telefonoMovil.length <= 0
       || !this.terminos
    ) {
      valido = false;
    }
    return valido;
  }

  getDepartamentos(): void {
    this.identidadService.getDepartamentos().subscribe(response => {
        this.departamentos = response;
      },
      error => {
        console.log("error", error);
      }
    );
  }

  changeDepartamento() {
    this.ciudades = [];
    this.barrios = [];
    this.ciudadano.idCiudad = 0;
    this.ciudadano.idBarrio = 0;
    
    if(this.ciudadano.idDepartamento > -1) {
      this.getCiudades(this.ciudadano.idDepartamento);
    }
  }

  changeCiudad(){
    if(this.ciudadano.idCiudad > 0) {
      this.getBarrios(this.ciudadano.idCiudad);
    }
  }

  getCiudades(idDepartamento: number): void {
    this.identidadService.getCiudades(idDepartamento).subscribe(response => {
        this.ciudades = response;
      },
      error => {
        console.log("error", error);
      }
    );
  }

  getBarrios(idCiudad: number): void {
    this.identidadService.getBarrios(idCiudad).subscribe(response => {
        this.barrios = response;
      },
      error => {
        console.log("error", error);
      }
    );
  }

  openMessageDialog() {
    setTimeout(function() { $("#modalRespuesta").modal("toggle"); }, 1000);
  }

  logout() {
    
    this.auth.logout();

    this.messageService.emitChangeCurrentUserService({
      currentUser: null,
      token: null,
      fotoPerfil: null
    });

    //this.router.navigate(['/login-ciudadano']);
    this.router.navigate(['/']);

  }
  
}
