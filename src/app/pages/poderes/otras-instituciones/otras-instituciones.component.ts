import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { PoderesDelEstadoService } from "app/services/PoderesDelEstadoService";
import { MessageService } from "app/services/MessageService";

@Component({
  selector: "otras",
  templateUrl: "otras-instituciones.html",
  providers: [PoderesDelEstadoService]
})
export class OtrasComponent implements OnInit {
  
  encuentra: boolean = false;
  entidades: any = 0;
  descNivel: string = "";

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private poderesDelEstadoService: PoderesDelEstadoService,
    public messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.viewScrollTop(600);
    this._route.params.subscribe(params => {
      this.getListEntidad(params["urlNivel"]);
    });
  }

  viewScrollTop(pos: number) {
    window.scrollTo(pos, 1);
  }

  getListEntidad(urlNivel: string): void {
    this.descNivel = urlNivel.replace(/-/g, " ").toUpperCase();
    this.poderesDelEstadoService.getListEntidad(urlNivel).subscribe(
      data => {
        if (data != null && data.length > 0) {
          this.entidades = data;
          this.encuentra = true;
        }
      },
      error => {
        console.log("error", error);
      }
    );
  }
}
