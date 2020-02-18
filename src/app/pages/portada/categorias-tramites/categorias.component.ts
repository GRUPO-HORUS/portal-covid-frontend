import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { CategoriasTramitesService } from "app/services/CategoriasTramitesService";
import { MessageService } from "app/services/MessageService";

@Component({
  selector: "categorias",
  templateUrl: "categorias.html",
  providers: [CategoriasTramitesService]
})
export class CategoriasTramitesComponent implements OnInit {
  categorias: any = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public messageService: MessageService,
    private categoriasTramitesService: CategoriasTramitesService
  ) {
  }

  ngOnInit(): void {
    this.getListCategorias();
    this.viewScrollTop();
  }

  viewScrollTop() {
    window.scrollTo(0, 1);
  }

  getListCategorias(): void {
    this.viewScrollTop();
    this.categoriasTramitesService.getListCategorias("0", "100").subscribe(
      data => {
        let contador = 0;
        if (data != null && data.length > 0) {
          this.categorias = data;
        }
      },
      error => {
        console.log("error", error);
      }
    );
  }

  searchDataCategoria(data) {
    this.router.navigate(["/categoria/", data.idClasificador, 'resultado']);
  }

  
}
