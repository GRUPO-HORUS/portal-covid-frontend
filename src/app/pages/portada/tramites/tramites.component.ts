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
  categoriaPersonasConIE: any;

  resultados: any = [];
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
      "nombre_clasificador": "Mayor de Edad"
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
    this.getCategoriaTramite();
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

  getDataServicio(linkDatos, id) {
    this.router.navigate(["/oee/", linkDatos, id]);
  }

  searchDataCategoria(id_clasificador) {
    this.router.navigate(["/categoria/", id_clasificador, 'resultado']);
  }
  
}
