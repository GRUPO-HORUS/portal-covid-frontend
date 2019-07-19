import { NgModule, Component, OnInit, Input, ViewChild } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { NoticiasIppyService } from "./noticiasippy.service";
import { OwlCarousel } from "ng2-owl-carousel";

@Component({
  selector: "noticias-ippy",
  templateUrl: "noticiasippy.html",
  styleUrls: ["noticiasippy.css"],
  providers: [NoticiasIppyService]
})
export class NoticiasIppyComponent implements OnInit {
  @ViewChild("owlElement") owlElement: OwlCarousel;

  noticias: any = [];
  encuentra: boolean = false;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _noticiasService: NoticiasIppyService
  ) {}

  ngOnInit(): void {
    this.getListNoticias();

    if (this.owlElement) {
      this.owlElement.refresh();
    }
  }

  getListNoticias() {
    let meses = [
      "ENERO",
      "FEBRERO",
      "MARZO",
      "ABRIL",
      "MAYO",
      "JUNIO",
      "JULIO",
      "AGOSTO",
      "SEPTIEMBRE",
      "OCTUBRE",
      "NOVIEMBRE",
      "DICIEMBRE"
    ];
    this._noticiasService.getListNoticias().subscribe(
      data => {
        this.noticias = [];
        for (let x = 0; x < data.length; x++) {
          let noticia: any = {
            titulo: null,
            dia: null,
            mes: null,
            link: null,
            imagen: null
          };
          noticia.titulo = data[x].title.rendered;
          noticia.link = data[x].link;
          noticia.dia = Number(data[x].dia);
          noticia.mes = meses[Number(data[x].mes) - 1];
          this._noticiasService
            .getLinkImagenNoticias(data[x].imagen.href)
            .subscribe(response => {
              if (
                typeof response.media_details.sizes.td_356x220 !== "undefined"
              ) {
                noticia.imagen =
                  response.media_details.sizes.td_356x220.source_url;
              }
            });
          this.noticias.push(noticia);
        }
        if (this.noticias != null) {
          this.encuentra = true;
        }
        if (this.owlElement) {
          this.owlElement.refresh();
        }
      },
      error => {
        console.log("error", error);
      }
    );
  }
}
