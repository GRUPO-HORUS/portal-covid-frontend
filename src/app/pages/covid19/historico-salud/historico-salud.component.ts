import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {distinctUntilChanged, map, share, startWith, switchMap, tap, withLatestFrom} from 'rxjs/operators';
import {BehaviorSubject, combineLatest, fromEvent, Observable, Subscription} from 'rxjs';
import {ReporteSaludPaciente} from './model/reporte-salud-paciente.model';
import {ReporteSaludPacienteService} from './shared/reporte-salud-paciente.service';
import {Message} from 'primeng/api';
import {ReporteNoUbicacionModel} from '../reporte-no-ubicacion/model/reporte-no-ubicacion.model';
import {ReporteNoUbicacionSearch} from '../reporte-no-ubicacion/model/reporte-no-ubicacion.search';
import {Table} from 'primeng/table';
import {PagedList} from './shared/paged-list';

@Component({
  selector: 'app-historico-salud',
  templateUrl: './historico-salud.component.html',
  styleUrls: ['./historico-salud.component.css']
})
export class HistoricoSaludComponent implements OnInit {

  @ViewChild('table') table: Table;

  msgs: Message[] = [];
  block: boolean;
  pageSize: number = 10;
  start: number = 0;
  search: string;
  totalRecords$: Observable<number>;
  loading = false;
  error = false;
  private loadSubsciption: Subscription;
  filterList: string[] = [];
  advancedSearch: ReporteNoUbicacionSearch;

  private cedula$: Observable<string>;
  historico$: Observable<ReporteSaludPaciente[]>;
  private load$: Observable<any>;
  start$: Observable<number>;
  backLink$: Observable<string>;
  private readonly backLinkBase = '/covid19/operador/toma-muestra-laboratorial/';

  cols = [
    { field: 'id', header: 'Id', width: '25%', sort: true, },
    { field: 'timestampCreacion', header: 'Fecha del reporte', width: '25%', sort: true, },
  ];

  constructor(
    private activeRoute: ActivatedRoute,
    private saludPacienteService: ReporteSaludPacienteService,
  ) { }

  ngOnInit() {
    this.cedula$ = this.activeRoute.paramMap.pipe(
      map((paramMap: ParamMap) => paramMap.get('cedula')),
      distinctUntilChanged(),
    );

    this.load$ = this.table.onLazyLoad.asObservable();

    this.start$ = this.load$.pipe(
      map(event => Number(event.first)/this.pageSize),
      startWith(0),
    );

    const httpCall$ = combineLatest(this.cedula$, this.load$).pipe(
      withLatestFrom(this.start$),
      switchMap(([[cedula, event], start]) => this.getHistorico(cedula, start, event.globalFilter, event.sortOrder === -1, event.sortField)),
      share(),
    );

    this.historico$ = httpCall$.pipe(
      map(paged => paged.list)
    );
    this.totalRecords$ = httpCall$.pipe(
      map(paged => paged.total),
      startWith(0)
    );

    this.backLink$ = this.cedula$.pipe(
      map(cedula => this.backLinkBase + cedula),
    );

  }


  private getHistorico(cedula: string, page: number, filter: any, sortDesc: boolean, sortField: string): Observable<PagedList<ReporteSaludPaciente>> {
    let filterList = [`cedula:${cedula}`];
    return this.saludPacienteService.getAll(page, this.pageSize, filter, sortDesc, sortField, filterList);
  }
}
