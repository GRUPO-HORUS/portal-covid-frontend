import {Component, OnDestroy, OnInit} from '@angular/core';
import {distinctUntilChanged, map, share, tap} from 'rxjs/operators';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {Observable, Subject} from 'rxjs';
import {calendarEsLocale} from '../../../util/calendar-es-locale';
import {FieldInfo} from '../historico-salud/shared/field-info';
import {ReporteSaludPacienteService} from '../historico-salud/shared/reporte-salud-paciente.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-actualizar-estado-salud',
  templateUrl: './actualizar-estado-salud.component.html',
  styleUrls: ['./actualizar-estado-salud.component.css']
})
export class ActualizarEstadoSaludComponent implements OnInit, OnDestroy {
  private cedula$: Observable<string>;

  readonly es = calendarEsLocale;

  fields$: Observable<FieldInfo[]>;
  private onDestroy$ = new Subject<void>();

  model: any;
  readonly smileyOptions = [
    {id: '1', descripcion: 'Muy poco'},
    {id: '2', descripcion: 'Poco'},
    {id: '3', descripcion: 'Ni mucho ni poco'},
    {id: '4', descripcion: 'Algo'},
    {id: '5', descripcion: 'Mucho'},
  ];

  constructor(
    private activeRoute: ActivatedRoute,
    private reporteSaludPacienteService: ReporteSaludPacienteService,
    private location: Location,
  ) {
  }

  ngOnInit() {
    this.cedula$ = this.activeRoute.paramMap.pipe(
      map((paramMap: ParamMap) => paramMap.get('cedula')),
      distinctUntilChanged(),
    );
    this.fields$ = this.getForm();

  }

  goBack() {
    this.location.back();
  }

  getForm(): Observable<FieldInfo[]> {
    return this.reporteSaludPacienteService.getForm().pipe(
      tap(fields => {
        this.model = fields.reduce((obj, f) => {
          obj[f.fieldName] = null;
          return obj;
        }, {});
      }),
      share(),
    );
  }

  ngOnDestroy(): void {
    this.onDestroy$.next();
    this.onDestroy$.complete();
  }

  showField(field: FieldInfo): boolean {
    return field.conditions ? field.conditions.map(
      c => this.model[c.fieldName] === c.fieldValue
    ).every(x => x) : true;
  }
}
