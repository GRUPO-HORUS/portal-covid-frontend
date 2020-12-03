import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription } from 'rxjs';
import { Covid19Service } from '../../../services/Covid19Service';

import {FormDatosBasicos} from '../model/formDatosBasicos.model';

import { ReCaptchaV3Service } from 'ng-recaptcha';
import { FormGroup, Validators, FormBuilder } from "@angular/forms";

import { MatHorizontalStepper } from "@angular/material";

import {calendarEsLocale} from '../../../util/calendar-es-locale';
import { FichaPersonalBlanco } from "../model/fichaPersonalBlanco.model";
import { FormSeccionClasifRiesgo } from "../model/formSeccionClasifRiesgo.model";
import { FormSeccionReporteSalud } from "../model/formSeccionReporteSalud.model";

declare var $: any;
@Component({
  selector: "actualizar-seguimiento-selector",
  templateUrl: "./actualizar-seguimiento.component.html",
  styleUrls: ['./ficha-monitoreo.component.css'],
  providers: [Covid19Service]
})

export class ActualizarSeguimientoComponent implements OnInit {

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
  //public recaptchaAvailable = false;

  public origen: string;
  public contrasenhaConfirm: string;

  public idRegistro: number;

  public sexoOptions=[{value:'M',label:'Masculino'},{value:'F',label:'Femenino'}];

  public clasRiesgoOptions=[{value:'alto',label:'Alto'},{value:'moderado',label:'Moderado'},{value:'bajo',label:'Bajo'}];

  public profesionOptions =[{value:'medico',label:'Médico/a'}, {value:'enfermero',label:'Enfermero/a'}];

