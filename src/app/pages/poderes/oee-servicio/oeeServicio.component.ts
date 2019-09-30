import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { PoderesDelEstadoService } from "app/services/PoderesDelEstadoService";
import { DomSanitizer } from "@angular/platform-browser";
import { MessageService } from "app/services/MessageService";
import { ToastrService } from 'ngx-toastr';
import { EncuestaService } from "../../../services/encuesta.service";

@Component({
  selector: "oeeServicio",
  templateUrl: "oeeServicio.html",
  providers: [PoderesDelEstadoService, EncuestaService],
  styleUrls: ["./oeeServicio.component.css"]
})
export class OeeServicioComponent implements OnInit {
  
  urlOee: string = "";
  descOee: string = "";
  servicios: any = [];
  fechaActualizacion: any;
  
  idServicio: number = 0;  
  yaVoto1:boolean = false;
  yaVoto2:boolean = false;

  msgEstadisticaVotacion: string;

  infoServicio: any = { 
    nombreServicio: '',
    fechaCreacion: '',
    responsable: '',
    fechaModificacion:'',
    servicioEnLinea: false,
    servicioEnLineaUrl: '',
    tramiteAcceso: '',
    iframeSite: '',
    detalle:[
      {id: 1, icon: 'far fa-file-alt fa-lg fa-fw text-primary', titulo: '¿De qué se trata?', valor: null},
      {id: 2, icon: 'fa fa-bullseye fa-lg fa-fw text-primary', titulo: '¿A qué población va dirigido este trámite?', valor: null},
      {id: 3, icon: 'fa fa-home fa-lg fa-fw text-primary', titulo: '¿Quién lo ofrece?', valor: null},
      {id: 4, icon: '', titulo: '', valor: null},
      {id: 5, icon: 'fa fa-globe fa-lg fa-fw text-primary', titulo: '¿Qué otorga o entrega al finalizarlo?', valor: null},
      {id: 6, icon: 'fa fa-map-signs fa-lg fa-fw text-primary', titulo: '¿Dónde se realiza?', valor: null},
      {id: 7, icon: 'fas fa-business-time fa-lg fa-fw text-primary', titulo: '¿En qué días y horas puede realizar el trámite?', valor: null},
      {id: 8, icon: 'fas fa-money-bill-wave fa-lg fa-fw text-primary', titulo: '¿Cuánto cuesta el trámite?', valor: null},
      {id: 9, icon: 'fa fa-credit-card fa-lg fa-fw text-primary', titulo: '¿Cómo y donde pago el trámite?', valor: null},
      {id: 10, icon: 'far fa-clock fa-lg fa-fw text-primary', titulo: 'Tiempo de obtención', valor: null},
      {id: 11, icon: 'fa fa-wifi fa-lg fa-fw text-primary', titulo: '¿Cómo realizo el trámite?', valor: null},
      {id: 12, icon: 'fa fa-envelope fa-lg fa-fw text-primary', titulo: '¿A qué correo puedo consultar sobre este trámite?', valor: null},
      {id: 13, icon: 'fa fa-phone fa-lg fa-fw text-primary', titulo: '¿A qué teléfono puedo llamar?', valor: null},
      {id: 14, icon: 'fa fa-podcast fa-lg fa-fw text-primary', titulo: 'Cobertura', valor: null},
      {id: 15, icon: 'fa fa-tag fa-lg fa-fw text-primary', titulo: 'Tipo', valor: null},
      {id: 16, icon: 'fa fa-globe fa-lg fa-fw text-primary', titulo: '¿Qué se necesita para realizar el trámite?', valor: null},
    ]};

  constructor(
    private _route: ActivatedRoute,
    private poderesService: PoderesDelEstadoService,
    public messageService: MessageService,
    public sanitizer: DomSanitizer,
    private toastr: ToastrService,
    private encuestaService: EncuestaService
  ) {
  }

  ngOnInit(): void {
    this.viewScrollTop(600);
    
    this._route.params.subscribe(params => {
      this.idServicio = params["idServicio"];
      this.getInfoServicio(this.idServicio); 
      this.getVotacion(this.idServicio);
      this.urlOee = params["urlOee"];
      this.descOee = this.urlOee.replace(/-/g, " ").toUpperCase();
    });
  }

  calificar(idEncuesta: number, data: string) {
    this.encuestaService.votacionServicio(idEncuesta, this.idServicio, data).subscribe(response => {
      if(response.status) {

        this.getVotacion(this.idServicio);

        this.encuestaService.setVoto(idEncuesta, this.idServicio, data);
        this.toastr.success("Se ha realizado la votación con éxito. Gracias por votar", 'Respuesta');

        if(idEncuesta == 1) this.yaVoto1 = true;
        if(idEncuesta == 2) this.yaVoto2 = true;

      } else {
        this.toastr.error(response.message, 'Respuesta');
      }

     }, error => {
      console.log("error", error);
    });
  }

  getVotacion(idServicio: number): void {
    setTimeout(()=>{
      this.encuestaService.getVotacion(idServicio).subscribe(response => {
        if(response.total != null && response.porcentaje != null){
          let infoPersona = response.total + (response.total > 1 ? ' personas' : ' persona');
          let porcentajeVotacion = Math.floor(response.porcentaje);
          this.msgEstadisticaVotacion = '<i class="fa fa-info-circle icon" aria-hidden="true"></i> Al <b>'+porcentajeVotacion+'%</b> de un total de <b>'+infoPersona+'</b> le resultó interesante la información de este trámite.';
        }
      }, error => {
        this.msgEstadisticaVotacion = '';
          console.log("error", error);
        }
      );
    }, 1);
  }

