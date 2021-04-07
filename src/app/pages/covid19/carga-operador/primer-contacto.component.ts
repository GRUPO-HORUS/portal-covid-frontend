import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";

import {Subscription, combineLatest, EMPTY, Observable, of, Subject} from 'rxjs';
import {catchError, distinctUntilChanged, finalize, map, share, switchMap, takeUntil, tap, withLatestFrom} from 'rxjs/operators';
import {FieldInfo} from '../estado-salud/model/field-info';
import {ReporteSaludPacienteService} from '../estado-salud/shared/reporte-salud-paciente.service';
import { Covid19Service } from '../../../services/Covid19Service';

import {FormDatosBasicos} from '../model/formDatosBasicos.model';

import { FormGroup, Validators, FormBuilder } from "@angular/forms";

import { MatHorizontalStepper } from "@angular/material";
import { FirstTime } from "../estado-salud/model/first-time";

import {calendarEsLocale} from '../../../util/calendar-es-locale';
import { FichaPersonalBlanco } from "../model/fichaPersonalBlanco.model";
import { FormSeccionClasifRiesgo } from "../model/formSeccionClasifRiesgo.model";

import {HttpErrorResponse, HttpResponseBase} from '@angular/common/http';
import {Location} from '@angular/common';
import { FormCensoContacto } from "../model/formCensoContacto.model";

declare var $: any;
@Component({
  selector: "primer-contacto-selector",
  templateUrl: "./primer-contacto.component.html",
  //styleUrls: ['./primer-contacto.component.css'],
  providers: [Covid19Service]
})

export class PrimerContactoComponent implements OnInit {

  cedula$: Observable<string>;
  form$: Observable<FormGroup>;
  public loading: boolean;
  public mensaje: string;

  //Formulario
  public formDatosBasicos: FormDatosBasicos;

  //Datos del formulario 
  //public cedula: string;
  public email: string;
  public domicilio: string;
  public telefono: string;
  public telefValido: boolean = false;
  public terminos: boolean;
  public tipoDocumentoOptions=[{value:0,label:'Cédula de Identidad'},{value:1,label:'Pasaporte'}];
  public tipoDocumento: any;
  //public nombre: string;
  public apellido: string;
  public direccion: string;
  public codigo: string;

  //private subscription: Subscription;
  //public recentToken: string = ''
  //public recaptchaAvailable = false;
  fields$: Observable<FieldInfo[]>;

  public origen: string;
  public contrasenhaConfirm: string;

  public idRegistro: number;

  public tipoContactoOptions=[{value:'hogar',label:'Hogar'},
                              {value:'trabajo',label:'Lugar de trabajo'},{value:'comunidad',label:'Comunidad'},
                              {value:'centro_salud',label:'Centro de Salud'},{value:'otro',label:'Otro'}];

  public sexoOptions=[{value:'M',label:'Masculino'},{value:'F',label:'Femenino'}];

  public clasRiesgoOptions=[{value:'alto',label:'Alto'},{value:'moderado',label:'Moderado'},{value:'bajo',label:'Bajo'}];

  public profesionOptions =[{value:'medico',label:'Médico/a'}, {value:'enfermero',label:'Enfermero/a'}];

  public catContagioOptions=[{value:'1',label:'ASISTENCIA a paciente con COVID-19'},{value:'2',label:'ASISTENCIA a paciente con COVID-19 Pre-QCO'}, {value:'3',label:'ASISTENCIA en albergues/hotel salud'},
  {value:'4',label:'ASISTENCIA en penitenciaría'},{value:'5',label:'CONTACTO con Personal de Salud con COVID-19'},{value:'6',label:'CONTACTO con Persona con COVID-19'}, {value:'7',label:'VIAJERO'},
  {value:'8',label:'OTRO'}];

  public tipoRegistroOptions=[{value:'ingreso_pais',label:'Ingreso al país'},{value:'aislamiento',label:'Caso sospechoso Covid-19'}];

