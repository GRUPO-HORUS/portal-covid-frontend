import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { PoderesDelEstadoService } from "app/services/PoderesDelEstadoService";
import { DomSanitizer } from "@angular/platform-browser";
import { MessageService } from "app/services/MessageService";

@Component({
  selector: "entidad",
  templateUrl: "oeeEntidad.html",
  providers: [PoderesDelEstadoService]
})
export class OeeEntidadComponent implements OnInit {

  paramsComprasPublicas: any;
  paramsBolsaTrabajo: any;
  urlPoder: string;
  descPoder: string;
  urlEntidad: string;
  descEntidadTitulo: string = "";
  descEntidad: string = "";
  urlOee: string = "";
  oees: any = [];
  infos: any = [];

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private poderesService: PoderesDelEstadoService,
    public messageService: MessageService,
    private domSanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.viewScrollTop(600);
    this._route.params.subscribe(params => {
      this.urlPoder = params["urlPoder"];
      this.urlEntidad = params["urlEntidad"];

      console.log('oeeEntidad.component.ts: ', this.urlPoder, this.urlEntidad);

      this.descPoder = this.urlPoder.replace(/-/g, " ");
      this.descEntidadTitulo = this.urlEntidad.replace(/-/g, " ");
      this.getListOee(this.urlEntidad);
    });
  }

  viewScrollTop(pos: number) {
    window.scrollTo(pos, 1);
  }

  formatFecha(fecha: string){
    let fechaFormat = new Date(Number(fecha)*1000);
    return fechaFormat;
  }

  getUrl(url) {
    let urlFinal: string = url;
    if (!String(url).startsWith("http")) {
      urlFinal = "http://" + url;
    }
    return this.domSanitizer.bypassSecurityTrustResourceUrl(urlFinal);
  }

  getListOee(urlEntidad: string): void {
    this.poderesService.getListOee(urlEntidad).subscribe(data => {
      console.log('data', data);
      if (data != null && data.length > 0) {
        this.oees = data;
        this.descEntidad = data[0].descripcionOee;
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
    this.poderesService.getInfoOee(urlOee).subscribe(
      data => {
        if (data != null && data.length > 0) {
          this.infos = data;
        }
      },
      error => {
        console.log("error", error);
      }
    );
  }

  getListCompras() {
    this.paramsComprasPublicas = { info: this.infos };
  }

  getListBolsa(): void {
    this.paramsBolsaTrabajo = { info: this.infos };
  }
}
