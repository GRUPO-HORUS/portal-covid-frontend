import {
  Component,
  EventEmitter,
  OnInit,
  Output
} from "@angular/core";
import { ScrollToService } from "ng2-scroll-to-el";
import { DomSanitizer } from "@angular/platform-browser";
import { AppConfig } from "app/app.config";
import { MessageService } from "app/services/MessageService";

@Component({
  selector: "consulta-reclamo",
  templateUrl: "./consulta-reclamo.html",
  styles: [``]
})
export class ConsultaReclamoComponent implements OnInit {
  @Output() change: EventEmitter<string> = new EventEmitter<string>();
  public iframeConsultas: string;

  constructor(
    private scrollService: ScrollToService,
    private config: AppConfig,
    public messageService: MessageService,
    public sanitizer: DomSanitizer
  ) {}
  
  ngOnInit(): void {
    this.iframeConsultas = this.config.URL_CONSULTAS;
    window.scrollTo(200, 1);
  }
  scrollToTop(event) {
    this.scrollService.scrollTo(event);
  }

  setDataTramite(tramite: any, topSite: any) {
    this.change.emit(tramite);
    this.scrollToTop(topSite);
  }
}