  /*public departamentoOptions=[{value:'Capital',label:'Capital'},
                              {value:'Concepción',label:'Concepción'},{value:'San Pedro',label:'San Pedro'},
                              {value:'Cordillera',label:'Cordillera'},{value:'Guairá',label:'Guairá'},
                              {value:'Caaguazú',label:'Caaguazú'},{value:'Caazapá',label:'Caazapá'},
                              {value:'Itapúa',label:'Itapúa'},{value:'Misiones',label:'Misiones'},
                              {value:'Paraguarí',label:'Paraguarí'},{value:'Alto Paraná',label:'Alto Paraná'},
                              {value:'Central',label:'Central'},{value:'Ñeembucú',label:'Ñeembucú'},
                              {value:'Amambay',label:'Amambay'},{value:'Canindeyú',label:'Canindeyú'},
                              {value:'Presidente Hayes',label:'Presidente Hayes'},{value:'Alto Paraguay',label:'Alto Paraguay'},
                              {value:'Boquerón',label:'Boquerón'}];*/

public departamentoOptions=[{id:1, nombre:'Concepción'},{id:2, nombre:'San Pedro'},
                              {id:3, nombre:'Cordillera'}, {id:4, nombre:'Guairá'},
                              {id:5, nombre:'Caaguazú'}, {id:6,nombre:'Caazapá'},
                              {id:7, nombre:'Itapúa'}, {id:8,nombre:'Misiones'},
                              {id:9, nombre:'Paraguarí'},{id:10, nombre:'Alto Paraná'},
                              {id:11, nombre:'Central'},{id:12, nombre:'Ñeembucú'},
                              {id:13, nombre:'Amambay'},{id:14, nombre:'Canindeyú'},
                              {id:15, nombre:'Presidente Hayes'}, {id:16, nombre:'Boquerón'},
                              {id:17, nombre:'Alto Paraguay'}, {id:18, nombre:'Capital'}];
  
public regionSanitariaOptions=[{value:'Capital',label:'Capital'},
                              {value:'Concepción',label:'Concepción'},{value:'San Pedro',label:'San Pedro'},
                              {value:'Cordillera',label:'Cordillera'},{value:'Guairá',label:'Guairá'},
                              {value:'Caaguazú',label:'Caaguazú'},{value:'Caazapá',label:'Caazapá'},
                              {value:'Itapúa',label:'Itapúa'},{value:'Misiones',label:'Misiones'},
                              {value:'Paraguarí',label:'Paraguarí'},{value:'Alto Paraná',label:'Alto Paraná'},
                              {value:'Central',label:'Central'},{value:'Ñeembucú',label:'Ñeembucú'},
                              {value:'Amambay',label:'Amambay'},{value:'Canindeyú',label:'Canindeyú'},
                              {value:'Presidente Hayes',label:'Presidente Hayes'},{value:'Alto Paraguay',label:'Alto Paraguay'},
                              {value:'Boquerón',label:'Boquerón'}];

  public ciudadOptions: any[];

  public recentToken: string = ''
  private subscription: Subscription;
  public recaptchaAvailable = false;

  public options: string;

  fechaHoy;
  //otroIndic=false;
  registroFg: FormGroup;
  clasificacionRiesgoFg: FormGroup;
  casoConfirmadoFg: FormGroup;
  monitoreoFg: FormGroup;

  nroDocumento;
  cargando;

  es = calendarEsLocale;

  cedulaPaciente;

  public rangoEdadOptions=[{value:'18-28',label:'18 a 28 años'}, {value:'29-39',label:'29 a 39 años'},{value:'40-50',label:'40 a 50 años'},{value:'51-61',label:'51 a 61 años'},
  {value:'>=62',label:'62 años y más'}];

  fallaSII: boolean = false;

  public regionesFiltradas: any[];

  public fichaPersonalBlanco;

  private saveClick$ = new Subject<void>();
  errores: any;
  private onDestroy$ = new Subject<void>();

  public ultimoReporteSalud;

  private updateClick$ = new Subject<void>();

  idFormCenso;
  primeraLlamada;
  fechaLlamada;

  formCensoContacto: FormCensoContacto;

  showConfirmarLlamada = false;

  public ciudadesOptions: any[];
  public ciudadesFiltradas: any[];
  public coddpto;

  constructor(
    private _router: Router,
    private service: Covid19Service,
    //private activeRoute: ActivatedRoute,
    private _route: ActivatedRoute,
    private _formBuilder: FormBuilder,
    private reporteSaludPacienteService: ReporteSaludPacienteService,
    private location: Location,
    private router: Router
  ) {
    this.loading = false;
    if (typeof localStorage !== "undefined") {
      localStorage.clear();
    }
  }
  //@ViewChild('stepper') stepper: MatHorizontalStepper;

