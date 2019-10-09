import {
  Component,
  OnInit,
} from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { PoderesDelEstadoService } from "app/services/PoderesDelEstadoService";
import { DomSanitizer } from "@angular/platform-browser";
import { MessageService } from "app/services/MessageService";
import { LoginService } from "app/services/login.service";

@Component({
  selector: "oee",
  templateUrl: "oee.html",
  providers: [PoderesDelEstadoService, LoginService]
})
export class OeeComponent implements OnInit {
  
  public urlPoder: string = "";
  public urlEntidad: string = "";
  public urlOee: string = "";

  public idOee: number = 0;
  public titulo: string = "";

  public fechaActualizacion: any;
  public urlTransparenciaActiva: any;
  public responsableOee: any;
  public urlSitioWeb: any;

  public contTramitesOnline: number = 0;
  public contTotalTramites: number = 0;

  public infos: any = [];
  public oees: any = [];

  public comentarios: any = [];
  public servicios: any = [];
  public serviciosFilter: any = [];
  public cursorServiciosOnline: boolean = false;

  public resultsServicios: any = { message: "", status: true };
  public nroTramitesServicios: number = 1;
  public keyTramitesServicios: string = "descripcion";
  public reverseTramitesServicios: boolean = false;
  public buscarServicios: any;

  public comentario: string = "";
  public token: string;
  public currentUser: any;

  constructor(
    private _route: ActivatedRoute,
    private poderesService: PoderesDelEstadoService,
    public messageService: MessageService,
    public sanitizer: DomSanitizer,
    private auth: LoginService,
  ) {
  }

  ngOnInit(): void {
    this.viewScrollTop(600);
    
    this.token = this.auth.getToken();
    this.currentUser = this.auth.getCurrentUser();

    this._route.params.subscribe(params => {
      this.urlPoder = params["urlPoder"];
      this.urlEntidad = params["urlEntidad"];
      this.urlOee = params["urlOee"];

      if(this.urlEntidad  && !this.urlOee) {
        // this.titulo = this.urlEntidad.replace(/-/g, " ");
        // this.titulo = this.titulo.charAt(0).toUpperCase() + this.titulo.substr(1).toLowerCase();
        this.getListOee(this.urlEntidad);
        
      } else if(this.urlOee) {
        this.getInfoOee(this.urlOee);
      }
    });
  }

  viewScrollTop(pos: number) {
    window.scrollTo(pos, 1);
  }

  guardarComentario(){
    if(this.currentUser != null){
      let content = {
        comentario: this.comentario,
        cedula: this.currentUser.cedula,      
        nombreUsuario: this.currentUser.nombres+' '+this.currentUser.apellidos
      };
      this.poderesService.createComentario(this.idOee, content).subscribe(response => {
        this.comentario = "";
        this.getComentario(this.idOee);
      }, error => {
        console.log("error", error);
      });
    }
  }

  getComentario(idOee: number) {
    this.poderesService.getComentarios(idOee).subscribe(response => {
      this.comentarios = response;
    }, error => {
      console.log("error", error);
    });
  }

  getListOee(urlEntidad: string): void {
    this.poderesService.getListOee(urlEntidad).subscribe(data => {
      if (data != null && data.length > 0) {
        this.oees = data;
        this.titulo = data[0].entidad.descripcionEntidad;
        if (this.oees.length === 1) {
          this.urlOee = data[0].urlOee;
          this.getInfoOee(this.urlOee);
        }
      }
    }, error => {
      console.log("error", error);
    });
  }

  getInfoOee(urlOee: string): void {
    this.poderesService.getInfoOee(urlOee).subscribe(response => {
        if (response != null && response.length > 0) {
          
          if(this.urlOee) {
            this.titulo = response[0].oee.descripcionOee;
          }

          for (let x = 0; x < response.length; x++) {
            if (response[x].tipoDato.idTipoDato == 27) {
              this.urlTransparenciaActiva = response[x].descripcionOeeInformacion;
            }
            if (response[x].tipoDato.idTipoDato == 28) {
              this.responsableOee = response[x].descripcionOeeInformacion;
            }
            if (response[x].tipoDato.idTipoDato == 1) {
              this.urlSitioWeb = "<a href='"+this.htmlToPlaintext(response[x].descripcionOeeInformacion)+"' target='_blank'>"+response[x].descripcionOeeInformacion+"</a>";
            }
          }

          this.infos = response;
          this.idOee = this.infos[0].oee.idOee;
          this.fechaActualizacion = this.infos[0].oee.fechaModificacion;

          this.getListOeeServicios(this.idOee);
          this.getComentario(this.idOee);
        }
      },
      error => {
        console.log("error", error);
      }
    );
  }

  htmlToPlaintext(text) {
    return text ? String(text).replace(/<[^>]+>/gm, '') : '';
  }

  sortTramitesServicios(keyTramitesServicios) {
    this.keyTramitesServicios = keyTramitesServicios;
    this.reverseTramitesServicios = !this.reverseTramitesServicios;
  }

  getServicios(categoria) {
    let serviciosData = [];
    for(let x = 0; x < this.servicios.length;x++) {
      if(categoria == 'online' && Number(this.servicios[x].esOnline) == 1) {
        this.cursorServiciosOnline = true;
        serviciosData.push(this.servicios[x]);
      } else if(categoria == 'difOnline') {
        this.cursorServiciosOnline = false;
        serviciosData.push(this.servicios[x]);
      }
    }
    this.serviciosFilter = serviciosData;    
  }

  getListOeeServicios(id: number): void {
    this.poderesService.getListOeeServicios(id).subscribe(response => {
        this.contTramitesOnline = 0;
        this.contTotalTramites = 0;

        if (response != null && response.length > 0) {
          this.servicios = response;        
          this.serviciosFilter = response;  

          this.contTotalTramites = response.length;
          if(this.servicios.length > 0 && this.servicios[0].cantOnline){
            this.contTramitesOnline = this.servicios[0].cantOnline;
          }

          this.resultsServicios = { message: "", status: true };
        } else {
          this.resultsServicios = { message: "No se encontraron servicios disponibles", status: false };
        }
      },
      error => {
        console.log("error", error);
      }
    );
  }

  getEncuestaCiudadana() {
    let urlLocation = location.href;
    window.location.href = 'https://tutramiteenlinea.mitic.gov.py/inicio/?portal=' + urlLocation;
  }

  formatFecha(fecha: string){
    if(fecha){
      let date = new Date(fecha);
      return date.toString();
    }else{
      return "";
    }
  }

}
