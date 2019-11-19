import { Component, OnInit } from "@angular/core";
import { LoginService } from 'app/services/login.service';
import { Router } from "@angular/router";
import { AppConfig } from "../../../app.config";
import { PoderesDelEstadoService } from "../../../services/PoderesDelEstadoService";

@Component({
  selector: "rpt-porcentaje-tramites-online",
  styleUrls: ['rpt-porcentaje-tramites-online.component.css'],
  providers: [LoginService],
  templateUrl: "rpt-porcentaje-tramites-online.component.html"
})
export class RptPorcentajeTramitesOnlineComponent implements OnInit{
  public data = {
    labels: [],    
    legend: {
      display: true,
      position: 'top',
      // reverse: true,
      // fullWidth: false,
      labels: {
        boxWidth: 60,
        fontColor: 'black'
      },
    },
    onClick: function(c, i) {
      console.log('datasets');
      console.log(c);
      console.log(i);
      // var x_value = this.data.labels[e._index];
      // var y_value = this.data.datasets[0].data[e._index];
    },
    datasets: [{
          label: 'En línea',
          data: [],
          cantidadServicios: [],
          cantidadServiciosOnline: [],
          idsOee: [],
          fill: false,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 0.2)',
          borderWidth: 1,
      },
    ],
  };
  public options = {
    responsive: true,
    layout: { padding: { left: 0, right: 0, top: 0, bottom: 120 } },
    title: {display: true, text: 'titulo',},
    //maintainAspectRatio: false,
    // scales: { yAxes: [{ ticks: { beginAtZero: true } }] },
    scales: { xAxes: [{stacked: true}], yAxes: [{stacked: true}] },
    onClick: function(c, i) {
      console.log('onClick');
      console.log(c);
      console.log(i);
      // var x_value = this.data.labels[e._index];
      // var y_value = this.data.datasets[0].data[e._index];
    },
    legendCallback: function(chart) {
      console.log('legendCallback', chart);
    },
    tooltips: {
       enabled: true,
       intersect: true,
       callbacks: {
         label: function(tooltipItem, data) {
          let index = tooltipItem.index;
          //console.log("labeldata", data);
          let label = [];
          for(let x = 0; x < data.datasets.length; x++){
            let cantidad = isNaN(Number(data.datasets[x].data[index])) ? 0 : Number(data.datasets[x].data[index]);
            let cantidadServiciosOnline = isNaN(Number(data.datasets[x].cantidadServiciosOnline[index])) ? 0 : Number(data.datasets[x].cantidadServiciosOnline[index]);
            let cantidadServicios = isNaN(Number(data.datasets[x].cantidadServicios[index])) ? 0 : Number(data.datasets[x].cantidadServicios[index]);
            label[x] = data.datasets[x].label+': '+ (new Intl.NumberFormat('es',{ minimumFractionDigits: 0 }).format(cantidad))+'% ' + ' - '+cantidadServiciosOnline+' de '+cantidadServicios+' trámites';
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
            let padding = -20;
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

  ngAfterViewInit() { 
    this.getTramitesOnline(); 
  }

  ngOnInit(): void {
    this.viewScrollTop(400);
  }

  viewScrollTop(pos: number) {
    window.scrollTo(pos, 1);
  }  

  getTramitesOnline(): void {
    setTimeout(()=>{
      this.data.labels = [];
      this.poderesService.getPorcentajeTramitesOnline().subscribe(response => {
          for(let x = 0; x < response.length; x++){
            if(Number(response[x].cantidadServiciosOnline) > 0 || Number(response[x].cantidadServicios) > 0) {
              this.data.labels.push(response[x].institucion);
              this.data.datasets[0].cantidadServiciosOnline.push(response[x].cantidadServiciosOnline);
              this.data.datasets[0].cantidadServicios.push(response[x].cantidadServicios);
              this.data.datasets[0].data.push(response[x].porcentaje);
              this.data.datasets[0].idsOee.push(response[x].idOee);
            }
          }
        },
        error => {
          console.log("error", error);
        }
      );
    }, 1);
  }

  onSelect(evt) {
    console.log('onSelected');
    console.log(evt);
  }

  chartClicked(event: any) {
    console.log('chartClicked',event);
    // let idOee = Number(this.data.datasets[0].idsOee[event.element[0]._index]);
    // console.log('index', event.element[0]._index);
    // console.log('oee',idOee);
  }

  public chartHovered({ event, active }: { event: MouseEvent, active: {}[] }): void {
    console.log(event, active);
  }
  
}
