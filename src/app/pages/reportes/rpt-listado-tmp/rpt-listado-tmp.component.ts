import { Component, OnInit } from "@angular/core";
import { LoginService } from 'app/services/login.service';
import { AppConfig } from "../../../app.config";
import { PoderesDelEstadoService } from "../../../services/PoderesDelEstadoService";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "rpt-listado-tmp",
  styleUrls: ['rpt-listado-tmp.component.css'],
  providers: [LoginService],
  templateUrl: "rpt-listado-tmp.component.html"
})
export class RptListadoTmp implements OnInit{
  
  title: string = '';
  heads: any = [];
  data: any = [];
  Object: Object;
  
  constructor(
    private _route: ActivatedRoute,
    public config: AppConfig,
    public auth: LoginService,
    public poderesService: PoderesDelEstadoService
  ) {
  }

  ngOnInit(): void {
    this.viewScrollTop(400);
  }

  viewScrollTop(pos: number) {
    window.scrollTo(pos, 1);
  }
  
}