  ngOnInit() {
    this.cedula$ = this._route.paramMap.pipe(
      map((paramMap: ParamMap) => paramMap.get('cedula')),
      distinctUntilChanged(),
    );

    this.fields$ = this.getForm();
    const firstTime$ = this.cedula$.pipe(
      switchMap(cedula => this.getPrimeraVez(cedula)),
    );

    this._route.params.subscribe(params => {
      this.cedulaPaciente = params["cedula"];
      this.idFormCenso = params["id"];
      this.obtenerDatosLlamada(this.idFormCenso);
      this.obtenerPaciente(this.cedulaPaciente);
    });
    
    /*this.form$ = combineLatest(this.fields$, firstTime$).pipe(
      map(([fields, firstTime]) => {
          const form = this._formBuilder.group(fields.reduce((obj, f) => {
            obj[f.fieldName] = [null];
            return obj;
          }, {}));
          form.addControl('esPrimeraVez', this._formBuilder.control(firstTime.esPrimeraVez));
          form.addControl('debeReportarFiebreAyer', this._formBuilder.control(firstTime.debeReportarFiebreAyer));
          return form;
      }),
      share(),
    );*/

    /*this.form$ = combineLatest(this.fields$, firstTime$).pipe(
      map(([fields, firstTime]) => {
          let form = this._formBuilder.group(fields.reduce((obj, f) => {
            obj[f.fieldName] = [null];
            return obj;
          }, {}));
          form.addControl('esPrimeraVez', this._formBuilder.control(firstTime.esPrimeraVez));
          form.addControl('debeReportarFiebreAyer', this._formBuilder.control(firstTime.debeReportarFiebreAyer));

          if(this.ultimoReporteSalud){
            //form.controls.comoTeSentis.setValue(this.ultimoReporteSalud.comoTeSentis);
            form.controls.signosSintomasDescritos.setValue(this.ultimoReporteSalud.signosSintomasDescritos);
            form.controls.signosSintomasDescritosB.setValue(this.ultimoReporteSalud.signosSintomasDescritosB);
            form.controls.congestionNasal.setValue(this.ultimoReporteSalud.congestionNasal);
            form.controls.secrecionNasal.setValue(this.ultimoReporteSalud.secrecionNasal);
            form.controls.dolorGarganta.setValue(this.ultimoReporteSalud.dolorGarganta);
            form.controls.tos.setValue(this.ultimoReporteSalud.tos);
            form.controls.percibeOlores.setValue(this.ultimoReporteSalud.percibeOlores);
            form.controls.percibeSabores.setValue(this.ultimoReporteSalud.percibeSabores);
            form.controls.dificultadRespirar.setValue(this.ultimoReporteSalud.dificultadRespirar);
            form.controls.sentisFiebre.setValue(this.ultimoReporteSalud.sentisFiebre);
            
            form.controls.temperatura.setValue(this.ultimoReporteSalud.temperatura);
            //form.controls.dolorCabeza.setValue(this.ultimoReporteSalud.dolorCabeza);
            //form.controls.sentisAngustia.setValue(this.ultimoReporteSalud.sentisAngustia);
            //form.controls.sentisTristeDesanimado.setValue(this.ultimoReporteSalud.sentisTristeDesanimado);
            //form.controls.otrosCansancios.setValue(this.ultimoReporteSalud.otrosCansancios);
            form.controls.diarrea.setValue(this.ultimoReporteSalud.diarrea);
            form.controls.mialgias.setValue(this.ultimoReporteSalud.mialgias);
            form.controls.dolorAbdominal.setValue(this.ultimoReporteSalud.dolorAbdominal);
            form.controls.testCovid.setValue(this.ultimoReporteSalud.testCovid);
            form.controls.embarazada.setValue(this.ultimoReporteSalud.embarazada);
            form.controls.enfermedadCondicion.setValue(this.ultimoReporteSalud.enfermedadCondicion);
            form.controls.cuidaEnfermos.setValue(this.ultimoReporteSalud.cuidaEnfermos);
            form.controls.viveConFlia.setValue(this.ultimoReporteSalud.viveConFlia);
            form.controls.acudirServicio.setValue(this.ultimoReporteSalud.acudirServicio);
            form.controls.ubicacionActual.setValue(this.ultimoReporteSalud.ubicacionActual);
          }
          return form;
      }),
      share(),
    );*/

    this.fechaHoy = new Date().toLocaleDateString('fr-CA');
    this.formDatosBasicos = new FormDatosBasicos();
    this.formDatosBasicos.tipoDocumento = 0;
    this.options="{types: ['(cities)'], componentRestrictions: { country: 'PY' }}"

    window.scrollTo(0, 0);

    this.registroFg = this._formBuilder.group({
      fechaInicioMonitoreo: [''],
      cedula: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      telefono: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      direccion: ['', Validators.required],
      sexo: ['', Validators.required],
      servicioSalud: ['', Validators.required],
      regionSanitaria: ['', Validators.required],
      profesion: ['', Validators.required],
      funcion: ['', Validators.required],
      otrosLugares: [[], Validators.required],
      reingreso: [null],
      fallecido: [null],
      edad:[0, Validators.required],
      rangoEdad:['', Validators.required],
      ciudadDomicilio:['', Validators.required],
      barrio:['', Validators.required],
      codPaciente:['', Validators.required],
      otroServicio:['']
    });

    this.casoConfirmadoFg = this._formBuilder.group({
      cedula: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      sexo: ['', Validators.required]
    });

    this.monitoreoFg = this._formBuilder.group({
      cedula: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required]
    });

