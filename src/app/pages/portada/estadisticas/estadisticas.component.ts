import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { PoderesDelEstadoService } from "app/services/PoderesDelEstadoService";
import { MessageService } from "app/services/MessageService";

@Component({
  selector: "estadisticas",
  templateUrl: "./estadisticas.html"
})
export class EstadisticasComponent {
  categoriaTramite: any;
  categoriaPersonasConIE: any;
  
  tramitesEnLinea: any;
  totalTramiteOnline: number;
  ultimosTramitesEnLinea: any;

  resultados: any = [];
  cantidadOee: number = 0;
  cantidadTramites: number = 0;
  cantidadEstadistica: number = 7;
  cantidadTramitesIE: number = 0;
  idClasificadorIE: number = 1;

  constructor(
    private router: Router,
    private messageService: MessageService,
    private poderesDelEstadoService: PoderesDelEstadoService
  ) {
    this.getCantidadOee();
    this.getCantidadTramites();
    this.getCantidadTramitesEnLinea();
    this.getCantidadTramitesConIE();
    this.getCantidadIE();
  }

  getCantidadOee(): void {
    this.poderesDelEstadoService.getCantidadOee().subscribe(data => {
        if (data != null && data.length > 0) {
          this.cantidadOee = Number(data);
        }
      },
      error => {
        console.log("error", error);
      }
    );
  }

  getCantidadTramites(): void {
    this.poderesDelEstadoService.getCantidadTramites().subscribe(data => {
        this.cantidadTramites = Number(data);
      },
      error => {
        console.log("error", error);
        this.cantidadTramites = 0;
      }
    );
  }

  getCantidadTramitesConIE() {
    this.messageService.getSearchServiciosClasificador(this.idClasificadorIE).subscribe(data => {
        this.cantidadTramitesIE = data.length;
    },
    error => {
      console.log("error", error);
      this.cantidadTramitesIE = 0;
    });
  }


  getCantidadTramitesEnLinea(): void {
    this.poderesDelEstadoService.getListTramitesEnLinea(0,0).subscribe(data => {
        this.totalTramiteOnline = data.length;
      },
      error => {
        console.log("error", error);
        this.totalTramiteOnline = 0;
      }
    );
  }

  getCantidadIE(): void {
    this.poderesDelEstadoService.getCantidadIE().subscribe(
      data => {
        this.categoriaPersonasConIE = data;
      },
      error => {
        console.log("error", error);
      }
    );
  }
}
