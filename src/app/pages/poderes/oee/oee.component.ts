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
  
  urlPoder: string = "";
  urlEntidad: string = "";
  urlOee: string = "";
  /*********************** */

  idOee: number = 0;
  descOee: string = "";
  infos: any = [];
  fechaActualizacion: any;
  urlTransparenciaActiva: any;
  responsableOee: any;
  urlSitioWeb: any;

  contTramitesOnline: number = 0;
  contTotalTramites: number = 0;

  comentarios: any = [];
  servicios: any = [];
  serviciosFilter: any = [];
  cursorServiciosOnline: boolean = false;

  // linkOeeMap: any;
  // paramsComprasPublicas: any;
  // paramsBolsaTrabajo: any;

  resultsServicios: any = { message: "", status: true };
  nroTramitesServicios: number = 1;
  keyTramitesServicios: string = "descripcion";
  reverseTramitesServicios: boolean = false;
  buscarServicios: any;

  public comentario: string = "";
  public token: string;
  public currentUser: any;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
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

      console.log('oee.component.ts: ', this.urlPoder, this.urlEntidad, this.urlOee);

      this.descOee = this.urlOee.replace(/-/g, " ").toUpperCase();
      this.getInfoOee(this.urlOee);
    });
  }

  viewScrollTop(pos: number) {
    window.scrollTo(pos, 1);
  }

  guardarComentario(){
    console.log("currentUser: ",this.currentUser, "comentario: "+this.comentario);
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

  getInfoOee(urlOee: string): void {
    this.poderesService.getInfoOee(urlOee).subscribe(response => {
        if (response != null && response.length > 0) {

          this.descOee = response[0].oee.descripcionOee;

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

  // getListCompras() {
  //   this.paramsComprasPublicas = { info: this.infos };
  // }

  // getListBolsa(): void {
  //   this.paramsBolsaTrabajo = { info: this.infos };
  // }

  formatFecha(fecha: string){
    if(fecha){
      let date = new Date(fecha);
      return date.toString();
    }else{
      return "";
    }
  }

}
