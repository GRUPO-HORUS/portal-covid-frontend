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
  
  titulo: string = "";
  urlPoder: string;
  entidades: any = 0;

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
    let poderes = ['poder-ejecutivo','poder-legislativo','poder-judicial'];
    if (this.urlPoder != null && poderes.indexOf(this.urlPoder) !== -1) {

      this.titulo = this.urlPoder.replace("-", " ");

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
