import { Component, OnInit } from '@angular/core';
import { AppConfig } from 'app/app.config';
import { Router } from '@angular/router';
import { LoginService } from 'app/services/login.service';
import { PoderesDelEstadoService } from 'app/services/PoderesDelEstadoService';

@Component({
  selector: 'app-rpt-cantidad-documentos',
  templateUrl: './rpt-cantidad-documentos.component.html',  
  providers: [LoginService],
  styleUrls: ['./rpt-cantidad-documentos.component.css']
})
export class RptCantidadDocumentosComponent implements OnInit {

  public data = {
    labels: [],
    datasets: [{
            label: 'Documentos',
            data: [],
            dataIdClasificador: [],
            dataClasificador: [],
            fill: false,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(54, 162, 235, 0.2)',
            borderWidth: 1,
        },
    ],
  };

  public options = {
    responsive: true,
    layout: { padding: { left: 0, right: 0, top: 0, bottom:120 } },
    title: {display: true, text: '',},
    tooltips: {
       enabled: true,
       intersect: true,
       callbacks: {
         label: function(tooltipItem, data) {
          let index = tooltipItem.index;
          let label = [];
          for(let x = 0; x < data.datasets.length; x++){
            let cantidad = isNaN(Number(data.datasets[x].data[index])) ? 0 : Number(data.datasets[x].data[index]);
            label[x] = (new Intl.NumberFormat('es',{ minimumFractionDigits: 0 }).format(cantidad))+' ';
          }
          return label;
         }
       }
     },
  };

  public plugins = [{
    afterDraw: (chartInstance, easing) => {
      const ctx = chartInstance.chart.ctx;
      const gradient = ctx.createLinearGradient(0, 0, 200, 0);
      gradient.addColorStop('0', 'magenta');
      gradient.addColorStop('0.5', 'blue');
      gradient.addColorStop('1.0', 'red');
      ctx.fillStyle = gradient;
      ctx.fillText('-', 200, 100);
    },
    afterDatasetsDraw: function(chart) {
      var ctx = chart.ctx;
      chart.data.datasets.forEach(function(dataset, i) {
        var meta = chart.getDatasetMeta(i);
        if (!meta.hidden) {
          meta.data.forEach(function(element, index) {
            ctx.fillStyle = 'rgb(15,12,55,1)';
            let fontSize = 12;
            ctx.font = {weight: '80', fontSize: fontSize, fontFamily: 'Arial'};
            let dataString = new Intl.NumberFormat('es',{ minimumFractionDigits: 0 }).format(dataset.data[index]);
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            let padding = -12;
            let position = element.tooltipPosition();
            ctx.fillText(dataString, position.x, position.y - (fontSize / 2) - padding);
          });
        }
      });
    }
  }];

  constructor(
    public config: AppConfig,
    private router: Router,
    public auth: LoginService,
    public poderesService: PoderesDelEstadoService
  ) {}

  ngAfterViewInit() { this.getListOeeServicios(); }

  ngOnInit(): void {
    this.viewScrollTop(400);
  }

  viewScrollTop(pos: number) {
    window.scrollTo(pos, 1);
  }

  getListOeeServicios(): void {
    setTimeout(()=>{
      this.data.labels = [];
      this.poderesService.getCantidadDocumentos().subscribe(response => {
          for(let x = 0; x < response.length; x++) {
            this.data.labels.push(response[x].documento);
            this.data.datasets[0].data.push(response[x].cantidad);
            this.data.datasets[0].dataClasificador.push(response[x].documento);
          }
        },
        error => {
          console.log("error", error);
        }
      );
    }, 1);
  }
  
}

