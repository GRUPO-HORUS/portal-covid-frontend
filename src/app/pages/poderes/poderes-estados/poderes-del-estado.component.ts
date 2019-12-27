import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { PoderesDelEstadoService } from "app/services/PoderesDelEstadoService";
import { DomSanitizer } from "@angular/platform-browser";
import { MessageService } from "app/services/MessageService";

@Component({
  selector: "poderes-del-estado",
  templateUrl: "poderes-del-estado.html",
  providers: [PoderesDelEstadoService]
})
export class PoderesDelEstadoComponent implements OnInit {
  
  public titulo: string = "";
  public urlPoder: string;
  public entidades: any[] = [];

  public menuEstado = [
    'poder-ejecutivo',
    'poder-legislativo',
    'poder-judicial',
    'universidades-nacionales',
    'cgr',
    'otros',
    'binacionales',
    'municipalidades',
    'banca-central',
    'autonomos-autarquicos',
    'seguridad-social',
    'empresas-publicas',
    'financieras',
    'sa'
  ];

  constructor(
    private _route: ActivatedRoute,
    public messageService: MessageService,
    private poderesDelEstadoService: PoderesDelEstadoService,
    public sanitizer: DomSanitizer
  ) {
  }

  ngOnInit() { 
    this._route.params.subscribe(params => {
      this.urlPoder = params.urlPoder;
      this.getListEntidad();
    });
  }

  scrollTop(event) {
    window.scrollTo(400, 1);
  }

  getListEntidad(): void {
    if (this.urlPoder != null && this.menuEstado.indexOf(this.urlPoder) !== -1) {
      this.titulo = this.urlPoder.replace(/-/g, " ");

      this.poderesDelEstadoService.getListEntidad(this.urlPoder).subscribe(data => {
        this.entidades = [];
        if(data && data.length > 0) {
          this.titulo = data[0].nivel;
          this.entidades = data;
        }
      }, error => {
        console.log("error", error);
      });

    } else {
      this.titulo = "El Estado";
    }
  }
}
