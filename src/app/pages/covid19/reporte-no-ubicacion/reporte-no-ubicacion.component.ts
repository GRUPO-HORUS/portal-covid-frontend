import { Component, OnInit, OnDestroy } from '@angular/core';
import { Message, ConfirmationService } from 'primeng/api';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import {ReporteNoUbicacionModel} from "./model/reporte-no-ubicacion.model";
import {PermissionGuardService} from "../../../services/permission-guard.service";
import {saveAs} from 'file-saver';
import {ReporteNoUbicacionService} from "./shared/reporte-no-ubicacion.service";
import {DatePipe} from "@angular/common";

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
  loading = true;

  constructor(private _reporteService: ReporteNoUbicacionService, private permission: PermissionGuardService, private datepipe: DatePipe) { }

  ngOnInit() {
    this.loading = false;
    this.cols = [
      { field: 'nombreCompleto', header: 'Nombre', width: '40%' },
      { field: 'cedula', header: 'Cédula', width: '20%' },
      { field: 'fechaUltimoReporte', header: 'Fecha Último Reporte', width: '40%', isDate: true, sort: true, fieldEntity: 'fechaUltimoReporteUbicacion' },
    ];
  }

  ngOnDestroy() {

  }

  load($event: any) {

    if ($event) {
      this.filter = $event.globalFilter;
      this.pageSize = $event.rows;
      this.start = $event.first / this.pageSize;
      let field = this.cols.find(c => c.field === $event.sortField);
      this.sortField = (field ? field.fieldEntity : field) || $event.sortField;
      this.sortDesc = $event.sortOrder == -1;
    }

    this.loadReporte();
  }


  private loadReporte() {
    this.loading = true;
    this._reporteService.getAllQueryReporte(this.start, this.pageSize, this.filter, this.sortDesc, this.sortField).subscribe(res => {
      if(res.status === 200){
        this.reportes = res.body;
        this.totalRecords = res.headers.get('x-total-count');
      }
      this.loading = false;
    });
  }

  checkPermission(nombre: string): boolean {
    return this.permission.hasPermission(nombre);
  }

  onDownloadCsv() {
    this.loading = true;
    this._reporteService.downloadCSV(this.filter, this.sortDesc, this.sortField).subscribe(
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
