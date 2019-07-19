import { Component, ElementRef, Inject, AfterViewInit, ChangeDetectorRef } from "@angular/core";
declare var jQuery: any;

@Component({
  selector: "sectores",
  templateUrl: "./sectores.html",
  styleUrls: ["./sectores.css"]
})

export class SectoresComponent implements AfterViewInit {
  elementRef: ElementRef;
  slideValue: number = 0;
  public images: any = servicios;

  constructor(
    @Inject(ElementRef) elementRef: ElementRef,
    public cdr: ChangeDetectorRef
  ) {
    this.elementRef = elementRef;
  }

  ngAfterViewInit() {
    jQuery("#carouselExample").on("slide.bs.carousel", function(e) {
      let jQuerye = jQuery(e.relatedTarget);
      let idx = jQuerye.index();
      let itemsPerSlide = 4;
      let totalItems = jQuery(".carousel-item").length;
      if (idx >= totalItems - (itemsPerSlide - 1)) {
        let it = itemsPerSlide - (totalItems - idx);
        for (let i = 0; i < it; i++) {
          if (e.direction === "left") {
            jQuery(".carousel-item")
              .eq(i)
              .appendTo(".carousel-inner");
          } else {
            jQuery(".carousel-item")
              .eq(0)
              .appendTo(".carousel-inner");
          }
        }
      }
    });
   jQuery("#carouselExample").carousel({ interval: 6000 });
  }
}

const servicios: any[] = [
  {
    id: 1,
    url_imagen: "assets/img/portales/informacion-publica.jpg",
    link: "http://informacionpublica.paraguay.gov.py",
    titulo: "Acceso a la Información Pública"
  },
  {
    id: 2,
    url_imagen: "assets/img/portales/datos-abiertos.jpg",
    link: "http://datos.gov.py",
    titulo: "Datos Abiertos"
  },
  {
    id: 3,
    url_imagen: "assets/img/portales/documentos.gov.py.jpg",
    link: "http://documentos.gov.py",
    titulo: "documentos.gov.py"
  },
  {
    id: 4,
    url_imagen: "assets/img/portales/denuncia-anticorrupcion.jpg",
    link: "http://denuncias.gov.py/ssps/",
    titulo: "Denuncias anticorrupción"
  },
  {
    id: 5,
    url_imagen: "assets/img/portales/cursos.jpg",
    link: "http://www.cursos.gov.py/",
    titulo: "Cursos en línea"
  },
  {
    id: 6,
    url_imagen: "assets/img/portales/trabaja-en-el-estado.jpg",
    link: "https://www.paraguayconcursa.gov.py",
    titulo: "Trabajá en el Estado"
  }
];
