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
  
  title: string = '';
  heads: any = [];
  separatorTitle: string = ',';
  posAlign: number = 0;
  posTitle: number = 1;
  obs: string;
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
        let headers = results.head.split('|');
        this.title = headers[0];
        this.heads = headers.slice(1);
        this.data = results.data;
        this.obs = results.obs;
      },
      error => {
        console.log("error", error);
      }
      );
    }, 1);
  }

  downloadFile(data, filename='data') {
    let csvData = this.ConvertToCSV(data, ['name','age', 'average', 'approved', 'description']);
    console.log(csvData)
    let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
        dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", filename + ".csv");
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }
  ConvertToCSV(objArray, headerList) {
    let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    let row = 'S.No,';
    for (let index in headerList) {
      row += headerList[index] + ',';
    }
    row = row.slice(0, -1);
    str += row + '\r\n';
    for (let i = 0; i < array.length; i++) {
        let line = (i+1)+'';
        for (let index in headerList) {
            let head = headerList[index];
            line += ',' + array[i][head];
        }
        str += line + '\r\n';
    }
    return str;
  }
  
}
