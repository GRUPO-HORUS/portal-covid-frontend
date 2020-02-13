import { NgModule, Component, OnInit, Input } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { BolsaTrabajoService } from "./bolsa-trabajo.service";

@Component({
  selector: "bolsa-trabajo",
  templateUrl: "bolsa-trabajo.html",
  styleUrls: ["bolsa-trabajo.css"],
  providers: [BolsaTrabajoService]
})
export class BolsaTrabajoComponent implements OnInit {
  bolsaTrabajo: any[];
  encuentra: boolean = false;
  codigo: number;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _bolsaService: BolsaTrabajoService
  ) {}

  ngOnInit(): void {
    this.getListBolsa();
  }

  @Input()
  set params(params: any) {
    if (typeof params !== "undefined" && params != null) {
      for (let x = 0; x < params.info.length; x++) {
        if (String(params.info[x].tipoDato.categoria).trim() === "plugin") {
          if (
            String(params.info[x].tipoDato.codigoTipoDato).trim() ===
            "plugin_bolsa_codigooee"
          ) {
            this.codigo = params.info[x].descripcionOeeInformacion;
          }
        }
      }
      this.getListBolsa();
    }
  }

  getListBolsa(): void {
    if (this.codigo == null || typeof this.codigo === "undefined") {
      return;
    }
    this._bolsaService.getListBolsa(this.codigo).subscribe(
      data => {
        if (data != null && data.length > 0) {
          this.bolsaTrabajo = data;
          this.encuentra = true;
        }
      },
      error => {
        console.log("error", error);
        this.encuentra = false;
      }
    );
  }
}
