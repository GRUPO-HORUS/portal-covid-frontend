import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { PoderesDelEstadoService } from "app/services/PoderesDelEstadoService";
import { MessageService } from "app/services/MessageService";

@Component({
  selector: "tramites",
  templateUrl: "./tramites.html"
})
export class TramitesComponent {
  categoriaTramite: any;
  
  tramitesEnLinea: any;
  totalTramiteOnline: number;
  ultimosTramitesEnLinea: any;

  resultados: any = [];
  cantidadOee: number = 0;
  cantidadTramites: number = 0;

  cantidadTramitesIE: number = 0;
  idClasificadorIE: number = 1;

  cicloDeVida: any[] = [{
      "id_clasificador": 11005,
      "icono": "fas fa-baby",
      "nombre_clasificador": "Niñez"
    }, {
      "id_clasificador": 11006,
      "icono": "fa fa-child",
      "nombre_clasificador": "Adolescencia"
    }, {
      "id_clasificador": 11007,
      "icono": "fas fa-walking",
      "nombre_clasificador": "Juventud"
    }, {
      "id_clasificador": 11008,
      "icono": "fas fa-male",
      "nombre_clasificador": "Adultos"
    }, {
      "id_clasificador": 11009,
      "icono": "fa fa-blind",
      "nombre_clasificador": "Adulto Mayor"
    }
  ];

  constructor(
    private router: Router,
    private messageService: MessageService,
    private poderesDelEstadoService: PoderesDelEstadoService
  ) {
    this.getCantidadOee();
    this.getCantidadTramites();
    this.getCantidadTramitesEnLinea();
    this.getCantidadTramitesConIE();

    this.getCategoriaTramite();
    this.getListTramitesDestacados();
    this.getListTramitesOnline();
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

  getCategoriaTramite(): void {
    this.poderesDelEstadoService.getCategoriaTramite().subscribe(
      data => {
        this.categoriaTramite = data;
      },
      error => {
        console.log("error", error);
      }
    );
  }

  getListTramitesDestacados(): void {
    this.poderesDelEstadoService.getListTramitesEnLinea(1,3).subscribe(data => {
        this.tramitesEnLinea = data;
      },
      error => {
        console.log("error", error);
      }
    );
  }

  getListTramitesOnline(): void {
    this.poderesDelEstadoService.getListTramitesEnLinea(0,3).subscribe(
      data => {
        this.ultimosTramitesEnLinea = data;
      },
      error => {
        console.log("error", error);
      }
    );
  }

  getDataServicio(linkDatos, id) {
    this.router.navigate(["/oee/", linkDatos, id]);
  }

  searchDataCategoria(id_clasificador) {
    this.router.navigate(["/categoria/", id_clasificador, 'resultado']);
  }
  
}
