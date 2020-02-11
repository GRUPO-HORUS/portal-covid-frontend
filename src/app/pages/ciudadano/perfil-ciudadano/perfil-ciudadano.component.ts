import { Component, OnInit } from "@angular/core";
import { MessageService } from "../../../services/MessageService";
import { LoginService } from 'app/services/login.service';
import { AppConfig } from "../../../app.config";
import { IdentidadPersona } from "app/pages/ciudadano/model/identidad-persona.model";
import { IdentidadElectronicaService } from "../../../services/identidad-electronica.service";
import { fadeAnimation } from 'app/lib/animations';
import { Router } from "@angular/router";

@Component({
  selector: "perfil-ciudadano",
  styleUrls: ['perfil-ciudadano.component.css'],
  providers: [LoginService],
  animations: [fadeAnimation],
  templateUrl: "perfil-ciudadano.component.html"
})
export class PerfilCiudadanoComponent implements OnInit {

  public departamentos: any[];
  public ciudades: any[];
  public barrios: any[];

  public token: string;
  public ciudadano: IdentidadPersona;
  public loading: boolean = false;

  public tabBar: string = "CARPETA";

  public responseData: any = { status: false, message: ''};

  public isEditDepCiudadBarrio: boolean = false;
  public isEditDomicilio: boolean = false;
  public isEditTelefonoParticular: boolean = false;
  public isEditTelefonoMovil: boolean = false;

  constructor(
    public messageService: MessageService,
    public config: AppConfig,
    public auth: LoginService,
    private router: Router,
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
    
    /** se obtiene la descripcion de departamento, ciudad, barrio */
    this.getByIdBarrio(this.ciudadano.idBarrio);

    /** carga de combos */
    this.getDepartamentos();
    this.getCiudades(this.ciudadano.idDepartamento);
    this.getBarrios(this.ciudadano.idCiudad);
  }

  getByIdBarrio(idBarrio: number): void {
      this.identidadService.getByIdBarrio(idBarrio).subscribe(response => {
        if(response != null) {
          this.ciudadano.barrio = response[1];
          this.ciudadano.ciudad = response[3];
          this.ciudadano.departamento = response[5];
        } 
      },
      error => {
        console.log("error", error);
      }
    );
  }

  formatFechaNacimiento(fecha: string){
    let fechaFormat = new Date(Number(fecha)*1000);
    return fechaFormat;
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

  actualizarDatosIPersona(data: any) {
    this.loading = true;
    this.identidadService.actualizarDatosIPersona(this.token, data).subscribe(response => {
      this.responseData = response;
      if(response.status){
        this.auth.setCurrentUser(this.ciudadano);        
      }
      this.loading = false;
      this.formEditCancel();
    }, error => {
        console.log("error", error);
        this.loading = false;
        this.formEditCancel();
    });
  }

  actualizarDepCiudad() {
    let body = {
      'idDepartamento': this.ciudadano.idDepartamento,
      'idCiudad': this.ciudadano.idCiudad,
      'idBarrio': this.ciudadano.idBarrio,
      'cedula': this.ciudadano.cedula,
      'method': 'actualizarDepCiudad'
    };

    let departamento: any = this.departamentos.filter(entity => entity.idDepartamento == this.ciudadano.idDepartamento);
    let ciudad: any = this.ciudades.filter(entity => entity.idCiudad == this.ciudadano.idCiudad);    
    let barrio: any = this.barrios.filter(entity => entity.idBarrio == this.ciudadano.idBarrio);    

    if(departamento != null && ciudad != null && barrio != null && ciudad.length > 0 && departamento.length > 0 && barrio.length > 0) {
      this.ciudadano.departamento = departamento[0].descripcion;
      this.ciudadano.ciudad = ciudad[0].descripcion;
      this.ciudadano.barrio = barrio[0].descripcion;
      this.actualizarDatosIPersona(body);
    }
  }
  
  actualizarBarrio() {
    let body = {
      'barrio': this.ciudadano.barrio,
      'cedula': this.ciudadano.cedula,
      'method': 'actualizarBarrio'
    };
    this.actualizarDatosIPersona(body);
  }
  
  actualizarDomicilio() {
    let body = {
      'domicilio': this.ciudadano.domicilio,
      'cedula': this.ciudadano.cedula,
      'method': 'actualizarDomicilio'
    };
    this.actualizarDatosIPersona(body);
  }
  
  actualizarTelefonoParticular() {
    let body = {
      'telefonoParticular': this.ciudadano.telefonoParticular,
      'cedula': this.ciudadano.cedula,
      'method': 'actualizarTelefonoParticular'
    };
    this.actualizarDatosIPersona(body);
  }

  actualizarTelefonoMovil() {
    let body = {
      'telefonoMovil': this.ciudadano.telefonoMovil,
      'cedula': this.ciudadano.cedula,
      'method': 'actualizarTelefonoMovil'
    };
    this.actualizarDatosIPersona(body);
  }

  formEditCancel() {
    this.isEditDepCiudadBarrio = false;
    this.isEditDomicilio = false;
    this.isEditTelefonoParticular = false;
    this.isEditTelefonoMovil = false;
  }
  
}
