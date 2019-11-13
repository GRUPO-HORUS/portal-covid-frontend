import { Component, OnInit } from "@angular/core";
import { LoginService } from 'app/services/login.service';
import { AppConfig } from "../../../app.config";
import { PoderesDelEstadoService } from "../../../services/PoderesDelEstadoService";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "rpt-tramites-sin-tag",
  styleUrls: ['rpt-tramites-sin-tag.component.css'],
  providers: [LoginService],
  templateUrl: "rpt-tramites-sin-tag.component.html"
})
export class RptTramitesSinTag implements OnInit{
  
  heads: any = [];
  data: any = [];
  Object: Object;
  
  constructor(
    private _route: ActivatedRoute,
    public config: AppConfig,
    public auth: LoginService,
    public poderesService: PoderesDelEstadoService
  ) {

    this._route.params.subscribe(params => {
      let tipo = params["tipo"];
      this.getTramites(tipo); 
    });

  }

  ngOnInit(): void {
    this.viewScrollTop(400);
  }

  viewScrollTop(pos: number) {
    window.scrollTo(pos, 1);
  }

  getTramites(tipo: string): void {
    setTimeout(()=>{
      this.poderesService.getEstadistica(tipo).subscribe(response => {
        let results: any = response;
        this.heads = results.head.split(',');
        this.data = results.data;
      },
      error => {
        console.log("error", error);
      }
      );
    }, 1);
  }
  
}
