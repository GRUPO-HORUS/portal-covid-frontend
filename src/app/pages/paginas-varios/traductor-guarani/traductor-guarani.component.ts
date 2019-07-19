import { Component, OnInit } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { AppConfig } from "app/app.config";
import { MessageService } from "app/services/MessageService";
import { TraductorService } from "app/services/traductor.service";

@Component({
  selector: "traductor-guarani",
  styleUrls: ['traductor-guarani.css'],
  templateUrl: "traductor-guarani.html",
  providers: [TraductorService]

})
export class TraductorGuaraniComponent implements OnInit {
  
  public url: string;
  public trEspAgua: any = 'GUA';
  public busqueda: string = '';
  public resultado: any = {};

  constructor(
    public sanitizer: DomSanitizer,
    private config: AppConfig,
    public messageService: MessageService,
    public traductorService: TraductorService
  ) {}

  ngOnInit(): void {
    window.scrollTo(200, 1);
    this.url = this.config.URL_TRADUCTOR;
  }

  onKey(event: any) {
    this.busqueda = event.target.value;
    this.buscar(); 
  }

  filtroSug(event: any) {
    this.busqueda = event.palabra;
    this.buscar(); 
  }

  onItemLang(lang: string) {
    this.trEspAgua = lang;
  }

  agregarLetra(letra: string) {
    if(!this.busqueda || typeof this.busqueda == 'undefined') {
      this.busqueda = '';
    }
      
    this.busqueda = this.busqueda + letra;
  }

  buscar() {
    if(this.busqueda && typeof this.busqueda != 'undefined') {

      this.traductorService.getTraductor(this.trEspAgua, this.busqueda).subscribe(response => {
          if(response && response.data) {
            this.resultado.status = true;
            this.resultado.data = response.data;

          } else {
            this.resultado.status = false;  
            this.resultado.data = {};
          }
          console.log("this.resultado", this.resultado);
        },
        error => {
          this.resultado.status = false;
          this.resultado.data = {};
          console.log("error", error);
        }
      );
    } else {
      this.resultado.status = false;
      this.resultado.data = {};
    }

  }

  ejemplo() {
    this.busqueda = 'ab';
    this.buscar();
    console.log("palabra(ejemplo): ", this.busqueda, this.trEspAgua);
  }

}
