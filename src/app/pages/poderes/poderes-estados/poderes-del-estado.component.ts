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
  public entidades: any = 0;

  public menuEstado = [
    'poder-ejecutivo',
    'poder-legislativo',
    'poder-judicial',
    'otros-organismos-del-estado',
    'universidades-nacionales',
    'contraloria-general-de-la-republica',
    'entidades-binacionales'
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

  getListEntidad(): void {
    if (this.urlPoder != null && this.menuEstado.indexOf(this.urlPoder) !== -1) {

      this.titulo = this.urlPoder.replace(/-/g, " ");

      this.poderesDelEstadoService.getListEntidad(this.urlPoder).subscribe(data => {
        
        this.entidades = data;

      }, error => {
        console.log("error", error);
      });

    } else {
      this.titulo = "El Estado";
    }
  }
}
