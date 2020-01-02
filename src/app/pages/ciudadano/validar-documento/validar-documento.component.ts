import { Component, OnInit, Input } from "@angular/core";
import { MessageService } from "../../../services/MessageService";
import { AppConfig } from "app/app.config";
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from 'app/services/login.service';
import { DocumentosService } from "app/services/documentos.service";

@Component({
  selector: "validar-documento",
  styleUrls: ['validar-documento.component.css'],
  providers: [LoginService, DocumentosService],
  templateUrl: "validar-documento.component.html"
})
export class ValidarDocumentoComponent implements OnInit {
  
  public loading: boolean;
  public mensaje: string;

  public constancia_nro: string;
  public codigo_seguridad: string;

  constructor(
    public messageService: MessageService,
    public config: AppConfig,
    private router: Router,
    public documentosService: DocumentosService,
    private activeRoute: ActivatedRoute,
  ) { }

  ngOnInit() {

    this.activeRoute.queryParams.forEach(e => {

      if(e.constancia_nro && e.codigo_seguridad){

        this.constancia_nro = e.constancia_nro;
        
        this.codigo_seguridad = e.codigo_seguridad;
        
        this.validarDocumento();
      }

    });
  }

  validarDocumento() {
    this.documentosService.validacionDocumento(this.constancia_nro, this.codigo_seguridad).subscribe(response => {
      
      if(!response.status || !response.historico._id || response.historico._id == null){
      
        this.mensaje = 'Documento no válido';
      
      } else {
      
        this.mensaje = '';

        this.router.navigate(["/visor/validar-documento/"+response.historico._id+'/'+response.identificadorUnico]);

      }

      this.loading = false; 

    }, error => {
      console.log("error", error);
      this.loading = false;
    });
    
  }

}
