import { Component, OnInit, OnDestroy } from '@angular/core';
import { Message, ConfirmationService } from 'primeng/api';
import { delay } from 'rxjs/operators';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import {ReporteNoUbicacionModel} from "./model/reporte-no-ubicacion.model";
import {PermissionGuardService} from "../../../services/permission-guard.service";
import {Usuario} from "../../usuario/model/usuario.model";
import {ReporteNoUbicacionService} from "./shared/reporte-no-ubicacion.service";

@Component({
  selector: 'app-reporte-no-ubicacion',
  templateUrl: './reporte-no-ubicacion.component.html',
  styleUrls: ['./reporte-no-ubicacion.component.css'],
})
export class ReporteNoUbicacionComponent implements OnInit, OnDestroy {

  msgs: Message[] = [];

  block: boolean;

  cols: any[];


  pageSize: number = 10;

  start: number = 0;

  filter: string;

  totalRecords: number = 0;

  sortDesc: boolean = true;

  sortField: string;

  reportes: ReporteNoUbicacionModel[];

  formGroup: FormGroup;

  constructor(private _reporteService: ReporteNoUbicacionService, private permission: PermissionGuardService) { }

  ngOnInit() {
    this.cols = [
      { field: 'nombreCompleto', header: 'Nombre', width: '25%' },
      { field: 'cedula', header: 'Cédula', width: '10%' },
      { field: 'clasificacionPaciente', header: 'Clasificación', width: '12%', sort: true },
      { field: 'inicioAislamiento', header: 'Inicio de Aislamiento', width: '12%' , isDate: true, sort: true},
      { field: 'finAislamiento', header: 'Fin de Aislamiento', width: '12%', isDate: true, sort: true },
      { field: 'fechaUltimoDiagnostico', header: 'Fecha Último Diagnostico', width: '12%', isDate: true, sort: true },
      { field: 'resultadoUltimoDiagnostico', header: 'Resultado Último Diagnostico', width: '25%', sort: true },
    ];
  }

  ngOnDestroy() {

  }

  load($event: any) {

    if ($event) {
      this.filter = $event.globalFilter;
      this.pageSize = $event.rows;
      this.start = $event.first / this.pageSize;
      this.sortField = $event.sortField;
      this.sortDesc = $event.sortOrder == -1;
    }

    this.loadReporte();
  }


  private loadReporte() {
    this._reporteService.getAllQueryReporte(this.start, this.pageSize, this.filter, this.sortDesc, this.sortField).subscribe(res => {
      if(res.status === 200){
        this.reportes = res.body;
        this.totalRecords = res.headers.get('x-total-count');
      }
    });
  }

  checkPermission(nombre: string): boolean {
    return this.permission.hasPermission(nombre);
  }

}