  public catContagioOptions=[{value:'asistencia_paciente',label:'ASISTENCIA a paciente con COVID-19'},{value:'asistencia_paciente_preqco',label:'ASISTENCIA a paciente con COVID-19 Pre-QCO'}, {value:'asistencia_albergue',label:'ASISTENCIA en albergues/hotel salud'},
  {value:'asistencia_penitenciaria',label:'ASISTENCIA en penitenciaría'},{value:'contacto_personal_salud',label:'CONTACTO con Personal de Salud con COVID-19'},{value:'contacto_persona',label:'CONTACTO con Persona con COVID-19'}, {value:'viajero',label:'VIAJERO'},
  {value:'otro',label:'OTRO'}];

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
                              {value:'Boquerón',label:'Boquerón'}];
  
  public departamentoOptions=[{value:0,label:'ASUNCIÓN'}, {value:1,label:'CONCEPCIÓN'},
                              {value:2,label:'SAN PEDRO'},
                              {value:3,label:'CORDILLERA'},{value:4,label:'GUAIRÁ'},
                              {value:5,label:'CAAGUAZÚ'},{value:6,label:'CAAZAPÁ'},
                              {value:7,label:'ITAPÚA'},{value:8,label:'MISIONES'},
                              {value:9,label:'PARAGUARÍ'},{value:10,label:'ALTO PARANÁ'},
                              {value:11,label:'CENTRAL'},{value:12,label:'ÑEEMBUCÚ'},
                              {value:13,label:'AMAMBAY'},{value:14,label:'CANINDEYÚ'},
                              {value:15,label:'PRESIDENTE HAYES'},{value:16,label:'ALTO PARAGUAY'},
                              {value:17,label:'BOQUERÓN'}];*/
  
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

  // recaptcha
  public recentToken: string = ''
  private subscription: Subscription;

  public options: string;

  fechaHoy;
  //otroIndic=false;
  registroFg: FormGroup;
  clasificacionRiesgoFg: FormGroup;
  casoConfirmadoFg: FormGroup;
  monitoreoFg: FormGroup;

  nroDocumento;

  es = calendarEsLocale;

  idReporteSalud1;
  idReporteSalud2;
  idReporteSalud3;
  idReporteSalud4;
  idReporteSalud5;
  idReporteSalud6;
  idReporteSalud7;
  idReporteSalud8;
  idReporteSalud9;
  idReporteSalud10;
  idReporteSalud11;
  idReporteSalud12;
  idReporteSalud13;
  idReporteSalud14;

  idRegistroForm;

  fechaSelec1;
  fechaSelec2;
  fechaSelec3;
  fechaSelec4;
  fechaSelec5;
  fechaSelec6;
  fechaSelec7;
  fechaSelec8;
  fechaSelec9;
  fechaSelec10;
  fechaSelec11;
  fechaSelec12;
  fechaSelec13;
  fechaSelec14;

  public clasifFinalOptions=[{value:'descartado',label:'Descartado'},{value:'confirmado',label:'Confirmado'}];

  fichaPersonalBlanco: FichaPersonalBlanco;

  constructor(
    private _router: Router,
    private service: Covid19Service,
    private _route: ActivatedRoute,
    private recaptchaV3Service: ReCaptchaV3Service,
    private _formBuilder: FormBuilder
  ) {
    this.loading = false;
    if (typeof localStorage !== "undefined") {
      localStorage.clear();
    }
  }

  //@ViewChild('stepper') stepper: MatHorizontalStepper;

  ngOnInit() {
    this.fechaHoy = new Date().toLocaleDateString('fr-CA');
    this.formDatosBasicos = new FormDatosBasicos();

    this.formDatosBasicos.tipoDocumento = 0;

    this.options="{types: ['(cities)'], componentRestrictions: { country: 'PY' }}"

    window.scrollTo(0, 0);

    this.registroFg = this._formBuilder.group({
      fechaMonitoreo: [''],
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
      lugaresServicio: ['', Validators.required]
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
      apellido: ['', Validators.required],
      fechaSintomas: ['', Validators.required],
      fechaExposicion: ['', Validators.required],
      fecha1: ['', Validators.required],
      fecha2: ['', Validators.required],
      fecha3: ['', Validators.required],
      fecha4: ['', Validators.required],
      fecha5: ['', Validators.required],
      fecha6: ['', Validators.required],
      fecha7: ['', Validators.required],
      fecha8: ['', Validators.required],
      fecha9: ['', Validators.required],
      fecha10: ['', Validators.required],
      fecha11: ['', Validators.required],
      fecha12: ['', Validators.required],
      fecha13: ['', Validators.required],
      fecha14: ['', Validators.required],
      tos1: [null, Validators.required],
      tos2: [null, Validators.required],
      tos3: [null, Validators.required],
      tos4: [null, Validators.required],
      tos5: [null, Validators.required],
      tos6: [null, Validators.required],
      tos7: [null, Validators.required],
      tos8: [null, Validators.required],
      tos9: [null, Validators.required],
      tos10: [null, Validators.required],
      tos11: [null, Validators.required],
      tos12: [null, Validators.required],
      tos13: [null, Validators.required],
      tos14: [null, Validators.required],
      fiebre1: [null, Validators.required],
      fiebre2: [null, Validators.required],
      fiebre3: [null, Validators.required],
      fiebre4: [null, Validators.required],
      fiebre5: [null, Validators.required],
      fiebre6: [null, Validators.required],
      fiebre7: [null, Validators.required],
      fiebre8: [null, Validators.required],
      fiebre9: [null, Validators.required],
      fiebre10: [null, Validators.required],
      fiebre11: [null, Validators.required],
      fiebre12: [null, Validators.required],
      fiebre13: [null, Validators.required],
      fiebre14: [null, Validators.required],
      dolorGarganta1: [null, Validators.required],
      dolorGarganta2: [null, Validators.required],
      dolorGarganta3: [null, Validators.required],
      dolorGarganta4: [null, Validators.required],
      dolorGarganta5: [null, Validators.required],
      dolorGarganta6: [null, Validators.required],
      dolorGarganta7: [null, Validators.required],
      dolorGarganta8: [null, Validators.required],
      dolorGarganta9: [null, Validators.required],
      dolorGarganta10: [null, Validators.required],
      dolorGarganta11: [null, Validators.required],
      dolorGarganta12: [null, Validators.required],
      dolorGarganta13: [null, Validators.required],
      dolorGarganta14: [null, Validators.required],
      dolorCabeza1: [null, Validators.required],
      dolorCabeza2: [null, Validators.required],
      dolorCabeza3: [null, Validators.required],
      dolorCabeza4: [null, Validators.required],
      dolorCabeza5: [null, Validators.required],
      dolorCabeza6: [null, Validators.required],
      dolorCabeza7: [null, Validators.required],
      dolorCabeza8: [null, Validators.required],
      dolorCabeza9: [null, Validators.required],
      dolorCabeza10: [null, Validators.required],
      dolorCabeza11: [null, Validators.required],
      dolorCabeza12: [null, Validators.required],
      dolorCabeza13: [null, Validators.required],
      dolorCabeza14: [null, Validators.required],
      dificultadRespirar1: [null, Validators.required],
      dificultadRespirar2: [null, Validators.required],
      dificultadRespirar3: [null, Validators.required],
      dificultadRespirar4: [null, Validators.required],
      dificultadRespirar5: [null, Validators.required],
      dificultadRespirar6: [null, Validators.required],
      dificultadRespirar7: [null, Validators.required],
      dificultadRespirar8: [null, Validators.required],
      dificultadRespirar9: [null, Validators.required],
      dificultadRespirar10: [null, Validators.required],
      dificultadRespirar11: [null, Validators.required],
      dificultadRespirar12: [null, Validators.required],
      dificultadRespirar13: [null, Validators.required],
      dificultadRespirar14: [null, Validators.required],
      percibeOlores1: [null, Validators.required],
      percibeOlores2: [null, Validators.required],
      percibeOlores3: [null, Validators.required],
      percibeOlores4: [null, Validators.required],
      percibeOlores5: [null, Validators.required],
      percibeOlores6: [null, Validators.required],
      percibeOlores7: [null, Validators.required],
      percibeOlores8: [null, Validators.required],
      percibeOlores9: [null, Validators.required],
      percibeOlores10: [null, Validators.required],
      percibeOlores11: [null, Validators.required],
      percibeOlores12: [null, Validators.required],
      percibeOlores13: [null, Validators.required],
      percibeOlores14: [null, Validators.required],
      congestionNasal1: [null, Validators.required],
      congestionNasal2: [null, Validators.required],
      congestionNasal3: [null, Validators.required],
      congestionNasal4: [null, Validators.required],
      congestionNasal5: [null, Validators.required],
      congestionNasal6: [null, Validators.required],
      congestionNasal7: [null, Validators.required],
      congestionNasal8: [null, Validators.required],
      congestionNasal9: [null, Validators.required],
      congestionNasal10: [null, Validators.required],
      congestionNasal11: [null, Validators.required],
      congestionNasal12: [null, Validators.required],
      congestionNasal13: [null, Validators.required],
      congestionNasal14: [null, Validators.required],
      otrosCansancios1: [null, Validators.required],
      otrosCansancios2: [null, Validators.required],
      otrosCansancios3: [null, Validators.required],
      otrosCansancios4: [null, Validators.required],
      otrosCansancios5: [null, Validators.required],
      otrosCansancios6: [null, Validators.required],
      otrosCansancios7: [null, Validators.required],
      otrosCansancios8: [null, Validators.required],
      otrosCansancios9: [null, Validators.required],
      otrosCansancios10: [null, Validators.required],
      otrosCansancios11: [null, Validators.required],
      otrosCansancios12: [null, Validators.required],
      otrosCansancios13: [null, Validators.required],
      otrosCansancios14: [null, Validators.required]
    });

    this.clasificacionRiesgoFg = this._formBuilder.group({
      clasRiesgo: ['', Validators.required],
      catContagio: [''],
      clasifFinal:[''],
      otroIndicEspecificar: [''],
      exclusion: [null],
      autocontrol: [null],
      nada: [null],
      otroIndic: [null],
      antigeno: [null],
      pcr: [null]
    });
  }

  obtenerPaciente(cedula): void {
    this.loading = true;
    this.formDatosBasicos = null;
    this.service.getPacienteActualizarSeguimiento(cedula).subscribe(response => {
        this.loading = false;
        console.log(response);
        this.monitoreoFg.controls.cedula.setValue(cedula);
        this.monitoreoFg.controls.nombre.setValue(response.nombre);
        this.monitoreoFg.controls.apellido.setValue(response.apellido);
        //this.registroFg.controls.fechaNacimiento.setValue(response.fechaNacimiento.substring(8, 10)+'/'+response.fechaNacimiento.substring(5, 7)+'/'+response.fechaNacimiento.substring(0, 4));
        //this.monitoreoFg.controls.fechaSintomas.setValue(response.fechaInicioSintoma);
        this.monitoreoFg.controls.fechaSintomas.setValue(response.fechaInicioSintoma.substring(8, 10)+'/'+
        response.fechaInicioSintoma.substring(5, 7)+'/'+response.fechaInicioSintoma.substring(0, 4)); 
        this.monitoreoFg.controls.fechaExposicion.setValue(response.fechaExposicion.substring(8, 10)+'/'+
        response.fechaExposicion.substring(5, 7)+'/'+response.fechaExposicion.substring(0, 4));

        this.setearFechasTabla(response.fechaInicioSintoma.substring(5, 7)+'/'+
                response.fechaInicioSintoma.substring(8, 10)+'/'+response.fechaInicioSintoma.substring(0, 4), 'inicio');

        this.idRegistroForm = response.reportes[0].registroFormulario;

        //let reportesOrd = response.reportes.sort((a,b)=>(a.fecha < b.fecha ? -1:1));
        this.idReporteSalud1 = response.reportes[0].id;
        this.monitoreoFg.controls.tos1.setValue(response.reportes[0].tos ==null ? null : response.reportes[0].tos == 'true');
        this.monitoreoFg.controls.fiebre1.setValue(response.reportes[0].sentisFiebre ==null ? null : response.reportes[0].sentisFiebre == 'true');
        this.monitoreoFg.controls.dolorCabeza1.setValue(response.reportes[0].dolorCabeza ==null ? null : response.reportes[0].dolorCabeza == 'true');
        this.monitoreoFg.controls.dolorGarganta1.setValue(response.reportes[0].dolorGarganta ==null ? null : response.reportes[0].dolorGarganta == 'true');
        this.monitoreoFg.controls.dificultadRespirar1.setValue(response.reportes[0].dificultadRespirar ==null ? null : response.reportes[0].dificultadRespirar == 'true');
        this.monitoreoFg.controls.percibeOlores1.setValue(response.reportes[0].percibeOlores ==null ? null : response.reportes[0].percibeOlores == 'true');
        this.monitoreoFg.controls.congestionNasal1.setValue(response.reportes[0].congestionNasal ==null ? null : response.reportes[0].congestionNasal == 'true');
        this.monitoreoFg.controls.otrosCansancios1.setValue(response.reportes[0].otrosCansancios ==null ? null : response.reportes[0].otrosCansancios == 'true');

        this.idReporteSalud2 = response.reportes[1].id;
        this.monitoreoFg.controls.tos2.setValue(response.reportes[1].tos ==null ? null : response.reportes[1].tos == 'true');
        this.monitoreoFg.controls.fiebre2.setValue(response.reportes[1].sentisFiebre ==null ? null : response.reportes[1].sentisFiebre == 'true');
        this.monitoreoFg.controls.dolorCabeza2.setValue(response.reportes[1].dolorCabeza ==null ? null : response.reportes[1].dolorCabeza == 'true');
        this.monitoreoFg.controls.dolorGarganta2.setValue(response.reportes[1].dolorGarganta ==null ? null : response.reportes[1].dolorGarganta == 'true');
        this.monitoreoFg.controls.dificultadRespirar2.setValue(response.reportes[1].dificultadRespirar ==null ? null : response.reportes[1].dificultadRespirar == 'true');
        this.monitoreoFg.controls.percibeOlores2.setValue(response.reportes[1].percibeOlores ==null ? null : response.reportes[1].percibeOlores == 'true');
        this.monitoreoFg.controls.congestionNasal2.setValue(response.reportes[1].congestionNasal ==null ? null : response.reportes[1].congestionNasal == 'true');
        this.monitoreoFg.controls.otrosCansancios2.setValue(response.reportes[1].otrosCansancios ==null ? null : response.reportes[1].otrosCansancios == 'true');

        this.idReporteSalud3 = response.reportes[2].id;
        this.monitoreoFg.controls.tos3.setValue(response.reportes[2].tos ==null ? null : response.reportes[2].tos == 'true');
        this.monitoreoFg.controls.fiebre3.setValue(response.reportes[2].sentisFiebre ==null ? null : response.reportes[2].sentisFiebre == 'true');
        this.monitoreoFg.controls.dolorCabeza3.setValue(response.reportes[2].dolorCabeza ==null ? null : response.reportes[2].dolorCabeza == 'true');
        this.monitoreoFg.controls.dolorGarganta3.setValue(response.reportes[2].dolorGarganta ==null ? null : response.reportes[2].dolorGarganta == 'true');
        this.monitoreoFg.controls.dificultadRespirar3.setValue(response.reportes[2].dificultadRespirar ==null ? null : response.reportes[2].dificultadRespirar == 'true');
        this.monitoreoFg.controls.percibeOlores13.setValue(response.reportes[2].percibeOlores ==null ? null : response.reportes[2].percibeOlores == 'true');
        this.monitoreoFg.controls.congestionNasal3.setValue(response.reportes[2].congestionNasal ==null ? null : response.reportes[2].congestionNasal == 'true');
        this.monitoreoFg.controls.otrosCansancios3.setValue(response.reportes[2].otrosCansancios ==null ? null : response.reportes[2].otrosCansancios == 'true');

        this.idReporteSalud4 = response.reportes[3].id;
        this.monitoreoFg.controls.tos4.setValue(response.reportes[3].tos ==null ? null : response.reportes[3].tos == 'true');
        this.monitoreoFg.controls.fiebre4.setValue(response.reportes[3].sentisFiebre ==null ? null : response.reportes[3].sentisFiebre == 'true');
        this.monitoreoFg.controls.dolorCabeza4.setValue(response.reportes[3].dolorCabeza ==null ? null : response.reportes[3].dolorCabeza == 'true');
        this.monitoreoFg.controls.dolorGarganta4.setValue(response.reportes[3].dolorGarganta ==null ? null : response.reportes[3].dolorGarganta == 'true');
        this.monitoreoFg.controls.dificultadRespirar4.setValue(response.reportes[3].dificultadRespirar ==null ? null : response.reportes[3].dificultadRespirar == 'true');
        this.monitoreoFg.controls.percibeOlores4.setValue(response.reportes[3].percibeOlores ==null ? null : response.reportes[3].percibeOlores == 'true');
        this.monitoreoFg.controls.congestionNasal4.setValue(response.reportes[3].congestionNasal ==null ? null : response.reportes[3].congestionNasal == 'true');
        this.monitoreoFg.controls.otrosCansancios4.setValue(response.reportes[3].otrosCansancios ==null ? null : response.reportes[3].otrosCansancios == 'true');

        this.idReporteSalud5 = response.reportes[4].id;
        this.monitoreoFg.controls.tos5.setValue(response.reportes[4].tos ==null ? null : response.reportes[4].tos == 'true');
        this.monitoreoFg.controls.fiebre5.setValue(response.reportes[4].sentisFiebre ==null ? null : response.reportes[4].sentisFiebre == 'true');
        this.monitoreoFg.controls.dolorCabeza5.setValue(response.reportes[4].dolorCabeza ==null ? null : response.reportes[4].dolorCabeza == 'true');
        this.monitoreoFg.controls.dolorGarganta5.setValue(response.reportes[4].dolorGarganta ==null ? null : response.reportes[4].dolorGarganta == 'true');
        this.monitoreoFg.controls.dificultadRespirar5.setValue(response.reportes[4].dificultadRespirar ==null ? null : response.reportes[4].dificultadRespirar == 'true');
        this.monitoreoFg.controls.percibeOlores5.setValue(response.reportes[4].percibeOlores ==null ? null : response.reportes[4].percibeOlores == 'true');
        this.monitoreoFg.controls.congestionNasal5.setValue(response.reportes[4].congestionNasal ==null ? null : response.reportes[4].congestionNasal == 'true');
        this.monitoreoFg.controls.otrosCansancios5.setValue(response.reportes[4].otrosCansancios ==null ? null : response.reportes[4].otrosCansancios == 'true');

        this.idReporteSalud6 = response.reportes[5].id;
        this.monitoreoFg.controls.tos6.setValue(response.reportes[5].tos ==null ? null : response.reportes[5].tos == 'true');
        this.monitoreoFg.controls.fiebre6.setValue(response.reportes[5].sentisFiebre ==null ? null : response.reportes[5].sentisFiebre == 'true');
        this.monitoreoFg.controls.dolorCabeza6.setValue(response.reportes[5].dolorCabeza ==null ? null : response.reportes[5].dolorCabeza == 'true');
        this.monitoreoFg.controls.dolorGarganta6.setValue(response.reportes[5].dolorGarganta ==null ? null : response.reportes[5].dolorGarganta == 'true');
        this.monitoreoFg.controls.dificultadRespirar6.setValue(response.reportes[5].dificultadRespirar ==null ? null : response.reportes[5].dificultadRespirar == 'true');
        this.monitoreoFg.controls.percibeOlores6.setValue(response.reportes[5].percibeOlores ==null ? null : response.reportes[5].percibeOlores == 'true');
        this.monitoreoFg.controls.congestionNasal6.setValue(response.reportes[5].congestionNasal ==null ? null : response.reportes[5].congestionNasal == 'true');
        this.monitoreoFg.controls.otrosCansancios6.setValue(response.reportes[5].otrosCansancios ==null ? null : response.reportes[5].otrosCansancios == 'true');

        this.idReporteSalud7 = response.reportes[6].id;
        this.monitoreoFg.controls.tos7.setValue(response.reportes[6].tos ==null ? null : response.reportes[6].tos == 'true');
        this.monitoreoFg.controls.fiebre7.setValue(response.reportes[6].sentisFiebre ==null ? null : response.reportes[6].sentisFiebre == 'true');
        this.monitoreoFg.controls.dolorCabeza7.setValue(response.reportes[6].dolorCabeza ==null ? null : response.reportes[6].dolorCabeza == 'true');
        this.monitoreoFg.controls.dolorGarganta7.setValue(response.reportes[6].dolorGarganta ==null ? null : response.reportes[6].dolorGarganta == 'true');
        this.monitoreoFg.controls.dificultadRespirar7.setValue(response.reportes[6].dificultadRespirar ==null ? null : response.reportes[6].dificultadRespirar == 'true');
        this.monitoreoFg.controls.percibeOlores7.setValue(response.reportes[6].percibeOlores ==null ? null : response.reportes[6].percibeOlores == 'true');
        this.monitoreoFg.controls.congestionNasal7.setValue(response.reportes[6].congestionNasal ==null ? null : response.reportes[6].congestionNasal == 'true');
        this.monitoreoFg.controls.otrosCansancios7.setValue(response.reportes[6].otrosCansancios ==null ? null : response.reportes[6].otrosCansancios == 'true');

        this.idReporteSalud8 = response.reportes[7].id;
        this.monitoreoFg.controls.tos8.setValue(response.reportes[7].tos ==null ? null : response.reportes[7].tos == 'true');
        this.monitoreoFg.controls.fiebre8.setValue(response.reportes[7].sentisFiebre ==null ? null : response.reportes[7].sentisFiebre == 'true');
        this.monitoreoFg.controls.dolorCabeza8.setValue(response.reportes[7].dolorCabeza ==null ? null : response.reportes[7].dolorCabeza == 'true');
        this.monitoreoFg.controls.dolorGarganta8.setValue(response.reportes[7].dolorGarganta ==null ? null : response.reportes[7].dolorGarganta == 'true');
        this.monitoreoFg.controls.dificultadRespirar8.setValue(response.reportes[7].dificultadRespirar ==null ? null : response.reportes[7].dificultadRespirar == 'true');
        this.monitoreoFg.controls.percibeOlores8.setValue(response.reportes[7].percibeOlores ==null ? null : response.reportes[7].percibeOlores == 'true');
        this.monitoreoFg.controls.congestionNasal8.setValue(response.reportes[7].congestionNasal ==null ? null : response.reportes[7].congestionNasal == 'true');
        this.monitoreoFg.controls.otrosCansancios8.setValue(response.reportes[7].otrosCansancios ==null ? null : response.reportes[7].otrosCansancios == 'true');

        this.idReporteSalud9 = response.reportes[8].id;
        this.monitoreoFg.controls.tos9.setValue(response.reportes[8].tos ==null ? null : response.reportes[8].tos == 'true');
        this.monitoreoFg.controls.fiebre9.setValue(response.reportes[8].sentisFiebre ==null ? null : response.reportes[8].sentisFiebre == 'true');
        this.monitoreoFg.controls.dolorCabeza9.setValue(response.reportes[8].dolorCabeza ==null ? null : response.reportes[8].dolorCabeza == 'true');
        this.monitoreoFg.controls.dolorGarganta9.setValue(response.reportes[8].dolorGarganta ==null ? null : response.reportes[8].dolorGarganta == 'true');
        this.monitoreoFg.controls.dificultadRespirar9.setValue(response.reportes[8].dificultadRespirar ==null ? null : response.reportes[8].dificultadRespirar == 'true');
        this.monitoreoFg.controls.percibeOlores9.setValue(response.reportes[8].percibeOlores ==null ? null : response.reportes[8].percibeOlores == 'true');
        this.monitoreoFg.controls.congestionNasal9.setValue(response.reportes[8].congestionNasal ==null ? null : response.reportes[8].congestionNasal == 'true');
        this.monitoreoFg.controls.otrosCansancios9.setValue(response.reportes[8].otrosCansancios ==null ? null : response.reportes[8].otrosCansancios == 'true');

        this.idReporteSalud10 = response.reportes[9].id;
        this.monitoreoFg.controls.tos10.setValue(response.reportes[9].tos ==null ? null : response.reportes[9].tos == 'true');
        this.monitoreoFg.controls.fiebre10.setValue(response.reportes[9].sentisFiebre ==null ? null : response.reportes[9].sentisFiebre == 'true');
        this.monitoreoFg.controls.dolorCabeza10.setValue(response.reportes[9].dolorCabeza ==null ? null : response.reportes[9].dolorCabeza == 'true');
        this.monitoreoFg.controls.dolorGarganta10.setValue(response.reportes[9].dolorGarganta ==null ? null : response.reportes[9].dolorGarganta == 'true');
        this.monitoreoFg.controls.dificultadRespirar10.setValue(response.reportes[9].dificultadRespirar ==null ? null : response.reportes[9].dificultadRespirar == 'true');
        this.monitoreoFg.controls.percibeOlores10.setValue(response.reportes[9].percibeOlores ==null ? null : response.reportes[9].percibeOlores == 'true');
        this.monitoreoFg.controls.congestionNasal10.setValue(response.reportes[9].congestionNasal ==null ? null : response.reportes[9].congestionNasal == 'true');
        this.monitoreoFg.controls.otrosCansancios10.setValue(response.reportes[9].otrosCansancios ==null ? null : response.reportes[9].otrosCansancios == 'true');

        this.idReporteSalud11 = response.reportes[10].id;
        this.monitoreoFg.controls.tos11.setValue(response.reportes[10].tos ==null ? null : response.reportes[10].tos == 'true');
        this.monitoreoFg.controls.fiebre11.setValue(response.reportes[10].sentisFiebre ==null ? null : response.reportes[10].sentisFiebre == 'true');
        this.monitoreoFg.controls.dolorCabeza11.setValue(response.reportes[10].dolorCabeza ==null ? null : response.reportes[10].dolorCabeza == 'true');
        this.monitoreoFg.controls.dolorGarganta11.setValue(response.reportes[10].dolorGarganta ==null ? null : response.reportes[10].dolorGarganta == 'true');
        this.monitoreoFg.controls.dificultadRespirar11.setValue(response.reportes[10].dificultadRespirar ==null ? null : response.reportes[10].dificultadRespirar == 'true');
        this.monitoreoFg.controls.percibeOlores11.setValue(response.reportes[10].percibeOlores ==null ? null : response.reportes[10].percibeOlores == 'true');
        this.monitoreoFg.controls.congestionNasal11.setValue(response.reportes[10].congestionNasal ==null ? null : response.reportes[10].congestionNasal == 'true');
        this.monitoreoFg.controls.otrosCansancios11.setValue(response.reportes[10].otrosCansancios ==null ? null : response.reportes[10].otrosCansancios == 'true');

        this.idReporteSalud12 = response.reportes[11].id;
        this.monitoreoFg.controls.tos12.setValue(response.reportes[11].tos ==null ? null : response.reportes[11].tos == 'true');
        this.monitoreoFg.controls.fiebre12.setValue(response.reportes[11].sentisFiebre ==null ? null : response.reportes[11].sentisFiebre == 'true');
        this.monitoreoFg.controls.dolorCabeza12.setValue(response.reportes[11].dolorCabeza ==null ? null : response.reportes[11].dolorCabeza == 'true');
        this.monitoreoFg.controls.dolorGarganta12.setValue(response.reportes[11].dolorGarganta ==null ? null : response.reportes[11].dolorGarganta == 'true');
        this.monitoreoFg.controls.dificultadRespirar12.setValue(response.reportes[11].dificultadRespirar ==null ? null : response.reportes[11].dificultadRespirar == 'true');
        this.monitoreoFg.controls.percibeOlores12.setValue(response.reportes[11].percibeOlores ==null ? null : response.reportes[11].percibeOlores == 'true');
        this.monitoreoFg.controls.congestionNasal12.setValue(response.reportes[11].congestionNasal ==null ? null : response.reportes[11].congestionNasal == 'true');
        this.monitoreoFg.controls.otrosCansancios12.setValue(response.reportes[11].otrosCansancios ==null ? null : response.reportes[11].otrosCansancios == 'true');

        this.idReporteSalud13 = response.reportes[12].id;
        this.monitoreoFg.controls.tos13.setValue(response.reportes[12].tos ==null ? null : response.reportes[12].tos == 'true');
        this.monitoreoFg.controls.fiebre13.setValue(response.reportes[12].sentisFiebre ==null ? null : response.reportes[12].sentisFiebre == 'true');
        this.monitoreoFg.controls.dolorCabeza13.setValue(response.reportes[12].dolorCabeza ==null ? null : response.reportes[12].dolorCabeza == 'true');
        this.monitoreoFg.controls.dolorGarganta13.setValue(response.reportes[12].dolorGarganta ==null ? null : response.reportes[12].dolorGarganta == 'true');
        this.monitoreoFg.controls.dificultadRespirar13.setValue(response.reportes[12].dificultadRespirar ==null ? null : response.reportes[12].dificultadRespirar == 'true');
        this.monitoreoFg.controls.percibeOlores13.setValue(response.reportes[12].percibeOlores ==null ? null : response.reportes[12].percibeOlores == 'true');
        this.monitoreoFg.controls.congestionNasal13.setValue(response.reportes[12].congestionNasal ==null ? null : response.reportes[12].congestionNasal == 'true');
        this.monitoreoFg.controls.otrosCansancios13.setValue(response.reportes[12].otrosCansancios ==null ? null : response.reportes[12].otrosCansancios == 'true');

        this.idReporteSalud14 = response.reportes[13].id;
        this.monitoreoFg.controls.tos14.setValue(response.reportes[13].tos ==null ? null : response.reportes[13].tos == 'true');
        this.monitoreoFg.controls.fiebre14.setValue(response.reportes[13].sentisFiebre ==null ? null : response.reportes[13].sentisFiebre == 'true');
        this.monitoreoFg.controls.dolorCabeza14.setValue(response.reportes[13].dolorCabeza ==null ? null : response.reportes[13].dolorCabeza == 'true');
        this.monitoreoFg.controls.dolorGarganta14.setValue(response.reportes[13].dolorGarganta ==null ? null : response.reportes[13].dolorGarganta == 'true');
        this.monitoreoFg.controls.dificultadRespirar14.setValue(response.reportes[13].dificultadRespirar ==null ? null : response.reportes[13].dificultadRespirar == 'true');
        this.monitoreoFg.controls.percibeOlores14.setValue(response.reportes[13].percibeOlores ==null ? null : response.reportes[13].percibeOlores == 'true');
        this.monitoreoFg.controls.congestionNasal14.setValue(response.reportes[13].congestionNasal ==null ? null : response.reportes[13].congestionNasal == 'true');
        this.monitoreoFg.controls.otrosCansancios14.setValue(response.reportes[13].otrosCansancios ==null ? null : response.reportes[13].otrosCansancios == 'true');

        this.clasificacionRiesgoFg.controls.clasRiesgo.setValue(response.clasificacionRiesgo);
        this.clasificacionRiesgoFg.controls.catContagio.setValue(response.categoriaContagio);
        this.clasificacionRiesgoFg.controls.exclusion.setValue(response.trabajoExclusion);
        this.clasificacionRiesgoFg.controls.autocontrol.setValue(response.trabajoAutocontrol);
        this.clasificacionRiesgoFg.controls.nada.setValue(response.trabajoNada);
        this.clasificacionRiesgoFg.controls.otroIndic.setValue(response.trabajoOtro);
        this.clasificacionRiesgoFg.controls.otroIndicEspecificar.setValue(response.trabajoOtroDescripcion);
        this.clasificacionRiesgoFg.controls.antigeno.setValue(response.laboratorioAntigeno);
        this.clasificacionRiesgoFg.controls.pcr.setValue(response.laboratorioPcr);
        this.clasificacionRiesgoFg.controls.clasifFinal.setValue(response.clasificacionFinal);
        //this.response = response;
        this.mensaje= null;
    }, error => {
      if(error.status == 401)
      {
        this._router.navigate(["/"]);
      }
      else
      {
        this.loading = false;
        this.mensaje = "No se encontró un paciente con este identificador";
        //this.response = null;
      }
      //this.openMessageDialog();

    }
  );
  }

  verifOtroIndicEspecificar(){
    if(!this.clasificacionRiesgoFg.controls.otroIndic.value){
      this.clasificacionRiesgoFg.controls.otroIndicEspecificar.setValue('');
    }
  }

  actualizarSeguimiento(): void {
    this.loading = true;
    this.fichaPersonalBlanco = new FichaPersonalBlanco();

    this.fichaPersonalBlanco.formSeccionDatosBasicos = new FormDatosBasicos();
    this.fichaPersonalBlanco.formSeccionDatosBasicos.numeroDocumento = this.monitoreoFg.controls.cedula.value;

    this.fichaPersonalBlanco.reportesSalud = [];
    let reporteSalud1 = new FormSeccionReporteSalud();
    reporteSalud1.id = this.idReporteSalud1;
    reporteSalud1.fecha = this.fechaSelec1;
    console.log(reporteSalud1.fecha);
    reporteSalud1.tos = this.monitoreoFg.controls.tos1.value;
    reporteSalud1.dolorGarganta = this.monitoreoFg.controls.dolorGarganta1.value;
    reporteSalud1.dolorCabeza = this.monitoreoFg.controls.dolorCabeza1.value;
    reporteSalud1.dificultadRespirar = this.monitoreoFg.controls.dificultadRespirar1.value;
    reporteSalud1.percibeOlores = this.monitoreoFg.controls.percibeOlores1.value;
    reporteSalud1.sentisFiebre = this.monitoreoFg.controls.fiebre1.value;
    reporteSalud1.congestionNasal = this.monitoreoFg.controls.congestionNasal1.value;
    reporteSalud1.otrosCansancios = this.monitoreoFg.controls.otrosCansancios1.value;
    this.fichaPersonalBlanco.reportesSalud.push(reporteSalud1);

    let reporteSalud2 = new FormSeccionReporteSalud();
    reporteSalud2.id = this.idReporteSalud2;
    reporteSalud2.fecha = this.fechaSelec2;
    reporteSalud2.tos = this.monitoreoFg.controls.tos2.value;
    reporteSalud2.dolorGarganta = this.monitoreoFg.controls.dolorGarganta2.value;
    reporteSalud2.dolorCabeza = this.monitoreoFg.controls.dolorCabeza2.value;
    reporteSalud2.dificultadRespirar = this.monitoreoFg.controls.dificultadRespirar2.value;
    reporteSalud2.percibeOlores = this.monitoreoFg.controls.percibeOlores2.value;
    reporteSalud2.sentisFiebre = this.monitoreoFg.controls.fiebre2.value;
    reporteSalud2.congestionNasal = this.monitoreoFg.controls.congestionNasal2.value;
    reporteSalud2.otrosCansancios = this.monitoreoFg.controls.otrosCansancios2.value;
    this.fichaPersonalBlanco.reportesSalud.push(reporteSalud2);

    let reporteSalud3 = new FormSeccionReporteSalud();
    reporteSalud3.id = this.idReporteSalud3;
    reporteSalud3.fecha = this.fechaSelec3;
    //reporteSalud3.fecha = this.monitoreoFg.controls.fecha3.value;
    reporteSalud3.tos = this.monitoreoFg.controls.tos3.value;
    reporteSalud3.dolorGarganta = this.monitoreoFg.controls.dolorGarganta3.value;
    reporteSalud3.dolorCabeza = this.monitoreoFg.controls.dolorCabeza3.value;
    reporteSalud3.dificultadRespirar = this.monitoreoFg.controls.dificultadRespirar3.value;
    reporteSalud3.percibeOlores = this.monitoreoFg.controls.percibeOlores3.value;
    reporteSalud3.sentisFiebre = this.monitoreoFg.controls.fiebre3.value;
    reporteSalud3.congestionNasal = this.monitoreoFg.controls.congestionNasal3.value;
    reporteSalud3.otrosCansancios = this.monitoreoFg.controls.otrosCansancios3.value;
    this.fichaPersonalBlanco.reportesSalud.push(reporteSalud3);

    let reporteSalud4 = new FormSeccionReporteSalud();
    reporteSalud4.id = this.idReporteSalud4;
    reporteSalud4.fecha = this.fechaSelec4;
    reporteSalud4.tos = this.monitoreoFg.controls.tos4.value;
    reporteSalud4.dolorGarganta = this.monitoreoFg.controls.dolorGarganta4.value;
    reporteSalud4.dolorCabeza = this.monitoreoFg.controls.dolorCabeza4.value;
    reporteSalud4.dificultadRespirar = this.monitoreoFg.controls.dificultadRespirar4.value;
    reporteSalud4.percibeOlores = this.monitoreoFg.controls.percibeOlores4.value;
    reporteSalud4.sentisFiebre = this.monitoreoFg.controls.fiebre4.value;
    reporteSalud4.congestionNasal = this.monitoreoFg.controls.congestionNasal4.value;
    reporteSalud4.otrosCansancios = this.monitoreoFg.controls.otrosCansancios4.value;
    this.fichaPersonalBlanco.reportesSalud.push(reporteSalud4);

    let reporteSalud5 = new FormSeccionReporteSalud();
    reporteSalud5.id = this.idReporteSalud5;
    reporteSalud5.fecha = this.fechaSelec5;
    reporteSalud5.tos = this.monitoreoFg.controls.tos5.value;
    reporteSalud5.dolorGarganta = this.monitoreoFg.controls.dolorGarganta4.value;
    reporteSalud5.dolorCabeza = this.monitoreoFg.controls.dolorCabeza4.value;
    reporteSalud5.dificultadRespirar = this.monitoreoFg.controls.dificultadRespirar4.value;
    reporteSalud5.percibeOlores = this.monitoreoFg.controls.percibeOlores4.value;
    reporteSalud5.sentisFiebre = this.monitoreoFg.controls.fiebre4.value;
    reporteSalud5.congestionNasal = this.monitoreoFg.controls.congestionNasal4.value;
    reporteSalud5.otrosCansancios = this.monitoreoFg.controls.otrosCansancios4.value;
    this.fichaPersonalBlanco.reportesSalud.push(reporteSalud5);

    let reporteSalud6 = new FormSeccionReporteSalud();
    reporteSalud6.id = this.idReporteSalud6;
    reporteSalud6.fecha = this.fechaSelec6;
    reporteSalud6.tos = this.monitoreoFg.controls.tos6.value;
    reporteSalud6.dolorGarganta = this.monitoreoFg.controls.dolorGarganta6.value;
    reporteSalud6.dolorCabeza = this.monitoreoFg.controls.dolorCabeza6.value;
    reporteSalud6.dificultadRespirar = this.monitoreoFg.controls.dificultadRespirar6.value;
    reporteSalud6.percibeOlores = this.monitoreoFg.controls.percibeOlores6.value;
    reporteSalud6.sentisFiebre = this.monitoreoFg.controls.fiebre6.value;
    reporteSalud6.congestionNasal = this.monitoreoFg.controls.congestionNasal6.value;
    reporteSalud6.otrosCansancios = this.monitoreoFg.controls.otrosCansancios6.value;
    this.fichaPersonalBlanco.reportesSalud.push(reporteSalud6);

    let reporteSalud7 = new FormSeccionReporteSalud();
    reporteSalud7.id = this.idReporteSalud7;
    reporteSalud7.fecha = this.fechaSelec7;
    reporteSalud7.tos = this.monitoreoFg.controls.tos7.value;
    reporteSalud7.dolorGarganta = this.monitoreoFg.controls.dolorGarganta7.value;
    reporteSalud7.dolorCabeza = this.monitoreoFg.controls.dolorCabeza7.value;
    reporteSalud7.dificultadRespirar = this.monitoreoFg.controls.dificultadRespirar7.value;
    reporteSalud7.percibeOlores = this.monitoreoFg.controls.percibeOlores7.value;
    reporteSalud7.sentisFiebre = this.monitoreoFg.controls.fiebre7.value;
    reporteSalud7.congestionNasal = this.monitoreoFg.controls.congestionNasal7.value;
    reporteSalud7.otrosCansancios = this.monitoreoFg.controls.otrosCansancios7.value;
    this.fichaPersonalBlanco.reportesSalud.push(reporteSalud7);

    let reporteSalud8 = new FormSeccionReporteSalud();
    reporteSalud8.id = this.idReporteSalud8;
    reporteSalud8.fecha = this.fechaSelec8;
    reporteSalud8.tos = this.monitoreoFg.controls.tos8.value;
    reporteSalud8.dolorGarganta = this.monitoreoFg.controls.dolorGarganta8.value;
    reporteSalud8.dolorCabeza = this.monitoreoFg.controls.dolorCabeza8.value;
    reporteSalud8.dificultadRespirar = this.monitoreoFg.controls.dificultadRespirar8.value;
    reporteSalud8.percibeOlores = this.monitoreoFg.controls.percibeOlores8.value;
    reporteSalud8.sentisFiebre = this.monitoreoFg.controls.fiebre8.value;
    reporteSalud8.congestionNasal = this.monitoreoFg.controls.congestionNasal8.value;
    reporteSalud8.otrosCansancios = this.monitoreoFg.controls.otrosCansancios8.value;
    this.fichaPersonalBlanco.reportesSalud.push(reporteSalud8);

    let reporteSalud9 = new FormSeccionReporteSalud();
    reporteSalud9.id = this.idReporteSalud9;
    reporteSalud9.fecha = this.fechaSelec9;
    reporteSalud9.tos = this.monitoreoFg.controls.tos9.value;
    reporteSalud9.dolorGarganta = this.monitoreoFg.controls.dolorGarganta9.value;
    reporteSalud9.dolorCabeza = this.monitoreoFg.controls.dolorCabeza9.value;
    reporteSalud9.dificultadRespirar = this.monitoreoFg.controls.dificultadRespirar9.value;
    reporteSalud9.percibeOlores = this.monitoreoFg.controls.percibeOlores9.value;
    reporteSalud9.sentisFiebre = this.monitoreoFg.controls.fiebre9.value;
    reporteSalud9.congestionNasal = this.monitoreoFg.controls.congestionNasal9.value;
    reporteSalud9.otrosCansancios = this.monitoreoFg.controls.otrosCansancios9.value;
    this.fichaPersonalBlanco.reportesSalud.push(reporteSalud9);

    let reporteSalud10 = new FormSeccionReporteSalud();
    reporteSalud10.id = this.idReporteSalud10;
    reporteSalud10.fecha = this.fechaSelec10;
    reporteSalud10.tos = this.monitoreoFg.controls.tos10.value;
    reporteSalud10.dolorGarganta = this.monitoreoFg.controls.dolorGarganta10.value;
    reporteSalud10.dolorCabeza = this.monitoreoFg.controls.dolorCabeza10.value;
    reporteSalud10.dificultadRespirar = this.monitoreoFg.controls.dificultadRespirar10.value;
    reporteSalud10.percibeOlores = this.monitoreoFg.controls.percibeOlores10.value;
    reporteSalud10.sentisFiebre = this.monitoreoFg.controls.fiebre10.value;
    reporteSalud10.congestionNasal = this.monitoreoFg.controls.congestionNasal10.value;
    reporteSalud10.otrosCansancios = this.monitoreoFg.controls.otrosCansancios10.value;
    this.fichaPersonalBlanco.reportesSalud.push(reporteSalud10);

    let reporteSalud11 = new FormSeccionReporteSalud();
    reporteSalud11.id = this.idReporteSalud11;
    reporteSalud11.fecha = this.fechaSelec11;
    reporteSalud11.tos = this.monitoreoFg.controls.tos11.value;
    reporteSalud11.dolorGarganta = this.monitoreoFg.controls.dolorGarganta11.value;
    reporteSalud11.dolorCabeza = this.monitoreoFg.controls.dolorCabeza11.value;
    reporteSalud11.dificultadRespirar = this.monitoreoFg.controls.dificultadRespirar11.value;
    reporteSalud11.percibeOlores = this.monitoreoFg.controls.percibeOlores11.value;
    reporteSalud11.sentisFiebre = this.monitoreoFg.controls.fiebre11.value;
    reporteSalud11.congestionNasal = this.monitoreoFg.controls.congestionNasal11.value;
    reporteSalud11.otrosCansancios = this.monitoreoFg.controls.otrosCansancios11.value;
    this.fichaPersonalBlanco.reportesSalud.push(reporteSalud11);

    let reporteSalud12 = new FormSeccionReporteSalud();
    reporteSalud12.id = this.idReporteSalud12;
    reporteSalud12.fecha = this.fechaSelec12;
    reporteSalud12.tos = this.monitoreoFg.controls.tos12.value;
    reporteSalud12.dolorGarganta = this.monitoreoFg.controls.dolorGarganta12.value;
    reporteSalud12.dolorCabeza = this.monitoreoFg.controls.dolorCabeza12.value;
    reporteSalud12.dificultadRespirar = this.monitoreoFg.controls.dificultadRespirar12.value;
    reporteSalud12.percibeOlores = this.monitoreoFg.controls.percibeOlores12.value;
    reporteSalud12.sentisFiebre = this.monitoreoFg.controls.fiebre12.value;
    reporteSalud12.congestionNasal = this.monitoreoFg.controls.congestionNasal12.value;
    reporteSalud12.otrosCansancios = this.monitoreoFg.controls.otrosCansancios12.value;
    this.fichaPersonalBlanco.reportesSalud.push(reporteSalud12);

    let reporteSalud13 = new FormSeccionReporteSalud();
    reporteSalud13.id = this.idReporteSalud13;
    reporteSalud13.fecha = this.fechaSelec13;
    reporteSalud13.tos = this.monitoreoFg.controls.tos13.value;
    reporteSalud13.dolorGarganta = this.monitoreoFg.controls.dolorGarganta13.value;
    reporteSalud13.dolorCabeza = this.monitoreoFg.controls.dolorCabeza13.value;
    reporteSalud13.dificultadRespirar = this.monitoreoFg.controls.dificultadRespirar13.value;
    reporteSalud13.percibeOlores = this.monitoreoFg.controls.percibeOlores13.value;
    reporteSalud13.sentisFiebre = this.monitoreoFg.controls.fiebre13.value;
    reporteSalud13.congestionNasal = this.monitoreoFg.controls.congestionNasal13.value;
    reporteSalud13.otrosCansancios = this.monitoreoFg.controls.otrosCansancios13.value;
    this.fichaPersonalBlanco.reportesSalud.push(reporteSalud13);

    let reporteSalud14 = new FormSeccionReporteSalud();
    reporteSalud14.id = this.idReporteSalud14;
    reporteSalud14.fecha = this.fechaSelec14;
    reporteSalud14.tos = this.monitoreoFg.controls.tos14.value;
    reporteSalud14.dolorGarganta = this.monitoreoFg.controls.dolorGarganta14.value;
    reporteSalud14.dolorCabeza = this.monitoreoFg.controls.dolorCabeza14.value;
    reporteSalud14.dificultadRespirar = this.monitoreoFg.controls.dificultadRespirar14.value;
    reporteSalud14.percibeOlores = this.monitoreoFg.controls.percibeOlores14.value;
    reporteSalud14.sentisFiebre = this.monitoreoFg.controls.fiebre14.value;
    reporteSalud14.congestionNasal = this.monitoreoFg.controls.congestionNasal14.value;
    reporteSalud14.otrosCansancios = this.monitoreoFg.controls.otrosCansancios14.value;
    this.fichaPersonalBlanco.reportesSalud.push(reporteSalud14);

    this.fichaPersonalBlanco.formSeccionClasifRiesgo = new FormSeccionClasifRiesgo();
    this.fichaPersonalBlanco.formSeccionClasifRiesgo.clasificacionRiesgo = this.clasificacionRiesgoFg.controls.clasRiesgo.value;
    this.fichaPersonalBlanco.formSeccionClasifRiesgo.categoriaContagio = this.clasificacionRiesgoFg.controls.catContagio.value;
    this.fichaPersonalBlanco.formSeccionClasifRiesgo.clasificacionFinal = this.clasificacionRiesgoFg.controls.clasifFinal.value;
    this.fichaPersonalBlanco.formSeccionClasifRiesgo.trabajoExclusion = this.clasificacionRiesgoFg.controls.exclusion.value;
    this.fichaPersonalBlanco.formSeccionClasifRiesgo.trabajoAutocontrol = this.clasificacionRiesgoFg.controls.autocontrol.value;
    this.fichaPersonalBlanco.formSeccionClasifRiesgo.trabajoNada = this.clasificacionRiesgoFg.controls.nada.value;
    this.fichaPersonalBlanco.formSeccionClasifRiesgo.trabajoOtro = this.clasificacionRiesgoFg.controls.otroIndic.value;
    this.fichaPersonalBlanco.formSeccionClasifRiesgo.trabajoOtroDescripcion = this.clasificacionRiesgoFg.controls.otroIndicEspecificar.value;
    this.fichaPersonalBlanco.formSeccionClasifRiesgo.laboratorioAntigeno = this.clasificacionRiesgoFg.controls.antigeno.value;
    this.fichaPersonalBlanco.formSeccionClasifRiesgo.laboratorioPcr = this.clasificacionRiesgoFg.controls.pcr.value;
    
    this.fichaPersonalBlanco.formSeccionClasifRiesgo.fechaInicioSintomas = this.monitoreoFg.controls.fechaSintomas.value;
    this.fichaPersonalBlanco.formSeccionClasifRiesgo.fechaExposicion = this.monitoreoFg.controls.fechaExposicion.value;

    this.service.actualizarSeguimientoPB(this.fichaPersonalBlanco, this.idRegistroForm).subscribe(response => {
      //this.idRegistro = +response;
      this.loading = false;
      this.mensaje = "Ficha actualizada exitosamente!";
      this.openMessageDialogExito();
        
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

  setearFechasTabla(event, band){
    //console.log(band);
    var fechaSelec = new Date(event);
    console.log(fechaSelec);
    if(band == 'inicio'){
      var dd = fechaSelec.getDate() + 1;
    }else{
      var dd = fechaSelec.getDate();
    }
    
    var mm = fechaSelec.getMonth() + 1;
    var y = fechaSelec.getFullYear();
    if(dd < 10){
      //this.monitoreoFg.controls.fecha1.setValue('0'+dd + '/' + mm + '/' + y);
      this.monitoreoFg.controls.fecha1.setValue('0'+dd + '/' + mm);
      this.fechaSelec1 = y + '-'+ mm+'-'+'0'+dd;  //fechaSelec
    }else{
      this.monitoreoFg.controls.fecha1.setValue(dd + '/' + mm);
      this.fechaSelec1 = y + '-'+ mm+'-'+dd;
    }
    
    fechaSelec.setDate(fechaSelec.getDate()+2);
    var dd = fechaSelec.getDate();
    var mm = fechaSelec.getMonth() + 1;
    var y = fechaSelec.getFullYear();
    //var formattedDate = dd + '-' + mm + '-' + y;
    if(dd < 10){
      this.monitoreoFg.controls.fecha2.setValue('0'+dd + '/' + mm);
      this.fechaSelec2 = y + '-'+ mm+'-'+'0'+dd;  //y + '-'+ mm+'-'+dd
    }else{
      this.monitoreoFg.controls.fecha2.setValue(dd + '/' + mm);
      this.fechaSelec2 = y + '-'+ mm+'-'+dd;
    }
    

    fechaSelec.setDate(fechaSelec.getDate()+1);
    var dd = fechaSelec.getDate();
    var mm = fechaSelec.getMonth() + 1;
    var y = fechaSelec.getFullYear();
    
    if(dd < 10){
      this.monitoreoFg.controls.fecha3.setValue('0'+dd + '/' + mm);
      this.fechaSelec3 =  y + '-'+ mm+'-'+'0'+dd;
    }else{
      this.monitoreoFg.controls.fecha3.setValue(dd + '/' + mm);
      this.fechaSelec3 =  y + '-'+ mm+'-'+dd;
    }

    fechaSelec.setDate(fechaSelec.getDate()+1);
    var dd = fechaSelec.getDate();
    var mm = fechaSelec.getMonth() + 1;
    var y = fechaSelec.getFullYear();

    if(dd < 10){
      this.monitoreoFg.controls.fecha4.setValue('0'+dd + '/' + mm);
      this.fechaSelec4 =  y + '-'+ mm+'-'+'0'+dd;
    }else{
      this.monitoreoFg.controls.fecha4.setValue(dd + '/' + mm);
      this.fechaSelec4 =  y + '-'+ mm+'-'+dd;
    }

    fechaSelec.setDate(fechaSelec.getDate()+1);
    var dd = fechaSelec.getDate();
    var mm = fechaSelec.getMonth() + 1;
    var y = fechaSelec.getFullYear();
    
    if(dd < 10){
      this.monitoreoFg.controls.fecha5.setValue('0'+dd + '/' + mm);
      this.fechaSelec5 =  y + '-'+ mm+'-'+'0'+dd;
    }else{
      this.monitoreoFg.controls.fecha5.setValue(dd + '/' + mm);
      this.fechaSelec5 =  y + '-'+ mm+'-'+dd;
    }

    fechaSelec.setDate(fechaSelec.getDate()+1);
    var dd = fechaSelec.getDate();
    var mm = fechaSelec.getMonth() + 1;
    var y = fechaSelec.getFullYear();

    if(dd < 10){
      this.monitoreoFg.controls.fecha6.setValue('0'+dd + '/' + mm);
      this.fechaSelec6 = y + '-'+ mm+'-'+'0'+dd;
    }else{
      this.monitoreoFg.controls.fecha6.setValue(dd + '/' + mm);
      this.fechaSelec6 = y + '-'+ mm+'-'+dd;
    }

    fechaSelec.setDate(fechaSelec.getDate()+1);
    var dd = fechaSelec.getDate();
    var mm = fechaSelec.getMonth() + 1;
    var y = fechaSelec.getFullYear();

    if(dd < 10){
      this.monitoreoFg.controls.fecha7.setValue('0'+dd + '/' + mm);
      this.fechaSelec7 =  y + '-'+ mm+'-'+'0'+dd;
    }else{
      this.monitoreoFg.controls.fecha7.setValue(dd + '/' + mm);
      this.fechaSelec7 =  y + '-'+ mm+'-'+dd;
    }

    fechaSelec.setDate(fechaSelec.getDate()+1);
    var dd = fechaSelec.getDate();
    var mm = fechaSelec.getMonth() + 1;
    var y = fechaSelec.getFullYear();

    if(dd < 10){
      this.monitoreoFg.controls.fecha8.setValue('0'+dd + '/' + mm);
      this.fechaSelec8 = y + '-'+ mm+'-'+'0'+dd;
    }else{
      this.monitoreoFg.controls.fecha8.setValue(dd + '/' + mm);
      this.fechaSelec8 = y + '-'+ mm+'-'+dd;
    }

    fechaSelec.setDate(fechaSelec.getDate()+1);
    var dd = fechaSelec.getDate();
    var mm = fechaSelec.getMonth() + 1;
    var y = fechaSelec.getFullYear();

    
    if(dd < 10){
      this.monitoreoFg.controls.fecha9.setValue('0'+dd + '/' + mm);
      this.fechaSelec9 =  y + '-'+ mm+'-'+'0'+dd;
    }else{
      this.monitoreoFg.controls.fecha9.setValue(dd + '/' + mm);
      this.fechaSelec9 =  y + '-'+ mm+'-'+dd;
    }

    fechaSelec.setDate(fechaSelec.getDate()+1);
    var dd = fechaSelec.getDate();
    var mm = fechaSelec.getMonth() + 1;
    var y = fechaSelec.getFullYear();

    if(dd < 10){
      this.monitoreoFg.controls.fecha10.setValue('0'+dd + '/' + mm);
      this.fechaSelec10 = y + '-'+ mm+'-'+'0'+dd;
    }else{
      this.monitoreoFg.controls.fecha10.setValue(dd + '/' + mm);
      this.fechaSelec10 = y + '-'+ mm+'-'+dd;
    }

    fechaSelec.setDate(fechaSelec.getDate()+1);
    var dd = fechaSelec.getDate();
    var mm = fechaSelec.getMonth() + 1;
    var y = fechaSelec.getFullYear();

    if(dd < 10){
      this.monitoreoFg.controls.fecha11.setValue('0'+dd + '/' + mm);
      this.fechaSelec11 =  y + '-'+ mm+'-'+'0'+dd;
    }else{
      this.monitoreoFg.controls.fecha11.setValue(dd + '/' + mm);
      this.fechaSelec11 =  y + '-'+ mm+'-'+dd;
    }

    fechaSelec.setDate(fechaSelec.getDate()+1);
    var dd = fechaSelec.getDate();
    var mm = fechaSelec.getMonth() + 1;
    var y = fechaSelec.getFullYear();
    
    if(dd < 10){
      this.monitoreoFg.controls.fecha12.setValue('0'+dd + '/' + mm);
      this.fechaSelec12 =  y + '-'+ mm+'-'+'0'+dd;
    }else{
      this.monitoreoFg.controls.fecha12.setValue(dd + '/' + mm);
      this.fechaSelec12 =  y + '-'+ mm+'-'+dd;
    }

    fechaSelec.setDate(fechaSelec.getDate()+1);
    var dd = fechaSelec.getDate();
    var mm = fechaSelec.getMonth() + 1;
    var y = fechaSelec.getFullYear();
    
    if(dd < 10){
      this.monitoreoFg.controls.fecha13.setValue('0'+dd + '/' + mm);
      this.fechaSelec13 =  y + '-'+ mm+'-'+'0'+dd;
    }else{
      this.monitoreoFg.controls.fecha13.setValue(dd + '/' + mm);
      this.fechaSelec13 =  y + '-'+ mm+'-'+dd;
    }

    fechaSelec.setDate(fechaSelec.getDate()+1);
    var dd = fechaSelec.getDate();
    var mm = fechaSelec.getMonth() + 1;
    var y = fechaSelec.getFullYear();
    
    if(dd < 10){
      this.monitoreoFg.controls.fecha14.setValue('0'+dd + '/' + mm);
      this.fechaSelec14 = y + '-'+ mm+'-'+'0'+dd;
    }else{
      this.monitoreoFg.controls.fecha14.setValue(dd + '/' + mm);
      this.fechaSelec14 = y + '-'+ mm+'-'+dd;
    }
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
                this.registroFg.controls.fechaNacimiento.setValue(response.obtenerPersonaPorNroCedulaResponse.return.fechNacim.substring(0, 4)+'-'+
                response.obtenerPersonaPorNroCedulaResponse.return.fechNacim.substring(5, 7)+'-'+response.obtenerPersonaPorNroCedulaResponse.return.fechNacim.substring(8, 10));
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
          if(error.status == 401)
          {
            this._router.navigate(["/"]);
          }
          else
          {
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