    this.clasificacionRiesgoFg = this._formBuilder.group({
      fechaSintomas: ['', Validators.required],
      fechaExposicion: ['', Validators.required],
      clasRiesgo: ['', Validators.required],
      catContagio: ['', Validators.required],
      otroIndicEspecificar: [''],
      otroLabEspecificar: [''],
      otroClasifEspecificar: ['']
    });

    //this._route.params.subscribe(params => {this.formDatosBasicos.tipoInicio = params["tipoInicio"];});
     /*this.updateClick$
      .pipe(
        withLatestFrom(
          this.cedula$,
          this.form$,
        ),
        tap(([_, __, form]) => {
          form.markAsDirty();
          this.errores = null;
        }),
        switchMap(([_, cedula, form]) => this.update(cedula, form.value)),
        takeUntil(this.onDestroy$),
      ).subscribe(
      (r) => {
        if (r.ok) {
          this.mensaje = "Datos actualizados exitosamente!";
          this.openMessageDialogExito();
          //this.location.back();
        } else if (r.status === 400) {
          const response = <HttpErrorResponse>r;
          if (response.error.parameterViolations) {
            this.errores = response.error.parameterViolations.reduce((validation, currentValidation) =>  {
              const split = currentValidation.path.split(".");
              if (!validation[split[split.length - 1]]) {
                validation[split[split.length - 1]] = [];
              }
              validation[split[split.length - 1]].push(
                currentValidation.message
              );
              return validation;
            }, {});
          }
        }
      }
    );
    
      this.saveClick$
      .pipe(
        withLatestFrom(
          this.cedula$,
          this.form$,
        ),
        tap(([_, __, form]) => {
          form.markAsDirty();
          this.errores = null;
        }),
        switchMap(([_, cedula, form]) => this.save(cedula, form.value)),
        takeUntil(this.onDestroy$),
      ).subscribe(
      (r) => {
        if (r.ok) {
          this.mensaje = "Datos guardados exitosamente!";
          this.openMessageDialogExito();
          //this.location.back();
        } else if (r.status === 400) {
          const response = <HttpErrorResponse>r;
          if (response.error.parameterViolations) {
            this.errores = response.error.parameterViolations.reduce((validation, currentValidation) =>  {
              const split = currentValidation.path.split(".");
              if (!validation[split[split.length - 1]]) {
                validation[split[split.length - 1]] = [];
              }
              validation[split[split.length - 1]].push(
                currentValidation.message
              );
              return validation;
            }, {});
          }
        }
      }
    );*/
  }

  completarEstadoSalud(){
      this.cedula$ = this._route.paramMap.pipe(
        map((paramMap: ParamMap) => paramMap.get('cedula')),
        distinctUntilChanged(),
      );

      this.fields$ = this.getForm();
      const firstTime$ = this.cedula$.pipe(
        switchMap(cedula => this.getPrimeraVez(cedula)),
      );

      this.form$ = combineLatest(this.fields$, firstTime$).pipe(
        map(([fields, firstTime]) => {
            let form = this._formBuilder.group(fields.reduce((obj, f) => {
              obj[f.fieldName] = [null];
              return obj;
            }, {}));
            form.addControl('esPrimeraVez', this._formBuilder.control(firstTime.esPrimeraVez));
            form.addControl('debeReportarFiebreAyer', this._formBuilder.control(firstTime.debeReportarFiebreAyer));

            if(this.ultimoReporteSalud){
              //form.controls.comoTeSentis.setValue(this.ultimoReporteSalud.comoTeSentis);
              form.controls.signosSintomasDescritos.setValue(this.ultimoReporteSalud.signosSintomasDescritos);
              form.controls.signosSintomasDescritosB.setValue(this.ultimoReporteSalud.signosSintomasDescritosB);
              form.controls.congestionNasal.setValue(this.ultimoReporteSalud.congestionNasal);
              form.controls.secrecionNasal.setValue(this.ultimoReporteSalud.secrecionNasal);
              form.controls.dolorGarganta.setValue(this.ultimoReporteSalud.dolorGarganta);
              form.controls.tos.setValue(this.ultimoReporteSalud.tos);
              form.controls.percibeOlores.setValue(this.ultimoReporteSalud.percibeOlores);
              form.controls.percibeSabores.setValue(this.ultimoReporteSalud.percibeSabores);
              form.controls.dificultadRespirar.setValue(this.ultimoReporteSalud.dificultadRespirar);
              form.controls.sentisFiebre.setValue(this.ultimoReporteSalud.sentisFiebre);
              
              form.controls.temperatura.setValue(this.ultimoReporteSalud.temperatura);
              /*form.controls.dolorCabeza.setValue(this.ultimoReporteSalud.dolorCabeza);
              form.controls.sentisAngustia.setValue(this.ultimoReporteSalud.sentisAngustia);
              form.controls.sentisTristeDesanimado.setValue(this.ultimoReporteSalud.sentisTristeDesanimado);
              form.controls.otrosCansancios.setValue(this.ultimoReporteSalud.otrosCansancios);*/

              form.controls.diarrea.setValue(this.ultimoReporteSalud.diarrea);
              form.controls.mialgias.setValue(this.ultimoReporteSalud.mialgias);
              form.controls.dolorAbdominal.setValue(this.ultimoReporteSalud.dolorAbdominal);
              form.controls.testCovid.setValue(this.ultimoReporteSalud.testCovid);
              form.controls.embarazada.setValue(this.ultimoReporteSalud.embarazada);
              form.controls.enfermedadCondicion.setValue(this.ultimoReporteSalud.enfermedadCondicion);
              form.controls.cuidaEnfermos.setValue(this.ultimoReporteSalud.cuidaEnfermos);
              form.controls.viveConFlia.setValue(this.ultimoReporteSalud.viveConFlia);
              form.controls.acudirServicio.setValue(this.ultimoReporteSalud.acudirServicio);
              form.controls.ubicacionActual.setValue(this.ultimoReporteSalud.ubicacionActual);
            }
            return form;
        }),
        share(),
      );

      this.updateClick$
      .pipe(
        withLatestFrom(
          this.cedula$,
          this.form$,
        ),
        tap(([_, __, form]) => {
          form.markAsDirty();
          this.errores = null;
        }),
        switchMap(([_, cedula, form]) => this.update(cedula, form.value)),
        takeUntil(this.onDestroy$),
      ).subscribe(
      (r) => {
        if (r.ok) {
          this.mensaje = "Datos actualizados exitosamente!";
          this.openMessageDialogExito();
          //this.location.back();
        } else if (r.status === 400) {
          const response = <HttpErrorResponse>r;
          if (response.error.parameterViolations) {
            this.errores = response.error.parameterViolations.reduce((validation, currentValidation) =>  {
              const split = currentValidation.path.split(".");
              if (!validation[split[split.length - 1]]) {
                validation[split[split.length - 1]] = [];
              }
              validation[split[split.length - 1]].push(
                currentValidation.message
              );
              return validation;
            }, {});
          }
        }
      }
    );

    this.saveClick$
      .pipe(
        withLatestFrom(
          this.cedula$,
          this.form$,
        ),
        tap(([_, __, form]) => {
          form.markAsDirty();
          this.errores = null;
        }),
        switchMap(([_, cedula, form]) => this.save(cedula, form.value)),
        takeUntil(this.onDestroy$),
      ).subscribe(
      (r) => {
        if (r.ok) {
          this.mensaje = "Datos guardados exitosamente!";
          this.openMessageDialogExito();
          //this.location.back();
        } else if (r.status === 400) {
          const response = <HttpErrorResponse>r;
          if (response.error.parameterViolations) {
            this.errores = response.error.parameterViolations.reduce((validation, currentValidation) =>  {
              const split = currentValidation.path.split(".");
              if (!validation[split[split.length - 1]]) {
                validation[split[split.length - 1]] = [];
              }
              validation[split[split.length - 1]].push(
                currentValidation.message
              );
              return validation;
            }, {});
          }
        }
      }
    );
  }

  elegirRangoEdad(edad){
    if(edad >= 18 && edad <= 28){
      this.registroFg.controls.rangoEdad.setValue('18-28');
    }else if(edad >=29 && edad <= 39){
      this.registroFg.controls.rangoEdad.setValue('29-39');
    }else if(edad >= 40 && edad <= 50){
      this.registroFg.controls.rangoEdad.setValue('40-50');
    }else if(edad >= 51 && edad <= 61){
      this.registroFg.controls.rangoEdad.setValue('51-61');
    }else if(edad >= 62){
      this.registroFg.controls.rangoEdad.setValue('>=62');
    }
  }

  filtrarRegion(event) {
    let filtered : any[] = [];
    let query = event.query;
    for(let i = 0; i < this.departamentoOptions.length; i++) {
        let departamento = this.departamentoOptions[i];

        if (departamento.nombre.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
          filtered.push(departamento);
        }
    }
    this.regionesFiltradas = filtered;
  }

  selectDepto(event){
    this.registroFg.controls.ciudadDomicilio.setValue(null);
    this.registroFg.controls.barrio.setValue(null);
    this.coddpto ="";
    //console.log(event.id);
    if(event.id < 10){
      this.coddpto = '0'+event.id;
    }else{
      this.coddpto = event.id;
    }
    
    this.service.getDistritosDepto(this.coddpto).subscribe(distritos => {
      this.ciudadesOptions = distritos;
      for (let i = 0; i < distritos.length; i++) {
        let d = distritos[i];
        this.ciudadesOptions[i] = { nombre: d.nomdist, valor: d.coddist };
      }
    }, error => {
      console.log(error);
      this.mensaje = error.error;
      this.openMessageDialog();
    }
    );

    if(event.id ===18){
      this.coddpto = '00';
    }
  }

  filtrarCiudad(event) {
    let filtered : any[] = [];
    let query = event.query;
    for(let i = 0; i < this.ciudadesOptions.length; i++) {
        let distrito = this.ciudadesOptions[i];

        if (distrito.nombre.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
          filtered.push(distrito);
        }
    }
    
    this.ciudadesFiltradas = filtered;
  }

  obtenerDatosLlamada(id): void {
    this.service.getDatosLlamada(id).subscribe(response => {
      //console.log(response);
      this.loading = false;
      this.formCensoContacto = response;
      //this.buscarFormCensoContacto(this.formCensoContacto.primerContactoId)
        
    }, error => {
      console.log(error);
      this.loading = false;
      this.mensaje = error.error;
      this.openMessageDialog(); 
    });
  }

  obtenerPaciente(cedula): void {
    this.loading = true;
    this.formDatosBasicos = null;
    this.service.getPacienteEditarRealizarLlamada(cedula).subscribe(response => {
        console.log(response);
        this.loading = false;
        this.registroFg.controls.cedula.setValue(response.numeroDocumento);
        this.registroFg.controls.nombre.setValue(response.nombre);
        this.registroFg.controls.apellido.setValue(response.apellido);
        this.registroFg.controls.sexo.setValue(response.sexo);
        //this.registroFg.controls.fechaNacimiento.setValue(response.fechaNacimiento);

        if(response.fechaNacimiento){
          this.registroFg.controls.fechaNacimiento.setValue(response.fechaNacimiento.substring(8, 10)+'/'+
          response.fechaNacimiento.substring(5, 7)+'/'+response.fechaNacimiento.substring(0, 4));
        }

        if(response.fechaInicioMonitoreo){
          this.registroFg.controls.fechaInicioMonitoreo.setValue(response.fechaInicioMonitoreo.substring(8, 10)+'/'+
          response.fechaInicioMonitoreo.substring(5, 7)+'/'+response.fechaInicioMonitoreo.substring(0, 4));
        }
        //21/10/2018
        //this.setearFechasTabla(response.fechaInicioSintoma.substring(3, 5)+'/'+response.fechaInicioSintoma.substring(0, 2)+'/'+response.fechaInicioSintoma.substring(6, 10), 'inicio');
       
        this.registroFg.controls.direccion.setValue(response.direccionDomicilio);
        this.registroFg.controls.telefono.setValue(response.numeroCelular);
        this.registroFg.controls.edad.setValue(response.edad);
        this.registroFg.controls.rangoEdad.setValue(response.rangoEdad);
        this.registroFg.controls.ciudadDomicilio.setValue({nombre:response.ciudadDomicilio});
        this.registroFg.controls.barrio.setValue(response.barrio);
        this.registroFg.controls.regionSanitaria.setValue({nombre:response.regionSanitaria});

        console.log(response.reportes);
        if(response.reportes){
          //this.ultimoReporteSalud = response.reportes[response.reportes.length-1];
          this.ultimoReporteSalud = response.reportes;
        }

      }, error => {
        if(error.status == 401)
        {
          this._router.navigate(["/"]);
        }
        else
        {
          this.loading = false;
          this.mensaje = "No se encontró un paciente con este documento.";
          //this.response = null;
        }
      }
    );
  }

  actualizarDatosRealizarLlamada(band){
    this.loading = true;
    this.fichaPersonalBlanco = new FichaPersonalBlanco();
    this.fichaPersonalBlanco.formSeccionDatosBasicos = new FormDatosBasicos();
    this.fichaPersonalBlanco.formSeccionDatosBasicos.tipoDocumento = "Cédula de Identidad";
    this.fichaPersonalBlanco.formSeccionDatosBasicos.numeroDocumento = this.registroFg.controls.cedula.value;
    this.fichaPersonalBlanco.formSeccionDatosBasicos.nombre = this.registroFg.controls.nombre.value;
    this.fichaPersonalBlanco.formSeccionDatosBasicos.apellido = this.registroFg.controls.apellido.value;
    this.fichaPersonalBlanco.formSeccionDatosBasicos.sexo = this.registroFg.controls.sexo.value;
    this.fichaPersonalBlanco.formSeccionDatosBasicos.direccionDomicilio = this.registroFg.controls.direccion.value;
    this.fichaPersonalBlanco.formSeccionDatosBasicos.numeroCelular = this.registroFg.controls.telefono.value;
    this.fichaPersonalBlanco.formSeccionDatosBasicos.departamentoDomicilio = this.registroFg.controls.regionSanitaria.value.nombre;
    this.fichaPersonalBlanco.formSeccionDatosBasicos.ciudadDomicilio = this.registroFg.controls.ciudadDomicilio.value.nombre;
    this.fichaPersonalBlanco.formSeccionDatosBasicos.barrio = this.registroFg.controls.barrio.value;
    this.fichaPersonalBlanco.formSeccionDatosBasicos.edad = this.registroFg.controls.edad.value;
    this.fichaPersonalBlanco.formSeccionDatosBasicos.rangoEdad = this.registroFg.controls.rangoEdad.value;

    this.fichaPersonalBlanco.formSeccionClasifRiesgo = new FormSeccionClasifRiesgo();
    this.fichaPersonalBlanco.formSeccionClasifRiesgo.fechaInicioMonitoreo = this.registroFg.controls.fechaInicioMonitoreo.value;

    this.service.actualizarDatosRealizarLlamada(this.fichaPersonalBlanco).subscribe(response => {
      /*this.loading = false;
      this.mensaje = "Datos actualizados exitosamente!";
      this.openMessageDialogExito();*/
      if(this.ultimoReporteSalud){
        console.log("actualiza");
        this.updateClick$.next();
      }else{
        console.log("crea");
        this.saveClick$.next();
      }
      if(band=='si'){
        this.formCensoContacto.estadoPrimeraLlamada = "llamada_realizada";
        this.formCensoContacto.fechaHoraActualizacion = new Date().toLocaleString();
        this.service.editarFormCensoContacto(this.formCensoContacto).subscribe(response => {
        
        }, error => {
          this.loading = false;
          this.mensaje = error.error;
          this.openMessageDialog();
        });
      }
    }, error => {
        console.log(error);
        this.loading = false;
        this.mensaje = error.error;
        this.openMessageDialog(); 
    }
    );
  }

  openMessageDialogExito() {
    setTimeout(function() { $("#modalExito").modal("toggle"); }, 1000);
  }

  onChange(event){
    this.service.getCiudadesPorDepto(event.value).subscribe(ciudades => {
      this.ciudadOptions = ciudades;    
        for (let i = 0; i < ciudades.length; i++) {
          let c = ciudades[i];
          this.ciudadOptions[i] = { label: c.descripcion, value: c.idCiudad };
        }
         
    }, error => {
      console.log(error);
      this.mensaje = error.error;
      this.openMessageDialog();
        
    }
    );
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  registrar(formDatosBasicos): void {
    localStorage.setItem('tipoDocumento', formDatosBasicos.tipoDocumento);
    localStorage.setItem('numeroDocumento', formDatosBasicos.numeroDocumento);
    localStorage.setItem('nombre', formDatosBasicos.nombre);
    localStorage.setItem('apellido', formDatosBasicos.apellido);
    localStorage.setItem('numeroCelular', formDatosBasicos.numeroCelular);
    localStorage.setItem('direccion', formDatosBasicos.direccionDomicilio);
    localStorage.setItem('email', formDatosBasicos.correoElectronico);
    
      this.loading = true;
      this.service.guardarDatosBasicosOperador(formDatosBasicos).subscribe(response => {
          console.log(response);
          this.loading = false;
          this.mensaje = "Mensaje Enviado con Éxito";
          //localStorage.setItem('idRegistro', response);
          this.idRegistro = +response;

          this._router.navigate(["covid19/carga-operador/datos-clinicos/",this.idRegistro]);
          //this._router.navigate(["covid19/aislamiento/datos-paciente/"]);           
            
        }, error => {
          console.log(error);
          this.loading = false;
          this.mensaje = error.error;
          this.openMessageDialog();
            
        }
      );
  }

  getPrimeraVez(cedula: string): Observable<FirstTime>{
    return this.reporteSaludPacienteService.getFirstTime(cedula).pipe(
      catchError(err => {
        if (err.status === 401) {
          this.router.navigate(['/']);
        }
        throw err;
      }),
      share(),
    );
  }

  getForm(): Observable<FieldInfo[]> {
    return this.reporteSaludPacienteService.getForm().pipe(
      catchError(err => {
        if (err.status === 401) {
          this.router.navigate(['/']);
        }
        throw err;
      }),
      share(),
    );
  }

  onSaveClick() {
    this.saveClick$.next();
  }

  save(cedula, model): Observable<HttpResponseBase> {
    this.loading = true;

    return this.reporteSaludPacienteService.enviarReporteSalud(cedula, model)
      .pipe(
        catchError<HttpResponseBase, HttpResponseBase>((err) => {
          console.log('catchError', err);
          return of(err);
        }),
        finalize(() => {
          this.loading = false;
        }),
        share(),
      );
  }

  update(cedula, model): Observable<HttpResponseBase> {
    console.log("actualiza2");
    /*this.formCensoContacto.estadoPrimeraLlamada = "llamada_realizada";
    this.formCensoContacto.fechaHoraActualizacion = new Date().toLocaleString();
    this.service.editarFormCensoContacto(this.formCensoContacto).subscribe(response => {      
    }, error => {
        this.loading = false;
        this.mensaje = error.error;
        this.openMessageDialog();
    });*/

    this.loading = true;
    model.id = this.ultimoReporteSalud.id;
    model.timestampCreacion = this.ultimoReporteSalud.timestampCreacion;
    return this.reporteSaludPacienteService.actualizarReporteSalud(cedula, model, this.ultimoReporteSalud.registroFormulario)
      .pipe(
        catchError<HttpResponseBase, HttpResponseBase>((err) => {
          console.log('catchError', err);
          return of(err);
        }),
        finalize(() => {
          this.loading = false;
        }),
        share(),
      );
  }

  consultarIdentificaciones(event, band) {
    this.nroDocumento = event.target.value;
    //if(formDatosBasicos.tipoDocumento==0 && formDatosBasicos.numeroDocumento){
    if(this.nroDocumento){
      if(this.nroDocumento.includes('.'))
      {
        this.mensaje = 'La cédula no debe poseer puntos.';
        this.openMessageDialog();
      }
      else
      {
        this.loading = true;
        //formDatosBasicos.numeroDocumento=formDatosBasicos.numeroDocumento.trim();
        this.service.getIdentificacionesByNumeroDocumento(this.nroDocumento.trim()).subscribe(response => {
            this.loading = false;
            if(response.obtenerPersonaPorNroCedulaResponse.return.error)
            {
              this.mensaje = response.obtenerPersonaPorNroCedulaResponse.return.error;
              this.openMessageDialog();
            }
            else
            {
              if(band==='registro'){
                this.registroFg.controls.nombre.setValue(response.obtenerPersonaPorNroCedulaResponse.return.nombres);
                this.registroFg.controls.apellido.setValue(response.obtenerPersonaPorNroCedulaResponse.return.apellido);
                this.registroFg.controls.fechaNacimiento.setValue(response.obtenerPersonaPorNroCedulaResponse.return.fechNacim.substring(8, 10)+'/'+
                response.obtenerPersonaPorNroCedulaResponse.return.fechNacim.substring(5, 7)+'/'+
                response.obtenerPersonaPorNroCedulaResponse.return.fechNacim.substring(0, 4));
                this.registroFg.controls.sexo.setValue(response.obtenerPersonaPorNroCedulaResponse.return.sexo);
              }else if(band==='monitoreo'){

                this.monitoreoFg.controls.nombre.setValue(response.obtenerPersonaPorNroCedulaResponse.return.nombres);
                this.monitoreoFg.controls.apellido.setValue(response.obtenerPersonaPorNroCedulaResponse.return.apellido);
              }else{
                this.casoConfirmadoFg.controls.nombre.setValue(response.obtenerPersonaPorNroCedulaResponse.return.nombres);
                this.casoConfirmadoFg.controls.apellido.setValue(response.obtenerPersonaPorNroCedulaResponse.return.apellido);
                this.casoConfirmadoFg.controls.sexo.setValue(response.obtenerPersonaPorNroCedulaResponse.return.sexo);
              }
              
              /*formDatosBasicos.nombre=response.obtenerPersonaPorNroCedulaResponse.return.nombres;
              formDatosBasicos.apellido=response.obtenerPersonaPorNroCedulaResponse.return.apellido;
              formDatosBasicos.fechaNacimiento=response.obtenerPersonaPorNroCedulaResponse.return.fechNacim.substring(8, 10)+'/'+
                                                response.obtenerPersonaPorNroCedulaResponse.return.fechNacim.substring(5, 7)+'/'+
                                                response.obtenerPersonaPorNroCedulaResponse.return.fechNacim.substring(0, 4);*/
            }
        }, error => {
          if(error.status == 401){
            this._router.navigate(["/"]);
          }
          else{
            this.loading = false;
            //this.mensaje = error.error;
            this.mensaje = "No se pudieron obtener los datos del paciente.";
            this.openMessageDialog();
          }
        }
    );
      }
    }
  }

  avanzar(telefono: string): void {
    this.loading = true;
        this.service.sendMessage(telefono).subscribe(response => {
            if (response) {
              this.loading = false;
              this.mensaje = "Mensaje Enviado con Éxito";
              this.openMessageDialog();
            } else {
              this.loading = false;
              this.mensaje = "Fallo";
              this.openMessageDialog();

            }
          }, error => {
            this.loading = false;
            this.mensaje = "No se pudo procesar la operación!";
            this.openMessageDialog();
          }
        );
  }
  
  openMessageDialog() {
    setTimeout(function() { $("#miModal").modal("toggle"); }, 1000);
  }

  keyPress(event: any) { 
    const pattern = /[0-9\+\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (pattern.test(inputChar)) {
      this.telefValido = true;
    }else {
      this.telefValido = false;
    }
  }

}
