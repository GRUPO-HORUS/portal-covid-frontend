import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {Message, ConfirmationService, SelectItem} from 'primeng/api';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import {ReporteNoUbicacionModel} from "./model/reporte-no-ubicacion.model";
import {PermissionGuardService} from "../../../services/permission-guard.service";
import {saveAs} from 'file-saver';
import {ReporteNoUbicacionService} from "./shared/reporte-no-ubicacion.service";
import {DatePipe} from "@angular/common";
import {Subscription} from 'rxjs';
import {ReporteNoUbicacionSearch} from "./model/reporte-no-ubicacion.search";
import {OverlayPanel} from "primeng/primeng";

const nameof = <T>(name: keyof T) => name;

@Component({
  selector: 'app-reporte-no-ubicacion',
  templateUrl: './reporte-no-ubicacion.component.html',
  styleUrls: ['./reporte-no-ubicacion.component.css'],
})
export class ReporteNoUbicacionComponent implements OnInit, OnDestroy {
  @ViewChild('op') _op: OverlayPanel;

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
  loading = true;
  error = false;
  private loadSubsciption: Subscription;
  tipoPacienteList: any[];
  motivoIngresoList: any[];
  filterList: string[] = [];
  advancedSearch: ReporteNoUbicacionSearch;

  constructor(private _reporteService: ReporteNoUbicacionService, private permission: PermissionGuardService, private datepipe: DatePipe) { }

  ngOnInit() {
    this.init();
  }

  ngOnDestroy() {

  }

  init() {
    this.cols = [
      { field: 'nombreCompleto', header: 'Nombre', width: '40%' },
      { field: 'cedula', header: 'Cédula', width: '20%' },
      { field: 'fechaUltimoReporte', header: 'Fecha Último Reporte', width: '40%', isDate: true, sort: false, fieldEntity: 'fechaUltimoReporteUbicacion' },
    ];
    this.resetAdvancedSearch();
    this.tipoPacienteList = [
      {value:"positivo", label: "Caso Confirmado"},
      {value:"negativo", label: "Examen Negativo"},
      {value:"sospechoso", label: "Caso Sospechoso"},
      {value:"alta_confirmado", label: "Alta de Caso Confirmado"},
      {value:"alta_aislamiento", label: "Alta de Aislamiento"},
      {value:"fallecido", label: "Fallecido"}
      ];
    this.motivoIngresoList = [
      {value:'ingreso_pais',label:'Viajeros que llegaron al País'},
      {value:'aislamiento_confirmado',label:'Casos confirmados de COVID-19'},
      {value:'aislamiento_contacto',label:'Contactos de casos confirmados de COVID-19'},
      {value:'caso_sospechoso',label:'Caso sospechoso de COVID-19'},
      {value:'examen_laboratorio',label:'Examen de Laboratorio de COVID-19'}
    ];
  }

  load($event: any) {

    if ($event) {
      this.search = $event.globalFilter;
      this.pageSize = $event.rows;
      this.start = $event.first / this.pageSize;
      let field = this.cols.find(c => c.field === $event.sortField);
      this.sortField = (field ? field.fieldEntity : field) || $event.sortField;
      this.sortDesc = $event.sortOrder == -1;
      // if(this.selectedFilter && $event.globalFilter) {
      //   this.filter = `${this.selectedFilter}:${$event.globalFilter}`;
      //   this.search = null;
      // }
    }

    this.loadReporte();
  }

  onSearch() {
    this.filterList = [];
    this._op.visible = false;
    Object.keys(this.advancedSearch).forEach(property => {
      if(this.advancedSearch[property]) this.filterList.push(`${property}:${this.advancedSearch[property]}`)
    });
    this.loadReporte();
  }

  cancelSearch() {
    this.resetAdvancedSearch();
    this._op.visible = false;
  }

  resetAdvancedSearch() {
    this.advancedSearch = new ReporteNoUbicacionSearch();
  }

  private loadReporte() {
    this.loading = true;
    this.error = false;
    if (this.loadSubsciption && !this.loadSubsciption.closed) {
      this.loadSubsciption.unsubscribe();
    }
    this.loadSubsciption = this._reporteService.getAllQueryReporte(this.start, this.pageSize, this.search, this.sortDesc, this.sortField, this.filterList)
      .subscribe(res => {
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
