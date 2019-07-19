import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { PoderesDelEstadoService } from "app/services/PoderesDelEstadoService";
import { DomSanitizer } from "@angular/platform-browser";
import { AppConfig } from "app/app.config";
import { MessageService } from "app/services/MessageService";

@Component({
  selector: "poderes-del-estado",
  templateUrl: "poderes-del-estado.html",
  providers: [PoderesDelEstadoService]
})
export class PoderesDelEstadoComponent implements OnInit {
  ruta: string = "";
  titulo: string = "";
  urlEntidad: string;
  noticias: any = [];
  encuentra: boolean = false;
  entidades: any = 0;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private config: AppConfig,
    public messageService: MessageService,
    private poderesDelEstadoService: PoderesDelEstadoService,
    public sanitizer: DomSanitizer
  ) {}

  ngOnInit() { 
    this.getListEntidad(this._router.url);
  }

  getListEntidad(ruta: string): void {
    if (String(this._router.url).endsWith("ejecutivo")) {
      this.urlEntidad = "poder-ejecutivo";
    } else if (String(this._router.url).endsWith("legislativo")) {
      this.urlEntidad = "poder-legislativo";
    } else if (String(this._router.url).endsWith("judicial")) {
      this.urlEntidad = "poder-judicial";
    }

    if (this.urlEntidad != null && this.urlEntidad !== "") {
      this.titulo = this.urlEntidad.replace("-", " ");
      this.poderesDelEstadoService.getListEntidad(this.urlEntidad).subscribe(
        data => {
          this.entidades = data;
          this.encuentra = true;
        },
        error => {
          console.log("error", error);
        }
      );
    } else {
      this.titulo = "El Estado";
    }
  }
}