  getInfoServicio(id: number): void {
    this.poderesService.getInfoServicio(id).subscribe(data => {
        if (data != null && data.length > 0) {
          let oeeData = '';
          for (let entry of data) {
            if (entry.nombreServicio != null) this.infoServicio.nombreServicio = entry.nombreServicio; 
            if (entry.fechaCreacion != null) this.infoServicio.fechaCreacion = entry.fechaCreacion; 
            if (entry.fechaModificacion != null) this.infoServicio.fechaModificacion = entry.fechaModificacion; 
            if (entry.responsable != null) this.infoServicio.responsable = entry.responsable; 
            if (entry.nombreEtiqueta === "online") this.infoServicio.servicioEnLinea = true;
            if (entry.descripcionServicio != null) this.infoServicio.detalle[0].valor = entry.descripcionServicio; 
            if(entry.idTipoDato == 1){
              this.infoServicio.servicioEnLineaUrl = this.htmlToPlaintext(entry.descripcionServicioInformacion);
                if(!this.infoServicio.servicioEnLineaUrl.startsWith('http')) {
                  this.infoServicio.servicioEnLineaUrl = 'http://'+this.infoServicio.servicioEnLineaUrl;
                }
            }
            if (entry.idTipoDato === 16) this.infoServicio.detalle[1].valor = entry.descripcionServicioInformacion;
            if (entry.idTipoDato === 11) this.infoServicio.detalle[2].valor = entry.descripcionServicioInformacion;
            if (entry.idTipoDato === 1) this.infoServicio.detalle[3].valor = this.htmlToPlaintext(entry.descripcionServicioInformacion);
            if (entry.idTipoDato === 13) this.infoServicio.detalle[4].valor = entry.descripcionServicioInformacion;
            if (entry.idTipoDato === 2) this.infoServicio.detalle[5].valor = entry.descripcionServicioInformacion;
            if (entry.idTipoDato === 20) this.infoServicio.detalle[6].valor = entry.descripcionServicioInformacion;
            if (entry.idTipoDato === 18) this.infoServicio.detalle[7].valor = entry.descripcionServicioInformacion;
            if (entry.idTipoDato === 19) this.infoServicio.detalle[8].valor = entry.descripcionServicioInformacion;
            if (entry.idTipoDato === 21) this.infoServicio.detalle[9].valor = entry.descripcionServicioInformacion;
            if (entry.idTipoDato === 14) this.infoServicio.detalle[10].valor = entry.descripcionServicioInformacion;
            if (entry.idTipoDato === 3) this.infoServicio.detalle[11].valor = entry.descripcionServicioInformacion;
            if (entry.idTipoDato === 5) this.infoServicio.detalle[12].valor = entry.descripcionServicioInformacion;
            if (entry.idTipoDato === 15) this.infoServicio.detalle[13].valor = entry.descripcionServicioInformacion;
            if (entry.idTipoDato === 12) this.infoServicio.detalle[14].valor = entry.descripcionServicioInformacion;
            if (entry.idTipoDato === 17) this.infoServicio.detalle[15].valor = entry.descripcionServicioInformacion;
            oeeData = entry.descripcionOee;
          }

          let lblQuienLoOfrece = oeeData;
          if(this.infoServicio.detalle[2].valor && this.infoServicio.detalle[2].valor != null){
            lblQuienLoOfrece+= " </br> "+ this.infoServicio.detalle[2].valor;
          }
          
          if(this.infoServicio.detalle[3].valor && this.infoServicio.detalle[3].valor != null){
            lblQuienLoOfrece+= " </br> <a href='"+this.infoServicio.detalle[3].valor+"' target='_blank'>"+this.infoServicio.detalle[3].valor+"</a>";
          }
          this.infoServicio.detalle[2].valor = lblQuienLoOfrece;

          if(this.encuestaService.getVoto(1, this.idServicio) != null) {
            this.yaVoto1 = true;
          }

          if( (this.encuestaService.getVoto(2, this.idServicio) != null && !this.infoServicio.servicioEnLinea) || this.infoServicio.servicioEnLinea) {
            this.yaVoto2 = true;
          }

        }
      },
      error => {
        console.log("error", error);
      }
    );
  }

  viewScrollTop(pos: number) {
    window.scrollTo(pos, 1);
  }

  formatFecha(fecha: string){
    if(fecha){
      let date = new Date(fecha);
      return date.toString();
    }else{
      return "";
    }
  }

  getViewIframe(url: string) {
    let htmlToText = url ? String(url).replace(/<[^>]+>/gm, "") : "";
    return this.sanitizer.bypassSecurityTrustResourceUrl(htmlToText);
  }

  htmlToPlaintext(text) {
    return text ? String(text).replace(/<[^>]+>/gm, '') : '';
  }

  /*getInfoOee(urlOee: string): void {
    this.poderesService.getInfoOee(urlOee).subscribe(
      data => {
        if (data != null && data.length > 0) {
          this.infos = data;
          this.idOee = this.infos[0].oee.idOee;
        }
        // se listan los servicios
       // this.getListOeeServicios(this.idOee);
      },
      error => {
        console.log("error", error);
      }
    );
  }*/

  /*
  getListOeeServicios(id: number): void {
    this.poderesService.getListOeeServicios(id).subscribe(
      data => {
        if (data != null && data.length > 0) {
          this.servicios = data;
          this.resultsServicios = { message: "", status: true };
        } else {
          this.resultsServicios = {
            message: "No se encontraron resultados",
            status: false
          };
        }
      },
      error => {
        console.log("error", error);
      }
    );
  }*/

}
