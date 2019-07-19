import { Component, OnInit } from "@angular/core";
import { LoginService } from 'app/services/login.service';
import { Router } from "@angular/router";
import { AppConfig } from "../../../app.config";
import { PoderesDelEstadoService } from "../../../services/PoderesDelEstadoService";
import { EncuestaService } from "../../../services/encuesta.service";

@Component({
  selector: "rpt-satisfaccion-tramite",
  styleUrls: ['rpt-satisfaccion-tramite.component.css'],
  providers: [LoginService, EncuestaService],
  templateUrl: "rpt-satisfaccion-tramite.component.html"
})
export class RptSatisfaccionTramiteComponent implements OnInit{
  public data = {
    labels: [],
    datasets: [{
            label: '',
            data: [],
            dataRespuesta: [],
            fill: false,
            backgroundColor: [
              'rgba(75, 192, 192, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 99, 132, 0.2)',
            ],
            borderColor: 'rgba(54, 162, 235, 0.2)',
            borderWidth: 1,
        },
    ],
  };

  public data1 = {
    labels: [],
    datasets: [{
            label: '',
            data: [],
            dataRespuesta: [],
            fill: false,
            backgroundColor: [
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 99, 132, 0.2)',
            ],
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
            let respuesta = data.datasets[x].dataRespuesta[index];
            label[x] = respuesta.replace('_','')+': '+ (new Intl.NumberFormat('es',{ minimumFractionDigits: 0 }).format(cantidad))+' trámites';
          }
          return label;
         }
       }
     },
  };

  public plugins = [{
    afterDraw: (chartInstance, easing) => {
      const ctx = chartInstance.chart.ctx;
      const gradient = ctx.createLinearGradient(0, 0, 420, 0);
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
            let fontSize = 10;
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
    public poderesService: PoderesDelEstadoService,
    public encuestaService: EncuestaService
  ) {}
  ngAfterViewInit() { 
    this.getSatisfaccionTramite(1); 
    this.getSatisfaccionTramite(2); 
  }

  ngOnInit(): void {
    this.viewScrollTop(400);
  }

  viewScrollTop(pos: number) {
    window.scrollTo(pos, 1);
  }

  getSatisfaccionTramite(idEncuesta: number): void {
    setTimeout(()=>{
      this.data.labels = [];
      this.data1.labels = [];
      this.encuestaService.getSatisfaccionTramite(idEncuesta).subscribe(response => {
          for(let x = 0; x < response.length; x++){
            if(idEncuesta == 1){
              this.data.labels.push(response[x].respuesta);
              this.data.datasets[0].data.push(response[x].cantidadVotos);            
              this.data.datasets[0].dataRespuesta.push(response[x].respuesta);
            }
            if(idEncuesta == 2){
              this.data1.labels.push(response[x].respuesta);
              this.data1.datasets[0].data.push(response[x].cantidadVotos);            
              this.data1.datasets[0].dataRespuesta.push(response[x].respuesta);
            }
          }
        },
        error => {
          console.log("error", error);
        }
      );
    }, 1);
  }
  
}
