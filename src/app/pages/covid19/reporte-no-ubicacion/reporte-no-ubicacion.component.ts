import { Component, OnInit, OnDestroy } from '@angular/core';
import {Message, ConfirmationService, SelectItem} from 'primeng/api';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import {ReporteNoUbicacionModel} from "./model/reporte-no-ubicacion.model";
import {PermissionGuardService} from "../../../services/permission-guard.service";
import {saveAs} from 'file-saver';
import {ReporteNoUbicacionService} from "./shared/reporte-no-ubicacion.service";
import {DatePipe} from "@angular/common";
import {Subscription} from 'rxjs';

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
  search: string;
  totalRecords: number = 0;
  sortDesc: boolean = true;
  sortField: string;
  reportes: ReporteNoUbicacionModel[];
  formGroup: FormGroup;
  loading = true;
  error = false;
  private loadSubsciption: Subscription;
  filters: SelectItem[];
  selectedFilter: SelectItem;
  filter: string;

  constructor(private _reporteService: ReporteNoUbicacionService, private permission: PermissionGuardService, private datepipe: DatePipe) { }

  ngOnInit() {
    this.cols = [
      { field: 'nombreCompleto', header: 'Nombre', width: '40%' },
      { field: 'cedula', header: 'Cédula', width: '20%' },
      { field: 'fechaUltimoReporte', header: 'Fecha Último Reporte', width: '40%', isDate: true, sort: false, fieldEntity: 'fechaUltimoReporteUbicacion' },
    ];
    this.filters = [
      {label: 'Seleccione filtro', value: null},
      {label: 'Tipo de Paciente', value: 'resultadoUltimoDiagnostico'},
    ];
  }

  ngOnDestroy() {

  }

  load($event: any) {

    if ($event) {
      this.search = $event.globalFilter;
      this.filter = null;
      this.pageSize = $event.rows;
      this.start = $event.first / this.pageSize;
      let field = this.cols.find(c => c.field === $event.sortField);
      this.sortField = (field ? field.fieldEntity : field) || $event.sortField;
      this.sortDesc = $event.sortOrder == -1;
      if(this.selectedFilter && $event.globalFilter) {
        this.filter = `${this.selectedFilter}:${$event.globalFilter}`;
        this.search = null;
      }
    }

    this.loadReporte();
  }


  private loadReporte() {
    this.loading = true;
    this.error = false;
    if (this.loadSubsciption && !this.loadSubsciption.closed) {
      this.loadSubsciption.unsubscribe();
    }
    this.loadSubsciption = this._reporteService.getAllQueryReporte(this.start, this.pageSize, this.search, this.sortDesc, this.sortField, this.filter).subscribe(res => {
      if(res.status === 200){
        this.reportes = res.body;
        this.totalRecords = res.headers.get('x-total-count');
      } else {
        this.error = true;
      }
      this.loading = false;
    });
  }

  checkPermission(nombre: string): boolean {
    return this.permission.hasPermission(nombre);
  }

  onDownloadCsv() {
    this.loading = true;
    this._reporteService.downloadCSV(this.search, this.sortDesc, this.sortField).subscribe(
      (data: any) => {
        let latest_date = this.datepipe.transform(new Date(), 'yyyyMMddHHmmss');
        saveAs(data,`ListaPacientes${latest_date}.csv`);
        this.loading = false;
      },
      error => {
        console.log(error);
        this.loading = false;
      });
  }

}
