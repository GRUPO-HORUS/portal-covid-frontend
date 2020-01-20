import { NgModule, Component, OnInit, Input, Output } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { ComprasPublicasService } from "./compras-publicas.service";

@Component({
  selector: "compras-publicas",
  templateUrl: "compras-publicas.html",
  styleUrls: ["compras-publicas.css"],
  providers: [ComprasPublicasService]
})
export class ComprasComponent implements OnInit {
  compras: any[];
  encuentra: boolean = false;

  uoc: number;
  tipouc: string;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _comprasService: ComprasPublicasService
  ) {}

  ngOnInit(): void {}

  @Input()
  set params(params: any) {
    if (typeof params !== "undefined" && params != null) {
      for (let x = 0; x < params.info.length; x++) {
        if (String(params.info[x].tipoDato.categoria).trim() === "plugin") {
          if (
            String(params.info[x].tipoDato.codigoTipoDato).trim() ===
            "plugin_cp_codigouc"
          ) {
            this.uoc = params.info[x].descripcionOeeInformacion;
          }
          if (
            String(params.info[x].tipoDato.codigoTipoDato).trim() ===
            "plugin_cp_tipouc"
          ) {
            this.tipouc = params.info[x].descripcionOeeInformacion;
          }
        }
      }
      this.getListCompras();
    }
  }

  getListCompras(): void {
    if (this.uoc == null || typeof this.uoc === "undefined") {
      return;
    }
    if (this.tipouc == null || typeof this.tipouc === "undefined") {
      return;
    }
    this._comprasService.getListCompras(this.tipouc, this.uoc).subscribe(
      data => {
        if (data != null && data.length > 0) {
          this.compras = data;
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
