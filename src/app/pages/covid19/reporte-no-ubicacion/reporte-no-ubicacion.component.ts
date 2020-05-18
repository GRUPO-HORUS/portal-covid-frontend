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
import {TipoPacienteService} from "./shared/tipo-paciente.service";

interface Catalogo {
  id: string;
  descripcion: string;
}

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
  tipoPacienteList: Catalogo[] = [];
  motivoIngresoList: Catalogo[] = [];
  filterList: string[] = [];
  advancedSearch: ReporteNoUbicacionSearch;

  constructor(private _reporteService: ReporteNoUbicacionService, private permission: PermissionGuardService, private datepipe: DatePipe, private _tipoPaciente : TipoPacienteService) { }

  ngOnInit() {
    this.init();
  }

  ngOnDestroy() {

  }

  init() {
    this.getTipoPacienteList();
    this.cols = [
      { field: 'nombreCompleto', header: 'Nombre', width: '25%' },
      { field: 'cedula', header: 'Cédula', width: '10%' },
      { field: 'telefono', header: 'Teléfono', width: '15%' },
      { field: 'tipoIngreso', header: 'Motivo de Ingreso', width: '15%' },
      { field: 'tipoPaciente', header: 'Tipo de Paciente', width: '15%' },
      { field: 'fechaUltimoReporte', header: 'Fecha Último Reporte', width: '25%', isDate: true, sort: false, fieldEntity: 'fechaUltimoReporteUbicacion' },
      { field: 'horasRetraso', header: 'Horas de Retraso', width: '15%', sort: false, fieldEntity: 'horasRetraso' },
      { field: '', header: 'Acción', width: '18%', isAction: true }
    ];
    this.resetAdvancedSearch();
    this.motivoIngresoList = [
      {id:'ingreso_pais',descripcion:'Viajeros que llegaron al País'},
      {id:'aislamiento_confirmado',descripcion:'Casos confirmados de COVID-19'},
      {id:'aislamiento_contacto',descripcion:'Contactos de casos confirmados de COVID-19'},
      {id:'caso_sospechoso',descripcion:'Caso sospechoso de COVID-19'},
      {id:'examen_laboratorio',descripcion:'Examen de Laboratorio de COVID-19'}
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
    }

    this.loadReporte();
  }

  onSearch() {
    this.filterList = [];
    this._op.visible = false;
    Object.keys(this.advancedSearch).forEach(property => {
      if(this.advancedSearch[property]) this.filterList.push(`${property}:${this.advancedSearch[property].id || this.advancedSearch[property]}`)
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

  private getTipoPacienteList() {
    let filterDebeReportarUbicacion = [];
    filterDebeReportarUbicacion.push(`debeReportarUbicacion:true`);

    this._tipoPaciente.getAll(null, filterDebeReportarUbicacion)
      .subscribe(res => {
        if(res.status === 200) {
          this.tipoPacienteList = res.body;
        }
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
