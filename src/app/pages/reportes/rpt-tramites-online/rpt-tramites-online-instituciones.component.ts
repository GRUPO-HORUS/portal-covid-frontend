import { Component, OnInit } from "@angular/core";
import { LoginService } from 'app/services/login.service';
import { AppConfig } from "../../../app.config";
import { PoderesDelEstadoService } from "../../../services/PoderesDelEstadoService";

@Component({
  selector: "rpt-tramites-online-instituciones",
  styleUrls: ['rpt-tramites-online-instituciones.component.css'],
  providers: [LoginService],
  templateUrl: "rpt-tramites-online-instituciones.component.html"
})
export class RptTramitesOnlineInstitucionesComponent implements OnInit{
  public data = {
    labels: [],
    legend: {
      display: true,
      position: 'top',
      reverse: true,
      fullWidth: true,
      labels: {
        boxWidth: 80,
        fontColor: 'black'
      }
    },
    datasets: [{
          label: 'En línea',
          data: [],
          cantidadServicios: [],
          cantidadServiciosOnline: [],
          fill: false,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 0.2)',
          borderWidth: 1,
      },
      {
        label: 'Total',
        data: [],
        cantidadServicios: [],
        cantidadServiciosOnline: [],
        fill: false,
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 0.2)',
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
      this.poderesService.getInstitucionesServiciosOnline().subscribe(response => {
          for(let x = 0; x < response.length; x++){
            if(Number(response[x].cantidadServiciosOnline) > 0 || Number(response[x].cantidadServicios) > 0) {
              this.data.labels.push(response[x].institucion);

              this.data.datasets[0].cantidadServiciosOnline.push(response[x].cantidadServiciosOnline);
              this.data.datasets[0].cantidadServicios.push(response[x].cantidadServicios);
              this.data.datasets[0].data.push(response[x].cantidadServiciosOnline);

              this.data.datasets[1].cantidadServiciosOnline.push(response[x].cantidadServiciosOnline);
              this.data.datasets[1].cantidadServicios.push(response[x].cantidadServicios);
              this.data.datasets[1].data.push(response[x].cantidadServicios);

            }
          }
        },
        error => {
          console.log("error", error);
        }
      );
    }, 1);
  }

  chartClicked(event){
    let idClasificador = Number(this.data.datasets[0].data[event.element[0]._index]);
    //if(idClasificador > 0){ this.router.navigate(["/categoria/"+idClasificador+'/resultado']);}    
  }
  
}
