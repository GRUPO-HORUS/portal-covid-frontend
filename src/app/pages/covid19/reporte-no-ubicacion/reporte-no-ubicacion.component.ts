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

  sortAsc: boolean = true;

  sortField: string;

  reportes: ReporteNoUbicacionModel[];

  formGroup: FormGroup;

  constructor(private _reporteService: ReporteNoUbicacionService, private permission: PermissionGuardService) { }

  ngOnInit() {
    this.cols = [
      { field: 'nombreCompleto', header: 'Nombre', width: '25%' },
      { field: 'cedula', header: 'Cédula', width: '10%' },
      { field: 'clasificacionPaciente', header: 'Clasificación', width: '12%' },
      { field: 'inicioAislamiento', header: 'Inicio de Aislamiento', width: '12%' },
      { field: 'finAislamiento', header: 'Fin de Aislamiento', width: '12%' },
      { field: 'fechaUltimoDiagnostico', header: 'Fecha Último Diagnostico', width: '12%' },
      { field: 'resultadoUltimoDiagnostico', header: 'Resultado Último Diagnostico', width: '25%' },
    ];
  }

  ngOnDestroy() {

  }

  load($event: any) {

    if ($event) {
      this.filter = $event.globalFilter;
      this.start = $event.first;
      this.pageSize = $event.rows;
      this.sortField = $event.sortField;

      this.sortAsc = $event.sortOrder == 1;
    }

    this.loadReporte();
  }


  private loadReporte() {
    this._reporteService.getAllQueryReporte(this.start, this.pageSize, this.filter, this.sortAsc, this.sortField).subscribe(reportes => {
      console.log(reportes)
      this.reportes = reportes;
      // this.totalRecords = ;
    });
  }

  checkPermission(nombre: string): boolean {
    return this.permission.hasPermission(nombre);
  }

}
