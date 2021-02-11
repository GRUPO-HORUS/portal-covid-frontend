import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription } from 'rxjs';
import { Covid19Service } from '../../../services/Covid19Service';

import {FormDatosBasicos} from '../model/formDatosBasicos.model';

import { ReCaptchaV3Service } from 'ng-recaptcha';
import { FormGroup, Validators, FormBuilder } from "@angular/forms";

import { MatHorizontalStepper } from "@angular/material";
import { FormSeccionContactoContagio } from "../model/formSeccionContactoContagio.model";
import { FormSeccionClasifRiesgo } from "../model/formSeccionClasifRiesgo.model";
import { FormSeccionPersonalBlanco } from "../model/formSeccionPersonalBlanco.model";

import {calendarEsLocale} from '../../../util/calendar-es-locale';
import { LugarServicio } from "../model/lugarServicio.model";
import { FichaPersonalBlanco } from "../model/fichaPersonalBlanco.model";
import { FormSeccionReporteSalud } from "../model/formSeccionReporteSalud.model";
import { FormDatosClinicos } from "../model/formDatosClinicos.model";

declare var $: any;
@Component({
  selector: "editar-ficha-monitoreo-selector",
  templateUrl: "./editar-ficha-monitoreo.component.html",
  styleUrls: ['./ficha-monitoreo.component.css'],
  providers: [Covid19Service]
})

export class EditarFichaMonitoreoComponent implements OnInit {

  public loading: boolean;
  public mensaje: string;

  //Formulario
  public formDatosBasicos: FormDatosBasicos;

  public contactoContagio: FormSeccionContactoContagio;

  public clasifRiesgoPaciente: FormSeccionClasifRiesgo;
  public formPersonalBlanco: FormSeccionPersonalBlanco;

  //Formulario global
  public fichaPersonalBlanco: FichaPersonalBlanco;

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
  
  public origen: string;

  public idRegistro: number;

  public sexoOptions=[{value:'M',label:'Masculino'},{value:'F',label:'Femenino'}];

  public clasRiesgoOptions=[{value:'alto',label:'Alto'},{value:'moderado',label:'Moderado'},{value:'bajo',label:'Bajo'}];

  public profesionOptions =[{value:'medico',label:'Médico/a'}, {value:'enfermero',label:'Enfermero/a'}];

  public catContagioOptions=[{value:'asistencia_paciente',label:'Asistencia a paciente con COVID-19'}, {value:'contacto_personal_salud',label:'Contacto con Personal de Salud con COVID-19'},
  {value:'asistencia_penitenciaria',label:'Asistencia en penitenciaría'},{value:'asistencia_albergue',label:'Asistencia en albergues/hotel salud'},
  {value:'familiar_social',label:'Familiar Social'}, {value:'viajero',label:'Viajero'},{value:'sin_nexo',label:'Sin Nexo'}];

  public tipoRegistroOptions=[{value:'ingreso_pais',label:'Ingreso al país'},{value:'aislamiento',label:'Caso sospechoso Covid-19'}];

  public departamentoOptions=[{id:1, nombre:'Concepción'},{id:2, nombre:'San Pedro'},
                              {id:3, nombre:'Cordillera'}, {id:4, nombre:'Guairá'},
                              {id:5, nombre:'Caaguazú'}, {id:6,nombre:'Caazapá'},
                              {id:7, nombre:'Itapúa'}, {id:8,nombre:'Misiones'},
                              {id:9, nombre:'Paraguarí'},{id:10, nombre:'Alto Paraná'},
                              {id:11, nombre:'Central'},{id:12, nombre:'Ñeembucú'},
                              {id:13, nombre:'Amambay'},{id:14, nombre:'Canindeyú'},
                              {id:15, nombre:'Presidente Hayes'}, {id:16, nombre:'Boquerón'},
                              {id:17, nombre:'Alto Paraguay'}, {id:18, nombre:'Capital'}];

  public regionSanitariaOptions=[{id:1, nombre:'Concepción'},{id:2, nombre:'San Pedro Norte'},
                              {id:3, nombre:'San Pedro Norte'}, {id:4, nombre:'Cordillera'},
                              {id:5, nombre:'Guairá'}, {id:6, nombre:'Caaguazú'},
                              {id:7,nombre:'Caazapá'}, {id:8, nombre:'Itapúa'},
                              {id:9,nombre:'Misiones'},
                              {id:10, nombre:'Paraguarí'},{id:11, nombre:'Alto Paraná'},
                              {id:12, nombre:'Central'},{id:13, nombre:'Ñeembucú'},
                              {id:14, nombre:'Amambay'},{id:15, nombre:'Canindeyú'},
                              {id:16, nombre:'Presidente Hayes'}, {id:17, nombre:'Boquerón'},
                              {id:18, nombre:'Alto Paraguay'}, {id:19, nombre:'Capital'}];

  public clasifFinalOptions=[{value:'descartado',label:'Descartado'},{value:'confirmado',label:'Confirmado'}];

  public evoFinalOptions=[{value:'alta',label:'Alta'},{value:'obito',label:'Obito'}];

  public ciudadOptions: any[];

  public resulPriMuestraOptions=[{value:'negativo',label:'Negativo'},{value:'positivo',label:'Positivo'}];

  public rangoEdadOptions=[{value:'18-28',label:'18 a 28 años'}, {value:'29-39',label:'29 a 39 años'},{value:'40-50',label:'40 a 50 años'},{value:'51-61',label:'51 a 61 años'},
  {value:'>=62',label:'62 años y más'}];

  public especialidadOptions=[{value:'sala',label:'Sala'},{value:'uti',label:'UTI'}];

  public serviciosSalud = [{'id':4,'nombre':'HG. BARRIO OBRERO'},{'id':5,'nombre':'CS. NRO. 8'},{'id':6,'nombre':'CD. N 11'},
  {'id':7,'nombre':'CS. DOMINGO SAVIO'}, {'id':8,'nombre':'USF. 3 DE FEBRERO I'}, {'id':9,'nombre':'USF. 3 DE FEBRERO II'},
  {'id':10,'nombre':'USF. PELOPINCHO I'}, {'id':11,'nombre':'USF. PELOPINCHO II'}, {'id':12,'nombre':'USF. CAMSAT SAN MIGUEL'},
  {'id':13,'nombre':'USF. CAMSAT SAN FELIPE'}, {'id':14,'nombre':'USF. PEDRO VIERA'}, {'id':15,'nombre':'USF. REPUBLICANO I'},
  {'id':16,'nombre':'USF. REPUBLICANO II'}, {'id':17,'nombre':'USF. SANTA ANA'}, {'id':18,'nombre':'USF. DIVINO NIÐO'},
  {'id':19,'nombre':'USF. SANTA ROSA DE LIMA'}, {'id':20,'nombre':'USF. SAN ALFONSO'}, {'id':21,'nombre':'USF. SAN BLAS'},
  {'id':22,'nombre':'USF. SAN CAYETANO I'}, {'id':23,'nombre':'USF. SAN CAYETANO II'}, {'id':24,'nombre':'USF. ITA ENRAMADA'},
  {'id':25,'nombre':'USF. YUKYTY'}, {'id':26,'nombre':'HOSP. CLINICAS I'}, {'id':27,'nombre':'HOSP. CLINICAS II'},
  {'id':28,'nombre':'POLC. CAPELLANES DEL CHACO'}, {'id':29,'nombre':'HOSP. MILITAR'}, {'id':30,'nombre':'CRUZ ROJA'},
  {'id':31,'nombre':'SANATORIO BRITANICO'}, {'id':32,'nombre':'SANIDAD NAVAL'}, {'id':33,'nombre':'HOSP. MAT. INF. LOMA PYTA'},
  {'id':34,'nombre':'CS. ZEBALLOS CUE'}, {'id':35,'nombre':'USF. ZEBALLOS I - SAN FRANCIS'},  {'id':36,'nombre':'USF. ZEBALLOS II LAS COLINAS'},
  {'id':37,'nombre':'USF. ZEBALLOS III ARCOIRIS'}, {'id':38,'nombre':'USF. PERPETUO SOCORRO I'}, {'id':39,'nombre':'USF. PERPETUO SOCORRO II'},
  {'id':40,'nombre':'USF. VIÐAS CUE'}, {'id':41,'nombre':'IPS. ISLA POI'}, {'id':42,'nombre':'HOSP. MAT. SAN PABLO'},{'id':43,'nombre':'CS. N 9'},
  {'id':44,'nombre':'CLUB DE LEONES SAN VICENTE'}, {'id':45,'nombre':'PS. BARRIO NUEVO'}, {'id':46,'nombre':'PS. SAN PEDRO'},
  {'id':47,'nombre':'PS. SAN VICENTE DE PAUL'},{'id':48,'nombre':'PS. SANTA MARIA'}, {'id':49,'nombre':'HOSPITAL POLICIAL'},
  {'id':50,'nombre':'POLICLINICO MUNICIPAL'}, {'id':51,'nombre':'POLICLINICO MUNICIPAL'}, {'id':52,'nombre':'IPS. 12 DE JUNIO'},
  {'id':53,'nombre':'IPS. BOQUERON'}, {'id':54,'nombre':'SANATORIO MIGONE'}, {'id':55,'nombre':'HOSPITAL DEL TRAUMA'},
  {'id':56,'nombre':'MISION DE LA AMISTAD'}, {'id':57,'nombre':'CENTRO MEDICO SAN CRISTOBAL'}, {'id':58,'nombre':'SANATORIO ADVENTISTA'},
  {'id':59,'nombre':'POLICLINICO UNINORTE'}, {'id':60,'nombre':'HOSP. MAT. INF. TRINIDAD'}, {'id':61,'nombre':'CS. N 7'},
  {'id':62,'nombre':'USF. BLANCO CUE'}, {'id':63,'nombre':'CS. N 10'}, {'id':64,'nombre':'CS. N 12'}, {'id':65,'nombre':'USF. SAN FELIPE'},
  {'id':66,'nombre':'USF. SAN JUAN'}, {'id':67,'nombre':'USF. SANTA LUCIA'}, {'id':68,'nombre':'USF. SALVADOR DEL MUNDO'}, {'id':69,'nombre':'USF. VIRGEN DE FATIMA'},
  {'id':70,'nombre':'USF. SANTA ROSA'}, {'id':71,'nombre':'IPS. CENTRAL'}, {'id':72,'nombre':'IPS. NANAWA'},
  {'id':73,'nombre':'IPS. GERIATRICO'}, {'id':74,'nombre':'IMT'}, {'id':75,'nombre':'CENTRO MEDICO LA COSTA'}, {'id':76,'nombre':'SANATORIO STA BARBARA'},
  {'id':77,'nombre':'SANATORIO ITALIANO'}, {'id':78,'nombre':'VACUNATORIO REGIONAL'}];
  // recaptcha
  public recentToken: string = ''
  private subscription: Subscription;
  public recaptchaAvailable = false;

  public options: string;

  fechaHoy;
  //otroIndic=false;

  //Forms del Wizard
  registroFg: FormGroup;
  clasificacionRiesgoFg: FormGroup;
  casoConfirmadoFg: FormGroup;
  monitoreoFg: FormGroup;

  nroDocumento;
  //serviciosSalud: any[];
  serviSaludFiltrados: any[];

  es = calendarEsLocale;

  lugares: any[];
  regionesFiltradas: any[];
  establecimientosFiltrados: any[];

  profesionesFiltradas: any[];
  funcionesFiltradas: any[];

  idPaciente;
  cedulaPaciente;
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

  fallaSII: boolean;
  public ciudadesOptions: any[];
  public ciudadesFiltradas: any[];

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

  @ViewChild('stepper') stepper: MatHorizontalStepper;

  ngOnInit() {
    this.fechaHoy = new Date().toLocaleDateString('fr-CA');
    
    this._route.params.subscribe(params => {
      this.cedulaPaciente = params["cedula"];
      this.obtenerPaciente( this.cedulaPaciente);
    });

    this.options="{types: ['(cities)'], componentRestrictions: { country: 'PY' }}";

    this.service.getLugaresServicio().subscribe(lugares => {
      this.lugares = [];
      this.lugares = lugares;
    }, error => {
      console.log(error);
      this.mensaje = error.error;
      this.openMessageDialog();
    });
    
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
      otroServicio:[''],
      otroLugarNoListaCheck:[null],
      otroLugarNoLista:[],
      embarazada:[null],
      vacunaCovid:[null],
      cardiopatia:[null],
      enfermedadPulmonar:[null],
      asma:[null],
      diabetes:[null],
      enfermedadRenal:[null],
      inmunodeficiencia:[null],
      enfermedadNeurologica:[null],
      sindromeDown:[null],
      obesidad:[null],
      enfermedadHepatica:[null],
      enfermedadOtros:[null],
      enfermedadOtrosNombre:[''],
      ningunaEnfBase:[null],
      se:[1],
    });

    this.casoConfirmadoFg = this._formBuilder.group({
      cedula: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      sexo: ['', Validators.required],
      contagioAmbiente: [null, Validators.required],
      contagioEstablecimiento: [],
      fechaExposicion: ['', Validators.required],
      catContagio: [''],
      clasRiesgo: ['', Validators.required],
      otroServicioCheck:[null],
      otroServicioNombre:[]
    });

    this.monitoreoFg = this._formBuilder.group({
      /*cedula: ['', Validators.required],
      nombre: ['', Validators.required]*/
      sintomatico: [null],
      fechaSintomas: ['', Validators.required],
      seFis: [1, Validators.required],
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
      diarrea1: [null, Validators.required],
      diarrea2: [null, Validators.required],
      diarrea3: [null, Validators.required],
      diarrea4: [null, Validators.required],
      diarrea5: [null, Validators.required],
      diarrea6: [null, Validators.required],
      diarrea7: [null, Validators.required],
      diarrea8: [null, Validators.required],
      diarrea9: [null, Validators.required],
      diarrea10: [null, Validators.required],
      diarrea11: [null, Validators.required],
      diarrea12: [null, Validators.required],
      diarrea13: [null, Validators.required],
      diarrea14: [null, Validators.required],
      dolorOido1: [null, Validators.required],
      dolorOido2: [null, Validators.required],
      dolorOido3: [null, Validators.required],
      dolorOido4: [null, Validators.required],
      dolorOido5: [null, Validators.required],
      dolorOido6: [null, Validators.required],
      dolorOido7: [null, Validators.required],
      dolorOido8: [null, Validators.required],
      dolorOido9: [null, Validators.required],
      dolorOido10: [null, Validators.required],
      dolorOido11: [null, Validators.required],
      dolorOido12: [null, Validators.required],
      dolorOido13: [null, Validators.required],
      dolorOido14: [null, Validators.required],
      convulsiones1: [null, Validators.required],
      convulsiones2: [null, Validators.required],
      convulsiones3: [null, Validators.required],
      convulsiones4: [null, Validators.required],
      convulsiones5: [null, Validators.required],
      convulsiones6: [null, Validators.required],
      convulsiones7: [null, Validators.required],
      convulsiones8: [null, Validators.required],
      convulsiones9: [null, Validators.required],
      convulsiones10: [null, Validators.required],
      convulsiones11: [null, Validators.required],
      convulsiones12: [null, Validators.required],
      convulsiones13: [null, Validators.required],
      convulsiones14: [null, Validators.required],
      mialgias1: [null, Validators.required],
      mialgias2: [null, Validators.required],
      mialgias3: [null, Validators.required],
      mialgias4: [null, Validators.required],
      mialgias5: [null, Validators.required],
      mialgias6: [null, Validators.required],
      mialgias7: [null, Validators.required],
      mialgias8: [null, Validators.required],
      mialgias9: [null, Validators.required],
      mialgias10: [null, Validators.required],
      mialgias11: [null, Validators.required],
      mialgias12: [null, Validators.required],
      mialgias13: [null, Validators.required],
      mialgias14: [null, Validators.required],
      artralgias1: [null, Validators.required],
      artralgias2: [null, Validators.required],
      artralgias3: [null, Validators.required],
      artralgias4: [null, Validators.required],
      artralgias5: [null, Validators.required],
      artralgias6: [null, Validators.required],
      artralgias7: [null, Validators.required],
      artralgias8: [null, Validators.required],
      artralgias9: [null, Validators.required],
      artralgias10: [null, Validators.required],
      artralgias11: [null, Validators.required],
      artralgias12: [null, Validators.required],
      artralgias13: [null, Validators.required],
      artralgias14: [null, Validators.required],
      postracion1: [null, Validators.required],
      postracion2: [null, Validators.required],
      postracion3: [null, Validators.required],
      postracion4: [null, Validators.required],
      postracion5: [null, Validators.required],
      postracion6: [null, Validators.required],
      postracion7: [null, Validators.required],
      postracion8: [null, Validators.required],
      postracion9: [null, Validators.required],
      postracion10: [null, Validators.required],
      postracion11: [null, Validators.required],
      postracion12: [null, Validators.required],
      postracion13: [null, Validators.required],
      postracion14: [null, Validators.required],
      nauseas1: [null, Validators.required],
      nauseas2: [null, Validators.required],
      nauseas3: [null, Validators.required],
      nauseas4: [null, Validators.required],
      nauseas5: [null, Validators.required],
      nauseas6: [null, Validators.required],
      nauseas7: [null, Validators.required],
      nauseas8: [null, Validators.required],
      nauseas9: [null, Validators.required],
      nauseas10: [null, Validators.required],
      nauseas11: [null, Validators.required],
      nauseas12: [null, Validators.required],
      nauseas13: [null, Validators.required],
      nauseas14: [null, Validators.required],
      irritabilidad1: [null, Validators.required],
      irritabilidad2: [null, Validators.required],
      irritabilidad3: [null, Validators.required],
      irritabilidad4: [null, Validators.required],
      irritabilidad5: [null, Validators.required],
      irritabilidad6: [null, Validators.required],
      irritabilidad7: [null, Validators.required],
      irritabilidad8: [null, Validators.required],
      irritabilidad9: [null, Validators.required],
      irritabilidad10: [null, Validators.required],
      irritabilidad11: [null, Validators.required],
      irritabilidad12: [null, Validators.required],
      irritabilidad13: [null, Validators.required],
      irritabilidad14: [null, Validators.required],
      dolorAbdominal1: [null, Validators.required],
      dolorAbdominal2: [null, Validators.required],
      dolorAbdominal3: [null, Validators.required],
      dolorAbdominal4: [null, Validators.required],
      dolorAbdominal5: [null, Validators.required],
      dolorAbdominal6: [null, Validators.required],
      dolorAbdominal7: [null, Validators.required],
      dolorAbdominal8: [null, Validators.required],
      dolorAbdominal9: [null, Validators.required],
      dolorAbdominal10: [null, Validators.required],
      dolorAbdominal11: [null, Validators.required],
      dolorAbdominal12: [null, Validators.required],
      dolorAbdominal13: [null, Validators.required],
      dolorAbdominal14: [null, Validators.required],
      rinorrea1: [null, Validators.required],
      rinorrea2: [null, Validators.required],
      rinorrea3: [null, Validators.required],
      rinorrea4: [null, Validators.required],
      rinorrea5: [null, Validators.required],
      rinorrea6: [null, Validators.required],
      rinorrea7: [null, Validators.required],
      rinorrea8: [null, Validators.required],
      rinorrea9: [null, Validators.required],
      rinorrea10: [null, Validators.required],
      rinorrea11: [null, Validators.required],
      rinorrea12: [null, Validators.required],
      rinorrea13: [null, Validators.required],
      rinorrea14: [null, Validators.required],
      conjuntival1: [null, Validators.required],
      conjuntival2: [null, Validators.required],
      conjuntival3: [null, Validators.required],
      conjuntival4: [null, Validators.required],
      conjuntival5: [null, Validators.required],
      conjuntival6: [null, Validators.required],
      conjuntival7: [null, Validators.required],
      conjuntival8: [null, Validators.required],
      conjuntival9: [null, Validators.required],
      conjuntival10: [null, Validators.required],
      conjuntival11: [null, Validators.required],
      conjuntival12: [null, Validators.required],
      conjuntival13: [null, Validators.required],
      conjuntival14: [null, Validators.required],
      auscultacion1: [null, Validators.required],
      auscultacion2: [null, Validators.required],
      auscultacion3: [null, Validators.required],
      auscultacion4: [null, Validators.required],
      auscultacion5: [null, Validators.required],
      auscultacion6: [null, Validators.required],
      auscultacion7: [null, Validators.required],
      auscultacion8: [null, Validators.required],
      auscultacion9: [null, Validators.required],
      auscultacion10: [null, Validators.required],
      auscultacion11: [null, Validators.required],
      auscultacion12: [null, Validators.required],
      auscultacion13: [null, Validators.required],
      auscultacion14: [null, Validators.required],
      anosmia1: [null, Validators.required],
      anosmia2: [null, Validators.required],
      anosmia3: [null, Validators.required],
      anosmia4: [null, Validators.required],
      anosmia5: [null, Validators.required],
      anosmia6: [null, Validators.required],
      anosmia7: [null, Validators.required],
      anosmia8: [null, Validators.required],
      anosmia9: [null, Validators.required],
      anosmia10: [null, Validators.required],
      anosmia11: [null, Validators.required],
      anosmia12: [null, Validators.required],
      anosmia13: [null, Validators.required],
      anosmia14: [null, Validators.required],
      disgeusia1: [null, Validators.required],
      disgeusia2: [null, Validators.required],
      disgeusia3: [null, Validators.required],
      disgeusia4: [null, Validators.required],
      disgeusia5: [null, Validators.required],
      disgeusia6: [null, Validators.required],
      disgeusia7: [null, Validators.required],
      disgeusia8: [null, Validators.required],
      disgeusia9: [null, Validators.required],
      disgeusia10: [null, Validators.required],
      disgeusia11: [null, Validators.required],
      disgeusia12: [null, Validators.required],
      disgeusia13: [null, Validators.required],
      disgeusia14: [null, Validators.required],
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
      clasifFinal:[''],
      otroIndicEspecificar: [''],
      autocontrol: [null],
      nada: [null],
      otroIndic: [null],
      antigeno: [null],
      pcr: [null],
      sePrimeraMuestra: [1],
      fechaPrimeraMuestra: [''],
      resultadoPrimeraMuestra: [''],
      exclusion: [null, Validators.required],
      constAislamiento: [null, Validators.required],
      fichaEpidemiologica: [null, Validators.required],
      evolucionFinal: [''],
      fechaCierreCaso: [''],
      seCierreCaso:[1],
      internado: [null, Validators.required],
      establecimiento: [],
      especialidad: [],
      otroServicioInternadoCheck:[null],
      otroServicioInternado:[]
    });

    /*this._route.params.subscribe(params => {
        this.formDatosBasicos.tipoInicio = params["tipoInicio"];
    });*/
  }

  calcularSE(event){
    let fechaSelec = new Date(event);

    if(fechaSelec >= new Date('2021-01-03') && fechaSelec <= new Date('2021-01-09')){
      this.registroFg.controls.se.setValue(1);
    }
    if(fechaSelec >= new Date('2021-01-10') && fechaSelec <= new Date('2021-01-16')){
      this.registroFg.controls.se.setValue(2);
    }
    if(fechaSelec >= new Date('2021-01-17') && fechaSelec <= new Date('2021-01-23')){
      this.registroFg.controls.se.setValue(3);
    }
    if(fechaSelec >= new Date('2021-01-24') && fechaSelec <= new Date('2021-01-30')){
      this.registroFg.controls.se.setValue(4);
    }
    if(fechaSelec >= new Date('2021-01-31') && fechaSelec <= new Date('2021-02-06')){
      this.registroFg.controls.se.setValue(5);
    }
    if(fechaSelec >= new Date('2021-02-07') && fechaSelec <= new Date('2021-02-13')){
      this.registroFg.controls.se.setValue(6);
    }
    if(fechaSelec >= new Date('2021-02-14') && fechaSelec <= new Date('2021-02-20')){
      this.registroFg.controls.se.setValue(7);
    }
    if(fechaSelec >= new Date('2021-02-21') && fechaSelec <= new Date('2021-02-27')){
      this.registroFg.controls.se.setValue(8);
    }
    if(fechaSelec >= new Date('2021-02-28') && fechaSelec <= new Date('2021-03-06')){
      this.registroFg.controls.se.setValue(9);
    }
    if(fechaSelec >= new Date('2021-03-07') && fechaSelec <= new Date('2021-03-13')){
      this.registroFg.controls.se.setValue(10);
    }
    if(fechaSelec >= new Date('2021-03-14') && fechaSelec <= new Date('2021-03-20')){
      this.registroFg.controls.se.setValue(11);
    }
    if(fechaSelec >= new Date('2021-03-21') && fechaSelec <= new Date('2021-03-27')){
      this.registroFg.controls.se.setValue(12);
    }
    if(fechaSelec >= new Date('2021-03-28') && fechaSelec <= new Date('2021-04-03')){
      this.registroFg.controls.se.setValue(13);
    }
    if(fechaSelec >= new Date('2021-04-04') && fechaSelec <= new Date('2021-04-10')){
      this.registroFg.controls.se.setValue(14);
    }
    if(fechaSelec >= new Date('2021-04-11') && fechaSelec <= new Date('2021-04-17')){
      this.registroFg.controls.se.setValue(15);
    }
    if(fechaSelec >= new Date('2021-04-18') && fechaSelec <= new Date('2021-04-24')){
      this.registroFg.controls.se.setValue(16);
    }
    if(fechaSelec >= new Date('2021-04-25') && fechaSelec <= new Date('2021-05-01')){
      this.registroFg.controls.se.setValue(17);
    }
    if(fechaSelec >= new Date('2021-05-02') && fechaSelec <= new Date('2021-05-08')){
      this.registroFg.controls.se.setValue(18);
    }
    if(fechaSelec >= new Date('2021-05-09') && fechaSelec <= new Date('2021-05-15')){
      this.registroFg.controls.se.setValue(19);
    }
    if(fechaSelec >= new Date('2021-05-16') && fechaSelec <= new Date('2021-05-22')){
      this.registroFg.controls.se.setValue(20);
    }
    if(fechaSelec >= new Date('2021-05-23') && fechaSelec <= new Date('2021-05-29')){
      this.registroFg.controls.se.setValue(21);
    }
    if(fechaSelec >= new Date('2021-05-30') && fechaSelec <= new Date('2021-06-05')){
      this.registroFg.controls.se.setValue(22);
    }
    if(fechaSelec >= new Date('2021-06-06') && fechaSelec <= new Date('2021-06-12')){
      this.registroFg.controls.se.setValue(23);
    }
    if(fechaSelec >= new Date('2021-06-13') && fechaSelec <= new Date('2021-06-19')){
      this.registroFg.controls.se.setValue(24);
    }
    if(fechaSelec >= new Date('2021-06-20') && fechaSelec <= new Date('2021-06-26')){
      this.registroFg.controls.se.setValue(25);
    }
    if(fechaSelec >= new Date('2021-06-27') && fechaSelec <= new Date('2021-07-03')){
      this.registroFg.controls.se.setValue(26);
    }
    if(fechaSelec >= new Date('2021-07-04') && fechaSelec <= new Date('2021-07-10')){
      this.registroFg.controls.se.setValue(27);
    }
    if(fechaSelec >= new Date('2021-07-11') && fechaSelec <= new Date('2021-07-17')){
      this.registroFg.controls.se.setValue(28);
    }
    if(fechaSelec >= new Date('2021-07-18') && fechaSelec <= new Date('2021-07-24')){
      this.registroFg.controls.se.setValue(29);
    }
    if(fechaSelec >= new Date('2021-07-25') && fechaSelec <= new Date('2021-07-31')){
      this.registroFg.controls.se.setValue(30);
    }
    if(fechaSelec >= new Date('2021-08-01') && fechaSelec <= new Date('2021-08-07')){
      this.registroFg.controls.se.setValue(31);
    }
    if(fechaSelec >= new Date('2021-08-08') && fechaSelec <= new Date('2021-08-14')){
      this.registroFg.controls.se.setValue(32);
    }
    if(fechaSelec >= new Date('2021-08-15') && fechaSelec <= new Date('2021-08-21')){
      this.registroFg.controls.se.setValue(33);
    }
    if(fechaSelec >= new Date('2021-08-22') && fechaSelec <= new Date('2021-08-28')){
      this.registroFg.controls.se.setValue(34);
    }
    if(fechaSelec >= new Date('2021-08-29') && fechaSelec <= new Date('2021-09-04')){
      this.registroFg.controls.se.setValue(35);
    }
    if(fechaSelec >= new Date('2021-09-05') && fechaSelec <= new Date('2021-09-11')){
      this.registroFg.controls.se.setValue(36);
    }
    if(fechaSelec >= new Date('2021-09-12') && fechaSelec <= new Date('2021-09-18')){
      this.registroFg.controls.se.setValue(37);
    }
    if(fechaSelec >= new Date('2021-09-19') && fechaSelec <= new Date('2021-09-25')){
      this.registroFg.controls.se.setValue(38);
    }
    if(fechaSelec >= new Date('2021-09-26') && fechaSelec <= new Date('2021-10-02')){
      this.registroFg.controls.se.setValue(39);
    }
    if(fechaSelec >= new Date('2021-10-03') && fechaSelec <= new Date('2021-10-09')){
      this.registroFg.controls.se.setValue(40);
    }
    if(fechaSelec >= new Date('2021-10-10') && fechaSelec <= new Date('2021-10-16')){
      this.registroFg.controls.se.setValue(41);
    }
    if(fechaSelec >= new Date('2021-10-17') && fechaSelec <= new Date('2021-10-23')){
      this.registroFg.controls.se.setValue(42);
    }
    if(fechaSelec >= new Date('2021-10-24') && fechaSelec <= new Date('2021-10-30')){
      this.registroFg.controls.se.setValue(43);
    }
    if(fechaSelec >= new Date('2021-10-31') && fechaSelec <= new Date('2021-11-06')){
      this.registroFg.controls.se.setValue(44);
    }
    if(fechaSelec >= new Date('2021-11-07') && fechaSelec <= new Date('2021-11-13')){
      this.registroFg.controls.se.setValue(45);
    }
    if(fechaSelec >= new Date('2021-11-14') && fechaSelec <= new Date('2021-11-20')){
      this.registroFg.controls.se.setValue(46);
    }
    if(fechaSelec >= new Date('2021-11-21') && fechaSelec <= new Date('2021-11-27')){
      this.registroFg.controls.se.setValue(47);
    }
    if(fechaSelec >= new Date('2021-11-28') && fechaSelec <= new Date('2021-12-04')){
      this.registroFg.controls.se.setValue(48);
    }
    if(fechaSelec >= new Date('2021-12-05') && fechaSelec <= new Date('2021-12-11')){
      this.registroFg.controls.se.setValue(49);
    }
    if(fechaSelec >= new Date('2021-12-12') && fechaSelec <= new Date('2021-12-18')){
      this.registroFg.controls.se.setValue(50);
    }
    if(fechaSelec >= new Date('2021-12-19') && fechaSelec <= new Date('2021-12-25')){
      this.registroFg.controls.se.setValue(51);
    }
    if(fechaSelec >= new Date('2021-12-26') && fechaSelec <= new Date('2022-01-01')){
      this.registroFg.controls.se.setValue(52);
    }
  }

  setearSeFis(event){
    let fechaSelec = new Date(event);
    if(fechaSelec >= new Date('2021-01-03') && fechaSelec <= new Date('2021-01-09')){
      this.monitoreoFg.controls.seFis.setValue(1);
    }
    if(fechaSelec >= new Date('2021-01-10') && fechaSelec <= new Date('2021-01-16')){
      this.monitoreoFg.controls.seFis.setValue(2);
    }
    if(fechaSelec >= new Date('2021-01-17') && fechaSelec <= new Date('2021-01-23')){
      this.monitoreoFg.controls.seFis.setValue(3);
    }
    if(fechaSelec >= new Date('2021-01-24') && fechaSelec <= new Date('2021-01-30')){
      this.monitoreoFg.controls.seFis.setValue(4);
    }
    if(fechaSelec >= new Date('2021-01-31') && fechaSelec <= new Date('2021-02-06')){
      this.monitoreoFg.controls.seFis.setValue(5);
    }
    if(fechaSelec >= new Date('2021-02-07') && fechaSelec <= new Date('2021-02-13')){
      this.monitoreoFg.controls.seFis.setValue(6);
    }
    if(fechaSelec >= new Date('2021-02-14') && fechaSelec <= new Date('2021-02-20')){
      this.monitoreoFg.controls.seFis.setValue(7);
    }
    if(fechaSelec >= new Date('2021-02-21') && fechaSelec <= new Date('2021-02-27')){
      this.monitoreoFg.controls.seFis.setValue(8);
    }
    if(fechaSelec >= new Date('2021-02-28') && fechaSelec <= new Date('2021-03-06')){
      this.monitoreoFg.controls.seFis.setValue(9);
    }
    if(fechaSelec >= new Date('2021-03-07') && fechaSelec <= new Date('2021-03-13')){
      this.monitoreoFg.controls.seFis.setValue(10);
    }
    if(fechaSelec >= new Date('2021-03-14') && fechaSelec <= new Date('2021-03-20')){
      this.monitoreoFg.controls.seFis.setValue(11);
    }
    if(fechaSelec >= new Date('2021-03-21') && fechaSelec <= new Date('2021-03-27')){
      this.monitoreoFg.controls.seFis.setValue(12);
    }
    if(fechaSelec >= new Date('2021-03-28') && fechaSelec <= new Date('2021-04-03')){
      this.monitoreoFg.controls.seFis.setValue(13);
    }
    if(fechaSelec >= new Date('2021-04-04') && fechaSelec <= new Date('2021-04-10')){
      this.monitoreoFg.controls.seFis.setValue(14);
    }
    if(fechaSelec >= new Date('2021-04-11') && fechaSelec <= new Date('2021-04-17')){
      this.monitoreoFg.controls.seFis.setValue(15);
    }
    if(fechaSelec >= new Date('2021-04-18') && fechaSelec <= new Date('2021-04-24')){
      this.monitoreoFg.controls.seFis.setValue(16);
    }
    if(fechaSelec >= new Date('2021-04-25') && fechaSelec <= new Date('2021-05-01')){
      this.monitoreoFg.controls.seFis.setValue(17);
    }
    if(fechaSelec >= new Date('2021-05-02') && fechaSelec <= new Date('2021-05-08')){
      this.monitoreoFg.controls.seFis.setValue(18);
    }
    if(fechaSelec >= new Date('2021-05-09') && fechaSelec <= new Date('2021-05-15')){
      this.monitoreoFg.controls.seFis.setValue(19);
    }
    if(fechaSelec >= new Date('2021-05-16') && fechaSelec <= new Date('2021-05-22')){
      this.monitoreoFg.controls.seFis.setValue(20);
    }
    if(fechaSelec >= new Date('2021-05-23') && fechaSelec <= new Date('2021-05-29')){
      this.monitoreoFg.controls.seFis.setValue(21);
    }
    if(fechaSelec >= new Date('2021-05-30') && fechaSelec <= new Date('2021-06-05')){
      this.monitoreoFg.controls.seFis.setValue(22);
    }
    if(fechaSelec >= new Date('2021-06-06') && fechaSelec <= new Date('2021-06-12')){
      this.monitoreoFg.controls.seFis.setValue(23);
    }
    if(fechaSelec >= new Date('2021-06-13') && fechaSelec <= new Date('2021-06-19')){
      this.monitoreoFg.controls.seFis.setValue(24);
    }
    if(fechaSelec >= new Date('2021-06-20') && fechaSelec <= new Date('2021-06-26')){
      this.monitoreoFg.controls.seFis.setValue(25);
    }
    if(fechaSelec >= new Date('2021-06-27') && fechaSelec <= new Date('2021-07-03')){
      this.monitoreoFg.controls.seFis.setValue(26);
    }
    if(fechaSelec >= new Date('2021-07-04') && fechaSelec <= new Date('2021-07-10')){
      this.monitoreoFg.controls.seFis.setValue(27);
    }
    if(fechaSelec >= new Date('2021-07-11') && fechaSelec <= new Date('2021-07-17')){
      this.monitoreoFg.controls.seFis.setValue(28);
    }
    if(fechaSelec >= new Date('2021-07-18') && fechaSelec <= new Date('2021-07-24')){
      this.monitoreoFg.controls.seFis.setValue(29);
    }
    if(fechaSelec >= new Date('2021-07-25') && fechaSelec <= new Date('2021-07-31')){
      this.monitoreoFg.controls.seFis.setValue(30);
    }
    if(fechaSelec >= new Date('2021-08-01') && fechaSelec <= new Date('2021-08-07')){
      this.monitoreoFg.controls.seFis.setValue(31);
    }
    if(fechaSelec >= new Date('2021-08-08') && fechaSelec <= new Date('2021-08-14')){
      this.monitoreoFg.controls.seFis.setValue(32);
    }
    if(fechaSelec >= new Date('2021-08-15') && fechaSelec <= new Date('2021-08-21')){
      this.monitoreoFg.controls.seFis.setValue(33);
    }
    if(fechaSelec >= new Date('2021-08-22') && fechaSelec <= new Date('2021-08-28')){
      this.monitoreoFg.controls.seFis.setValue(34);
    }
    if(fechaSelec >= new Date('2021-08-29') && fechaSelec <= new Date('2021-09-04')){
      this.monitoreoFg.controls.seFis.setValue(35);
    }
    if(fechaSelec >= new Date('2021-09-05') && fechaSelec <= new Date('2021-09-11')){
      this.monitoreoFg.controls.seFis.setValue(36);
    }
    if(fechaSelec >= new Date('2021-09-12') && fechaSelec <= new Date('2021-09-18')){
      this.monitoreoFg.controls.seFis.setValue(37);
    }
    if(fechaSelec >= new Date('2021-09-19') && fechaSelec <= new Date('2021-09-25')){
      this.monitoreoFg.controls.seFis.setValue(38);
    }
    if(fechaSelec >= new Date('2021-09-26') && fechaSelec <= new Date('2021-10-02')){
      this.monitoreoFg.controls.seFis.setValue(39);
    }
    if(fechaSelec >= new Date('2021-10-03') && fechaSelec <= new Date('2021-10-09')){
      this.monitoreoFg.controls.seFis.setValue(40);
    }
    if(fechaSelec >= new Date('2021-10-10') && fechaSelec <= new Date('2021-10-16')){
      this.monitoreoFg.controls.seFis.setValue(41);
    }
    if(fechaSelec >= new Date('2021-10-17') && fechaSelec <= new Date('2021-10-23')){
      this.monitoreoFg.controls.seFis.setValue(42);
    }
    if(fechaSelec >= new Date('2021-10-24') && fechaSelec <= new Date('2021-10-30')){
      this.monitoreoFg.controls.seFis.setValue(43);
    }
    if(fechaSelec >= new Date('2021-10-31') && fechaSelec <= new Date('2021-11-06')){
      this.monitoreoFg.controls.seFis.setValue(44);
    }
    if(fechaSelec >= new Date('2021-11-07') && fechaSelec <= new Date('2021-11-13')){
      this.monitoreoFg.controls.seFis.setValue(45);
    }
    if(fechaSelec >= new Date('2021-11-14') && fechaSelec <= new Date('2021-11-20')){
      this.monitoreoFg.controls.seFis.setValue(46);
    }
    if(fechaSelec >= new Date('2021-11-21') && fechaSelec <= new Date('2021-11-27')){
      this.monitoreoFg.controls.seFis.setValue(47);
    }
    if(fechaSelec >= new Date('2021-11-28') && fechaSelec <= new Date('2021-12-04')){
      this.monitoreoFg.controls.seFis.setValue(48);
    }
    if(fechaSelec >= new Date('2021-12-05') && fechaSelec <= new Date('2021-12-11')){
      this.monitoreoFg.controls.seFis.setValue(49);
    }
    if(fechaSelec >= new Date('2021-12-12') && fechaSelec <= new Date('2021-12-18')){
      this.monitoreoFg.controls.seFis.setValue(50);
    }
    if(fechaSelec >= new Date('2021-12-19') && fechaSelec <= new Date('2021-12-25')){
      this.monitoreoFg.controls.seFis.setValue(51);
    }
    if(fechaSelec >= new Date('2021-12-26') && fechaSelec <= new Date('2022-01-01')){
      this.monitoreoFg.controls.seFis.setValue(52);
    }
  }

  setearSeMuestra(event){
    let fechaSelec = new Date(event);
    if(fechaSelec >= new Date('2021-01-03') && fechaSelec <= new Date('2021-01-09')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(1);
    }
    if(fechaSelec >= new Date('2021-01-10') && fechaSelec <= new Date('2021-01-16')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(2);
    }
    if(fechaSelec >= new Date('2021-01-17') && fechaSelec <= new Date('2021-01-23')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(3);
    }
    if(fechaSelec >= new Date('2021-01-24') && fechaSelec <= new Date('2021-01-30')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(4);
    }
    if(fechaSelec >= new Date('2021-01-31') && fechaSelec <= new Date('2021-02-06')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(5);
    }
    if(fechaSelec >= new Date('2021-02-07') && fechaSelec <= new Date('2021-02-13')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(6);
    }
    if(fechaSelec >= new Date('2021-02-14') && fechaSelec <= new Date('2021-02-20')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(7);
    }
    if(fechaSelec >= new Date('2021-02-21') && fechaSelec <= new Date('2021-02-27')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(8);
    }
    if(fechaSelec >= new Date('2021-02-28') && fechaSelec <= new Date('2021-03-06')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(9);
    }
    if(fechaSelec >= new Date('2021-03-07') && fechaSelec <= new Date('2021-03-13')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(10);
    }
    if(fechaSelec >= new Date('2021-03-14') && fechaSelec <= new Date('2021-03-20')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(11);
    }
    if(fechaSelec >= new Date('2021-03-21') && fechaSelec <= new Date('2021-03-27')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(12);
    }
    if(fechaSelec >= new Date('2021-03-28') && fechaSelec <= new Date('2021-04-03')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(13);
    }
    if(fechaSelec >= new Date('2021-04-04') && fechaSelec <= new Date('2021-04-10')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(14);
    }
    if(fechaSelec >= new Date('2021-04-11') && fechaSelec <= new Date('2021-04-17')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(15);
    }
    if(fechaSelec >= new Date('2021-04-18') && fechaSelec <= new Date('2021-04-24')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(16);
    }
    if(fechaSelec >= new Date('2021-04-25') && fechaSelec <= new Date('2021-05-01')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(17);
    }
    if(fechaSelec >= new Date('2021-05-02') && fechaSelec <= new Date('2021-05-08')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(18);
    }
    if(fechaSelec >= new Date('2021-05-09') && fechaSelec <= new Date('2021-05-15')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(19);
    }
    if(fechaSelec >= new Date('2021-05-16') && fechaSelec <= new Date('2021-05-22')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(20);
    }
    if(fechaSelec >= new Date('2021-05-23') && fechaSelec <= new Date('2021-05-29')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(21);
    }
    if(fechaSelec >= new Date('2021-05-30') && fechaSelec <= new Date('2021-06-05')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(22);
    }
    if(fechaSelec >= new Date('2021-06-06') && fechaSelec <= new Date('2021-06-12')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(23);
    }
    if(fechaSelec >= new Date('2021-06-13') && fechaSelec <= new Date('2021-06-19')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(24);
    }
    if(fechaSelec >= new Date('2021-06-20') && fechaSelec <= new Date('2021-06-26')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(25);
    }
    if(fechaSelec >= new Date('2021-06-27') && fechaSelec <= new Date('2021-07-03')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(26);
    }
    if(fechaSelec >= new Date('2021-07-04') && fechaSelec <= new Date('2021-07-10')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(27);
    }
    if(fechaSelec >= new Date('2021-07-11') && fechaSelec <= new Date('2021-07-17')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(28);
    }
    if(fechaSelec >= new Date('2021-07-18') && fechaSelec <= new Date('2021-07-24')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(29);
    }
    if(fechaSelec >= new Date('2021-07-25') && fechaSelec <= new Date('2021-07-31')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(30);
    }
    if(fechaSelec >= new Date('2021-08-01') && fechaSelec <= new Date('2021-08-07')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(31);
    }
    if(fechaSelec >= new Date('2021-08-08') && fechaSelec <= new Date('2021-08-14')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(32);
    }
    if(fechaSelec >= new Date('2021-08-15') && fechaSelec <= new Date('2021-08-21')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(33);
    }
    if(fechaSelec >= new Date('2021-08-22') && fechaSelec <= new Date('2021-08-28')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(34);
    }
    if(fechaSelec >= new Date('2021-08-29') && fechaSelec <= new Date('2021-09-04')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(35);
    }
    if(fechaSelec >= new Date('2021-09-05') && fechaSelec <= new Date('2021-09-11')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(36);
    }
    if(fechaSelec >= new Date('2021-09-12') && fechaSelec <= new Date('2021-09-18')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(37);
    }
    if(fechaSelec >= new Date('2021-09-19') && fechaSelec <= new Date('2021-09-25')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(38);
    }
    if(fechaSelec >= new Date('2021-09-26') && fechaSelec <= new Date('2021-10-02')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(39);
    }
    if(fechaSelec >= new Date('2021-10-03') && fechaSelec <= new Date('2021-10-09')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(40);
    }
    if(fechaSelec >= new Date('2021-10-10') && fechaSelec <= new Date('2021-10-16')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(41);
    }
    if(fechaSelec >= new Date('2021-10-17') && fechaSelec <= new Date('2021-10-23')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(42);
    }
    if(fechaSelec >= new Date('2021-10-24') && fechaSelec <= new Date('2021-10-30')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(43);
    }
    if(fechaSelec >= new Date('2021-10-31') && fechaSelec <= new Date('2021-11-06')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(44);
    }
    if(fechaSelec >= new Date('2021-11-07') && fechaSelec <= new Date('2021-11-13')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(45);
    }
    if(fechaSelec >= new Date('2021-11-14') && fechaSelec <= new Date('2021-11-20')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(46);
    }
    if(fechaSelec >= new Date('2021-11-21') && fechaSelec <= new Date('2021-11-27')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(47);
    }
    if(fechaSelec >= new Date('2021-11-28') && fechaSelec <= new Date('2021-12-04')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(48);
    }
    if(fechaSelec >= new Date('2021-12-05') && fechaSelec <= new Date('2021-12-11')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(49);
    }
    if(fechaSelec >= new Date('2021-12-12') && fechaSelec <= new Date('2021-12-18')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(50);
    }
    if(fechaSelec >= new Date('2021-12-19') && fechaSelec <= new Date('2021-12-25')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(51);
    }
    if(fechaSelec >= new Date('2021-12-26') && fechaSelec <= new Date('2022-01-01')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(52);
    }
  }

  setearSeCierreCaso(event){
    let fechaSelec = new Date(event);
    if(fechaSelec >= new Date('2021-01-03') && fechaSelec <= new Date('2021-01-09')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(1);
    }
    if(fechaSelec >= new Date('2021-01-10') && fechaSelec <= new Date('2021-01-16')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(2);
    }
    if(fechaSelec >= new Date('2021-01-17') && fechaSelec <= new Date('2021-01-23')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(3);
    }
    if(fechaSelec >= new Date('2021-01-24') && fechaSelec <= new Date('2021-01-30')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(4);
    }
    if(fechaSelec >= new Date('2021-01-31') && fechaSelec <= new Date('2021-02-06')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(5);
    }
    if(fechaSelec >= new Date('2021-02-07') && fechaSelec <= new Date('2021-02-13')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(6);
    }
    if(fechaSelec >= new Date('2021-02-14') && fechaSelec <= new Date('2021-02-20')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(7);
    }
    if(fechaSelec >= new Date('2021-02-21') && fechaSelec <= new Date('2021-02-27')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(8);
    }
    if(fechaSelec >= new Date('2021-02-28') && fechaSelec <= new Date('2021-03-06')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(9);
    }
    if(fechaSelec >= new Date('2021-03-07') && fechaSelec <= new Date('2021-03-13')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(10);
    }
    if(fechaSelec >= new Date('2021-03-14') && fechaSelec <= new Date('2021-03-20')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(11);
    }
    if(fechaSelec >= new Date('2021-03-21') && fechaSelec <= new Date('2021-03-27')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(12);
    }
    if(fechaSelec >= new Date('2021-03-28') && fechaSelec <= new Date('2021-04-03')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(13);
    }
    if(fechaSelec >= new Date('2021-04-04') && fechaSelec <= new Date('2021-04-10')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(14);
    }
    if(fechaSelec >= new Date('2021-04-11') && fechaSelec <= new Date('2021-04-17')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(15);
    }
    if(fechaSelec >= new Date('2021-04-18') && fechaSelec <= new Date('2021-04-24')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(16);
    }
    if(fechaSelec >= new Date('2021-04-25') && fechaSelec <= new Date('2021-05-01')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(17);
    }
    if(fechaSelec >= new Date('2021-05-02') && fechaSelec <= new Date('2021-05-08')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(18);
    }
    if(fechaSelec >= new Date('2021-05-09') && fechaSelec <= new Date('2021-05-15')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(19);
    }
    if(fechaSelec >= new Date('2021-05-16') && fechaSelec <= new Date('2021-05-22')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(20);
    }
    if(fechaSelec >= new Date('2021-05-23') && fechaSelec <= new Date('2021-05-29')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(21);
    }
    if(fechaSelec >= new Date('2021-05-30') && fechaSelec <= new Date('2021-06-05')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(22);
    }
    if(fechaSelec >= new Date('2021-06-06') && fechaSelec <= new Date('2021-06-12')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(23);
    }
    if(fechaSelec >= new Date('2021-06-13') && fechaSelec <= new Date('2021-06-19')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(24);
    }
    if(fechaSelec >= new Date('2021-06-20') && fechaSelec <= new Date('2021-06-26')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(25);
    }
    if(fechaSelec >= new Date('2021-06-27') && fechaSelec <= new Date('2021-07-03')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(26);
    }
    if(fechaSelec >= new Date('2021-07-04') && fechaSelec <= new Date('2021-07-10')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(27);
    }
    if(fechaSelec >= new Date('2021-07-11') && fechaSelec <= new Date('2021-07-17')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(28);
    }
    if(fechaSelec >= new Date('2021-07-18') && fechaSelec <= new Date('2021-07-24')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(29);
    }
    if(fechaSelec >= new Date('2021-07-25') && fechaSelec <= new Date('2021-07-31')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(30);
    }
    if(fechaSelec >= new Date('2021-08-01') && fechaSelec <= new Date('2021-08-07')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(31);
    }
    if(fechaSelec >= new Date('2021-08-08') && fechaSelec <= new Date('2021-08-14')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(32);
    }
    if(fechaSelec >= new Date('2021-08-15') && fechaSelec <= new Date('2021-08-21')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(33);
    }
    if(fechaSelec >= new Date('2021-08-22') && fechaSelec <= new Date('2021-08-28')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(34);
    }
    if(fechaSelec >= new Date('2021-08-29') && fechaSelec <= new Date('2021-09-04')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(35);
    }
    if(fechaSelec >= new Date('2021-09-05') && fechaSelec <= new Date('2021-09-11')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(36);
    }
    if(fechaSelec >= new Date('2021-09-12') && fechaSelec <= new Date('2021-09-18')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(37);
    }
    if(fechaSelec >= new Date('2021-09-19') && fechaSelec <= new Date('2021-09-25')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(38);
    }
    if(fechaSelec >= new Date('2021-09-26') && fechaSelec <= new Date('2021-10-02')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(39);
    }
    if(fechaSelec >= new Date('2021-10-03') && fechaSelec <= new Date('2021-10-09')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(40);
    }
    if(fechaSelec >= new Date('2021-10-10') && fechaSelec <= new Date('2021-10-16')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(41);
    }
    if(fechaSelec >= new Date('2021-10-17') && fechaSelec <= new Date('2021-10-23')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(42);
    }
    if(fechaSelec >= new Date('2021-10-24') && fechaSelec <= new Date('2021-10-30')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(43);
    }
    if(fechaSelec >= new Date('2021-10-31') && fechaSelec <= new Date('2021-11-06')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(44);
    }
    if(fechaSelec >= new Date('2021-11-07') && fechaSelec <= new Date('2021-11-13')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(45);
    }
    if(fechaSelec >= new Date('2021-11-14') && fechaSelec <= new Date('2021-11-20')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(46);
    }
    if(fechaSelec >= new Date('2021-11-21') && fechaSelec <= new Date('2021-11-27')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(47);
    }
    if(fechaSelec >= new Date('2021-11-28') && fechaSelec <= new Date('2021-12-04')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(48);
    }
    if(fechaSelec >= new Date('2021-12-05') && fechaSelec <= new Date('2021-12-11')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(49);
    }
    if(fechaSelec >= new Date('2021-12-12') && fechaSelec <= new Date('2021-12-18')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(50);
    }
    if(fechaSelec >= new Date('2021-12-19') && fechaSelec <= new Date('2021-12-25')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(51);
    }
    if(fechaSelec >= new Date('2021-12-26') && fechaSelec <= new Date('2022-01-01')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(52);
    }
  }

  selecAmbiente(band){
    if(band ==='salud'){
      this.catContagioOptions = [{value:'asistencia_paciente',label:'Asistencia a paciente con COVID-19'}, {value:'contacto_personal_salud',label:'Contacto con Personal de Salud con COVID-19'},
      {value:'asistencia_penitenciaria',label:'Asistencia en penitenciaría'},{value:'asistencia_albergue',label:'Asistencia en albergues/hotel salud'}];
    }else{
      this.catContagioOptions = [{value:'familiar_social',label:'Familiar Social'}, {value:'viajero',label:'Viajero'},{value:'sin_nexo',label:'Sin Nexo'}];
    }
  }

  setearOtroLugarNoLista(){
    this.registroFg.controls.otroLugarNoLista.setValue(null);
  }

  obtenerPaciente(cedula): void {
    this.loading = true;
    this.formDatosBasicos = null;
    this.service.getPacienteEditar(cedula).subscribe(response => {
        this.loading = false;
        this.registroFg.controls.cedula.setValue(response.numeroDocumento);
        this.registroFg.controls.nombre.setValue(response.nombre);
        this.registroFg.controls.apellido.setValue(response.apellido);
        this.registroFg.controls.sexo.setValue(response.sexo);
        //this.registroFg.controls.fechaNacimiento.setValue(response.fechaNacimiento);
        this.registroFg.controls.fechaNacimiento.setValue(response.fechaNacimiento.substring(8, 10)+'/'+
        response.fechaNacimiento.substring(5, 7)+'/'+response.fechaNacimiento.substring(0, 4));

        this.registroFg.controls.fechaInicioMonitoreo.setValue(response.fechaInicioMonitoreo.substring(8, 10)+'/'+
        response.fechaInicioMonitoreo.substring(5, 7)+'/'+response.fechaInicioMonitoreo.substring(0, 4));

        this.registroFg.controls.se.setValue(response.se);

        console.log(response);
        //21/10/2018
        this.setearFechasTabla(response.fechaInicioSintoma.substring(3, 5)+'/'+response.fechaInicioSintoma.substring(0, 2)+'/'+response.fechaInicioSintoma.substring(6, 10), 'inicio');
       
        this.registroFg.controls.direccion.setValue(response.direccionDomicilio);
        this.registroFg.controls.telefono.setValue(response.numeroCelular);
        this.registroFg.controls.edad.setValue(response.edad);
        this.registroFg.controls.rangoEdad.setValue(response.rangoEdad);
        this.registroFg.controls.ciudadDomicilio.setValue({nombre:response.ciudadDomicilio});
        this.registroFg.controls.barrio.setValue(response.barrio);

        if(response.otroServicio){
          this.registroFg.controls.otroServicio.setValue(true);
          this.registroFg.controls.servicioSalud.setValue(response.servicioSalud);
        }else{
          this.registroFg.controls.servicioSalud.setValue({denominacion:response.servicioSalud});
        }
       
        this.registroFg.controls.regionSanitaria.setValue({nombre:response.regionSanitaria});
        this.registroFg.controls.profesion.setValue({nombre:response.profesion+"-"+response.especialidadProfesion});
        this.registroFg.controls.funcion.setValue({nombre:response.funcion});
        this.registroFg.controls.otrosLugares.setValue(response.otrosLugares);
        this.registroFg.controls.reingreso.setValue(response.reingreso);
        this.registroFg.controls.fallecido.setValue(response.fallecido);
        this.registroFg.controls.codPaciente.setValue(response.codigoPaciente);

        this.registroFg.controls.embarazada.setValue(response.embarazada);
        this.registroFg.controls.cardiopatia.setValue(response.cardiopatia);
        this.registroFg.controls.asma.setValue(response.asma);
        this.registroFg.controls.diabetes.setValue(response.diabetes);
        this.registroFg.controls.enfermedadRenal.setValue(response.enfermedadRenal);
        this.registroFg.controls.obesidad.setValue(response.obesidad);
        this.registroFg.controls.sindromeDown.setValue(response.sindromeDown);
        this.registroFg.controls.enfermedadHepatica.setValue(response.enfermedadHepatica);
        this.registroFg.controls.enfermedadNeurologica.setValue(response.enfermedadNeurologica);
        this.registroFg.controls.inmunodeficiencia.setValue(response.inmunodeprimido);
        this.registroFg.controls.enfermedadOtros.setValue(response.enfermedadOtros);
        this.registroFg.controls.enfermedadOtrosNombre.setValue(response.enfermedadOtrosNombre);

        this.registroFg.controls.ningunaEnfBase.setValue(response.ningunaEnfermedadBase);
        this.registroFg.controls.vacunaCovid.setValue(response.vacunaCovid);

        this.casoConfirmadoFg.controls.cedula.setValue(response.numeroDocumentoContacto);
        this.casoConfirmadoFg.controls.nombre.setValue(response.nombreContacto);
        this.casoConfirmadoFg.controls.apellido.setValue(response.apellidoContacto);
        this.casoConfirmadoFg.controls.sexo.setValue(response.sexoContacto);
        //this.casoConfirmadoFg.controls.fechaExposicion.setValue(response.fechaExposicion.substring(8, 10)+'/'+response.fechaExposicion.substring(5, 7)+'/'+response.fechaExposicion.substring(0, 4));
        this.casoConfirmadoFg.controls.fechaExposicion.setValue(response.fechaExposicion);
        this.casoConfirmadoFg.controls.catContagio.setValue(response.categoriaContagio);
        this.casoConfirmadoFg.controls.contagioAmbiente.setValue(response.contagioAmbiente);
        this.casoConfirmadoFg.controls.contagioEstablecimiento.setValue({denominacion:response.contagioEstablecimiento});

        this.casoConfirmadoFg.controls.clasRiesgo.setValue(response.clasificacionRiesgo);

        if(this.casoConfirmadoFg.controls.otroServicioCheck.value){
          this.casoConfirmadoFg.controls.otroServicioCheck.setValue(response.otroServicioCheck);
          this.casoConfirmadoFg.controls.otroServicioNombre.setValue(response.otroServicioNombre);
        }
        
        //this.consultarIdentificaciones(response.numeroDocumentoContacto,'contacto');

        this.monitoreoFg.controls.fechaSintomas.setValue(response.fechaInicioSintoma);
        this.monitoreoFg.controls.seFis.setValue(response.seFis);

        this.monitoreoFg.controls.sintomatico.setValue(response.sintomatico);

        //response.reportes.sort((a,b)=>(a.fecha < b.fecha ? -1:1));
        this.idRegistroForm = response.reportes[0].registroFormulario;

        this.idReporteSalud1 = response.reportes[0].id;
        this.monitoreoFg.controls.tos1.setValue(response.reportes[0].tos ==null ? null : response.reportes[0].tos == 'true');
        this.monitoreoFg.controls.fiebre1.setValue(response.reportes[0].sentisFiebre ==null ? null : response.reportes[0].sentisFiebre == 'true');
        this.monitoreoFg.controls.dolorCabeza1.setValue(response.reportes[0].dolorCabeza ==null ? null : response.reportes[0].dolorCabeza == 'true');
        this.monitoreoFg.controls.dolorGarganta1.setValue(response.reportes[0].dolorGarganta ==null ? null : response.reportes[0].dolorGarganta == 'true');
        this.monitoreoFg.controls.dificultadRespirar1.setValue(response.reportes[0].dificultadRespirar ==null ? null : response.reportes[0].dificultadRespirar == 'true');
        this.monitoreoFg.controls.congestionNasal1.setValue(response.reportes[0].congestionNasal ==null ? null : response.reportes[0].congestionNasal == 'true');
        this.monitoreoFg.controls.otrosCansancios1.setValue(response.reportes[0].otrosCansancios ==null ? null : response.reportes[0].otrosCansancios == 'true');
        this.monitoreoFg.controls.diarrea1.setValue(response.reportes[0].diarrea ==null ? null : response.reportes[0].diarrea == 'true');
        this.monitoreoFg.controls.dolorOido1.setValue(response.reportes[0].dolorOido ==null ? null : response.reportes[0].dolorOido == 'true');
        this.monitoreoFg.controls.dolorAbdominal1.setValue(response.reportes[0].dolorAbdominal ==null ? null : response.reportes[0].dolorAbdominal == 'true');
        this.monitoreoFg.controls.mialgias1.setValue(response.reportes[0].mialgias ==null ? null : response.reportes[0].mialgias == 'true');
        this.monitoreoFg.controls.artralgias1.setValue(response.reportes[0].artralgias ==null ? null : response.reportes[0].artralgias == 'true');
        this.monitoreoFg.controls.nauseas1.setValue(response.reportes[0].nauseas ==null ? null : response.reportes[0].nauseas == 'true');
        this.monitoreoFg.controls.irritabilidad1.setValue(response.reportes[0].irritabilidad ==null ? null : response.reportes[0].irritabilidad == 'true');
        this.monitoreoFg.controls.auscultacion1.setValue(response.reportes[0].auscultacion ==null ? null : response.reportes[0].auscultacion == 'true');
        this.monitoreoFg.controls.conjuntival1.setValue(response.reportes[0].conjuntival ==null ? null : response.reportes[0].conjuntival == 'true');
        this.monitoreoFg.controls.postracion1.setValue(response.reportes[0].postracion ==null ? null : response.reportes[0].postracion == 'true');
        this.monitoreoFg.controls.convulsiones1.setValue(response.reportes[0].convulsiones ==null ? null : response.reportes[0].convulsiones == 'true');
        
        this.monitoreoFg.controls.disgeusia1.setValue(response.reportes[0].percibeSabores ==null ? null : response.reportes[0].percibeSabores == 'true');
        this.monitoreoFg.controls.anosmia1.setValue(response.reportes[0].percibeOlores ==null ? null : response.reportes[0].percibeOlores == 'true');
        this.monitoreoFg.controls.rinorrea1.setValue(response.reportes[0].secrecionNasal ==null ? null : response.reportes[0].secrecionNasal == 'true');

        this.idReporteSalud2 = response.reportes[1].id;
        this.monitoreoFg.controls.tos2.setValue(response.reportes[1].tos ==null ? null : response.reportes[1].tos == 'true');
        this.monitoreoFg.controls.fiebre2.setValue(response.reportes[1].sentisFiebre ==null ? null : response.reportes[1].sentisFiebre == 'true');
        this.monitoreoFg.controls.dolorCabeza2.setValue(response.reportes[1].dolorCabeza ==null ? null : response.reportes[1].dolorCabeza == 'true');
        this.monitoreoFg.controls.dolorGarganta2.setValue(response.reportes[1].dolorGarganta ==null ? null : response.reportes[1].dolorGarganta == 'true');
        this.monitoreoFg.controls.dificultadRespirar2.setValue(response.reportes[1].dificultadRespirar ==null ? null : response.reportes[1].dificultadRespirar == 'true');
        this.monitoreoFg.controls.percibeOlores2.setValue(response.reportes[1].percibeOlores ==null ? null : response.reportes[1].percibeOlores == 'true');
        this.monitoreoFg.controls.congestionNasal2.setValue(response.reportes[1].congestionNasal ==null ? null : response.reportes[1].congestionNasal == 'true');
        this.monitoreoFg.controls.otrosCansancios2.setValue(response.reportes[1].otrosCansancios ==null ? null : response.reportes[1].otrosCansancios == 'true');

        this.monitoreoFg.controls.diarrea2.setValue(response.reportes[1].diarrea ==null ? null : response.reportes[1].diarrea == 'true');
        this.monitoreoFg.controls.dolorOido2.setValue(response.reportes[1].dolorOido ==null ? null : response.reportes[1].dolorOido == 'true');
        this.monitoreoFg.controls.dolorAbdominal2.setValue(response.reportes[1].dolorAbdominal ==null ? null : response.reportes[1].dolorAbdominal == 'true');
        this.monitoreoFg.controls.mialgias2.setValue(response.reportes[1].mialgias ==null ? null : response.reportes[1].mialgias == 'true');
        this.monitoreoFg.controls.artralgias2.setValue(response.reportes[1].artralgias ==null ? null : response.reportes[1].artralgias == 'true');
        this.monitoreoFg.controls.nauseas2.setValue(response.reportes[1].nauseas ==null ? null : response.reportes[1].nauseas == 'true');
        this.monitoreoFg.controls.irritabilidad2.setValue(response.reportes[1].irritabilidad ==null ? null : response.reportes[1].irritabilidad == 'true');
        this.monitoreoFg.controls.auscultacion2.setValue(response.reportes[1].auscultacion ==null ? null : response.reportes[1].auscultacion == 'true');
        this.monitoreoFg.controls.conjuntival2.setValue(response.reportes[1].conjuntival ==null ? null : response.reportes[1].conjuntival == 'true');
        this.monitoreoFg.controls.postracion2.setValue(response.reportes[1].postracion ==null ? null : response.reportes[1].postracion == 'true');
        this.monitoreoFg.controls.convulsiones2.setValue(response.reportes[1].convulsiones ==null ? null : response.reportes[1].convulsiones == 'true');

        this.monitoreoFg.controls.disgeusia2.setValue(response.reportes[1].percibeSabores ==null ? null : response.reportes[1].percibeSabores == 'true');
        this.monitoreoFg.controls.anosmia2.setValue(response.reportes[1].percibeOlores ==null ? null : response.reportes[1].percibeOlores == 'true');
        this.monitoreoFg.controls.rinorrea2.setValue(response.reportes[1].secrecionNasal ==null ? null : response.reportes[1].secrecionNasal == 'true');

        this.idReporteSalud3 = response.reportes[2].id;
        this.monitoreoFg.controls.tos3.setValue(response.reportes[2].tos ==null ? null : response.reportes[2].tos == 'true');
        this.monitoreoFg.controls.fiebre3.setValue(response.reportes[2].sentisFiebre ==null ? null : response.reportes[2].sentisFiebre == 'true');
        this.monitoreoFg.controls.dolorCabeza3.setValue(response.reportes[2].dolorCabeza ==null ? null : response.reportes[2].dolorCabeza == 'true');
        this.monitoreoFg.controls.dolorGarganta3.setValue(response.reportes[2].dolorGarganta ==null ? null : response.reportes[2].dolorGarganta == 'true');
        this.monitoreoFg.controls.dificultadRespirar3.setValue(response.reportes[2].dificultadRespirar ==null ? null : response.reportes[2].dificultadRespirar == 'true');
        this.monitoreoFg.controls.percibeOlores13.setValue(response.reportes[2].percibeOlores ==null ? null : response.reportes[2].percibeOlores == 'true');
        this.monitoreoFg.controls.congestionNasal3.setValue(response.reportes[2].congestionNasal ==null ? null : response.reportes[2].congestionNasal == 'true');
        this.monitoreoFg.controls.otrosCansancios3.setValue(response.reportes[2].otrosCansancios ==null ? null : response.reportes[2].otrosCansancios == 'true');

        this.monitoreoFg.controls.diarrea3.setValue(response.reportes[2].diarrea ==null ? null : response.reportes[2].diarrea == 'true');
        this.monitoreoFg.controls.dolorOido3.setValue(response.reportes[2].dolorOido ==null ? null : response.reportes[2].dolorOido == 'true');
        this.monitoreoFg.controls.dolorAbdominal3.setValue(response.reportes[2].dolorAbdominal ==null ? null : response.reportes[2].dolorAbdominal == 'true');
        this.monitoreoFg.controls.mialgias3.setValue(response.reportes[2].mialgias ==null ? null : response.reportes[2].mialgias == 'true');
        this.monitoreoFg.controls.artralgias3.setValue(response.reportes[2].artralgias ==null ? null : response.reportes[2].artralgias == 'true');
        this.monitoreoFg.controls.nauseas3.setValue(response.reportes[2].nauseas ==null ? null : response.reportes[2].nauseas == 'true');
        this.monitoreoFg.controls.irritabilidad3.setValue(response.reportes[2].irritabilidad ==null ? null : response.reportes[2].irritabilidad == 'true');
        this.monitoreoFg.controls.auscultacion3.setValue(response.reportes[2].auscultacion ==null ? null : response.reportes[2].auscultacion == 'true');
        this.monitoreoFg.controls.conjuntival3.setValue(response.reportes[2].conjuntival ==null ? null : response.reportes[2].conjuntival == 'true');
        this.monitoreoFg.controls.postracion3.setValue(response.reportes[2].postracion ==null ? null : response.reportes[2].postracion == 'true');
        this.monitoreoFg.controls.convulsiones3.setValue(response.reportes[2].convulsiones ==null ? null : response.reportes[2].convulsiones == 'true');

        this.monitoreoFg.controls.disgeusia3.setValue(response.reportes[2].percibeSabores ==null ? null : response.reportes[2].percibeSabores == 'true');
        this.monitoreoFg.controls.anosmia3.setValue(response.reportes[2].percibeOlores ==null ? null : response.reportes[2].percibeOlores == 'true');
        this.monitoreoFg.controls.rinorrea3.setValue(response.reportes[2].secrecionNasal ==null ? null : response.reportes[2].secrecionNasal == 'true');

        this.idReporteSalud4 = response.reportes[3].id;
        this.monitoreoFg.controls.tos4.setValue(response.reportes[3].tos ==null ? null : response.reportes[3].tos == 'true');
        this.monitoreoFg.controls.fiebre4.setValue(response.reportes[3].sentisFiebre ==null ? null : response.reportes[3].sentisFiebre == 'true');
        this.monitoreoFg.controls.dolorCabeza4.setValue(response.reportes[3].dolorCabeza ==null ? null : response.reportes[3].dolorCabeza == 'true');
        this.monitoreoFg.controls.dolorGarganta4.setValue(response.reportes[3].dolorGarganta ==null ? null : response.reportes[3].dolorGarganta == 'true');
        this.monitoreoFg.controls.dificultadRespirar4.setValue(response.reportes[3].dificultadRespirar ==null ? null : response.reportes[3].dificultadRespirar == 'true');
        this.monitoreoFg.controls.congestionNasal4.setValue(response.reportes[3].congestionNasal ==null ? null : response.reportes[3].congestionNasal == 'true');
        this.monitoreoFg.controls.otrosCansancios4.setValue(response.reportes[3].otrosCansancios ==null ? null : response.reportes[3].otrosCansancios == 'true');
        this.monitoreoFg.controls.diarrea4.setValue(response.reportes[3].diarrea ==null ? null : response.reportes[3].diarrea == 'true');
        this.monitoreoFg.controls.dolorOido4.setValue(response.reportes[3].dolorOido ==null ? null : response.reportes[3].dolorOido == 'true');
        this.monitoreoFg.controls.dolorAbdominal4.setValue(response.reportes[3].dolorAbdominal ==null ? null : response.reportes[3].dolorAbdominal == 'true');
        this.monitoreoFg.controls.mialgias4.setValue(response.reportes[3].mialgias ==null ? null : response.reportes[3].mialgias == 'true');
        this.monitoreoFg.controls.artralgias4.setValue(response.reportes[3].artralgias ==null ? null : response.reportes[3].artralgias == 'true');
        this.monitoreoFg.controls.nauseas4.setValue(response.reportes[3].nauseas ==null ? null : response.reportes[3].nauseas == 'true');
        this.monitoreoFg.controls.irritabilidad4.setValue(response.reportes[3].irritabilidad ==null ? null : response.reportes[3].irritabilidad == 'true');
        this.monitoreoFg.controls.auscultacion4.setValue(response.reportes[3].auscultacion ==null ? null : response.reportes[3].auscultacion == 'true');
        this.monitoreoFg.controls.conjuntival4.setValue(response.reportes[3].conjuntival ==null ? null : response.reportes[3].conjuntival == 'true');
        this.monitoreoFg.controls.postracion4.setValue(response.reportes[3].postracion ==null ? null : response.reportes[3].postracion == 'true');
        this.monitoreoFg.controls.convulsiones4.setValue(response.reportes[3].convulsiones ==null ? null : response.reportes[3].convulsiones == 'true');

        this.monitoreoFg.controls.disgeusia4.setValue(response.reportes[3].percibeSabores ==null ? null : response.reportes[3].percibeSabores == 'true');
        this.monitoreoFg.controls.anosmia4.setValue(response.reportes[3].percibeOlores ==null ? null : response.reportes[3].percibeOlores == 'true');
        this.monitoreoFg.controls.rinorrea4.setValue(response.reportes[3].secrecionNasal ==null ? null : response.reportes[3].secrecionNasal == 'true');

        this.idReporteSalud5 = response.reportes[4].id;
        this.monitoreoFg.controls.tos5.setValue(response.reportes[4].tos ==null ? null : response.reportes[4].tos == 'true');
        this.monitoreoFg.controls.fiebre5.setValue(response.reportes[4].sentisFiebre ==null ? null : response.reportes[4].sentisFiebre == 'true');
        this.monitoreoFg.controls.dolorCabeza5.setValue(response.reportes[4].dolorCabeza ==null ? null : response.reportes[4].dolorCabeza == 'true');
        this.monitoreoFg.controls.dolorGarganta5.setValue(response.reportes[4].dolorGarganta ==null ? null : response.reportes[4].dolorGarganta == 'true');
        this.monitoreoFg.controls.dificultadRespirar5.setValue(response.reportes[4].dificultadRespirar ==null ? null : response.reportes[4].dificultadRespirar == 'true');
        this.monitoreoFg.controls.congestionNasal5.setValue(response.reportes[4].congestionNasal ==null ? null : response.reportes[4].congestionNasal == 'true');
        this.monitoreoFg.controls.otrosCansancios5.setValue(response.reportes[4].otrosCansancios ==null ? null : response.reportes[4].otrosCansancios == 'true');

        this.monitoreoFg.controls.diarrea5.setValue(response.reportes[4].diarrea ==null ? null : response.reportes[4].diarrea == 'true');
        this.monitoreoFg.controls.dolorOido5.setValue(response.reportes[4].dolorOido ==null ? null : response.reportes[4].dolorOido == 'true');
        this.monitoreoFg.controls.dolorAbdominal5.setValue(response.reportes[4].dolorAbdominal ==null ? null : response.reportes[4].dolorAbdominal == 'true');
        this.monitoreoFg.controls.mialgias5.setValue(response.reportes[4].mialgias ==null ? null : response.reportes[4].mialgias == 'true');
        this.monitoreoFg.controls.artralgias5.setValue(response.reportes[4].artralgias ==null ? null : response.reportes[4].artralgias == 'true');
        this.monitoreoFg.controls.nauseas5.setValue(response.reportes[4].nauseas ==null ? null : response.reportes[4].nauseas == 'true');
        this.monitoreoFg.controls.irritabilidad5.setValue(response.reportes[4].irritabilidad ==null ? null : response.reportes[4].irritabilidad == 'true');
        this.monitoreoFg.controls.auscultacion5.setValue(response.reportes[4].auscultacion ==null ? null : response.reportes[4].auscultacion == 'true');
        this.monitoreoFg.controls.conjuntival5.setValue(response.reportes[4].conjuntival ==null ? null : response.reportes[4].conjuntival == 'true');
        this.monitoreoFg.controls.postracion5.setValue(response.reportes[4].postracion ==null ? null : response.reportes[4].postracion == 'true');
        this.monitoreoFg.controls.convulsiones5.setValue(response.reportes[4].convulsiones ==null ? null : response.reportes[4].convulsiones == 'true');

        this.monitoreoFg.controls.disgeusia5.setValue(response.reportes[4].percibeSabores ==null ? null : response.reportes[4].percibeSabores == 'true');
        this.monitoreoFg.controls.anosmia5.setValue(response.reportes[4].percibeOlores ==null ? null : response.reportes[4].percibeOlores == 'true');
        this.monitoreoFg.controls.rinorrea5.setValue(response.reportes[4].secrecionNasal ==null ? null : response.reportes[4].secrecionNasal == 'true');

        this.idReporteSalud6 = response.reportes[5].id;
        this.monitoreoFg.controls.tos6.setValue(response.reportes[5].tos ==null ? null : response.reportes[5].tos == 'true');
        this.monitoreoFg.controls.fiebre6.setValue(response.reportes[5].sentisFiebre ==null ? null : response.reportes[5].sentisFiebre == 'true');
        this.monitoreoFg.controls.dolorCabeza6.setValue(response.reportes[5].dolorCabeza ==null ? null : response.reportes[5].dolorCabeza == 'true');
        this.monitoreoFg.controls.dolorGarganta6.setValue(response.reportes[5].dolorGarganta ==null ? null : response.reportes[5].dolorGarganta == 'true');
        this.monitoreoFg.controls.dificultadRespirar6.setValue(response.reportes[5].dificultadRespirar ==null ? null : response.reportes[5].dificultadRespirar == 'true');
        this.monitoreoFg.controls.congestionNasal6.setValue(response.reportes[5].congestionNasal ==null ? null : response.reportes[5].congestionNasal == 'true');
        this.monitoreoFg.controls.otrosCansancios6.setValue(response.reportes[5].otrosCansancios ==null ? null : response.reportes[5].otrosCansancios == 'true');

        this.monitoreoFg.controls.diarrea6.setValue(response.reportes[5].diarrea ==null ? null : response.reportes[5].diarrea == 'true');
        this.monitoreoFg.controls.dolorOido6.setValue(response.reportes[5].dolorOido ==null ? null : response.reportes[5].dolorOido == 'true');
        this.monitoreoFg.controls.dolorAbdominal6.setValue(response.reportes[5].dolorAbdominal ==null ? null : response.reportes[5].dolorAbdominal == 'true');
        this.monitoreoFg.controls.mialgias6.setValue(response.reportes[5].mialgias ==null ? null : response.reportes[5].mialgias == 'true');
        this.monitoreoFg.controls.artralgias6.setValue(response.reportes[5].artralgias ==null ? null : response.reportes[5].artralgias == 'true');
        this.monitoreoFg.controls.nauseas6.setValue(response.reportes[5].nauseas ==null ? null : response.reportes[5].nauseas == 'true');
        this.monitoreoFg.controls.irritabilidad6.setValue(response.reportes[5].irritabilidad ==null ? null : response.reportes[5].irritabilidad == 'true');
        this.monitoreoFg.controls.auscultacion6.setValue(response.reportes[5].auscultacion ==null ? null : response.reportes[5].auscultacion == 'true');
        this.monitoreoFg.controls.conjuntival6.setValue(response.reportes[5].conjuntival ==null ? null : response.reportes[5].conjuntival == 'true');
        this.monitoreoFg.controls.postracion6.setValue(response.reportes[5].postracion ==null ? null : response.reportes[5].postracion == 'true');
        this.monitoreoFg.controls.convulsiones6.setValue(response.reportes[5].convulsiones ==null ? null : response.reportes[5].convulsiones == 'true');

        this.monitoreoFg.controls.disgeusia6.setValue(response.reportes[5].percibeSabores ==null ? null : response.reportes[5].percibeSabores == 'true');
        this.monitoreoFg.controls.anosmia6.setValue(response.reportes[5].percibeOlores ==null ? null : response.reportes[5].percibeOlores == 'true');
        this.monitoreoFg.controls.rinorrea6.setValue(response.reportes[5].secrecionNasal ==null ? null : response.reportes[5].secrecionNasal == 'true');

        this.idReporteSalud7 = response.reportes[6].id;
        this.monitoreoFg.controls.tos7.setValue(response.reportes[6].tos ==null ? null : response.reportes[6].tos == 'true');
        this.monitoreoFg.controls.fiebre7.setValue(response.reportes[6].sentisFiebre ==null ? null : response.reportes[6].sentisFiebre == 'true');
        this.monitoreoFg.controls.dolorCabeza7.setValue(response.reportes[6].dolorCabeza ==null ? null : response.reportes[6].dolorCabeza == 'true');
        this.monitoreoFg.controls.dolorGarganta7.setValue(response.reportes[6].dolorGarganta ==null ? null : response.reportes[6].dolorGarganta == 'true');
        this.monitoreoFg.controls.dificultadRespirar7.setValue(response.reportes[6].dificultadRespirar ==null ? null : response.reportes[6].dificultadRespirar == 'true');
        this.monitoreoFg.controls.congestionNasal7.setValue(response.reportes[6].congestionNasal ==null ? null : response.reportes[6].congestionNasal == 'true');
        this.monitoreoFg.controls.otrosCansancios7.setValue(response.reportes[6].otrosCansancios ==null ? null : response.reportes[6].otrosCansancios == 'true');
        this.monitoreoFg.controls.diarrea7.setValue(response.reportes[6].diarrea ==null ? null : response.reportes[6].diarrea == 'true');
        this.monitoreoFg.controls.dolorOido7.setValue(response.reportes[6].dolorOido ==null ? null : response.reportes[6].dolorOido == 'true');
        this.monitoreoFg.controls.dolorAbdominal7.setValue(response.reportes[6].dolorAbdominal ==null ? null : response.reportes[6].dolorAbdominal == 'true');
        this.monitoreoFg.controls.mialgias7.setValue(response.reportes[6].mialgias ==null ? null : response.reportes[6].mialgias == 'true');
        this.monitoreoFg.controls.artralgias7.setValue(response.reportes[6].artralgias ==null ? null : response.reportes[6].artralgias == 'true');
        this.monitoreoFg.controls.nauseas7.setValue(response.reportes[6].nauseas ==null ? null : response.reportes[6].nauseas == 'true');
        this.monitoreoFg.controls.irritabilidad7.setValue(response.reportes[6].irritabilidad ==null ? null : response.reportes[6].irritabilidad == 'true');
        this.monitoreoFg.controls.auscultacion7.setValue(response.reportes[6].auscultacion ==null ? null : response.reportes[6].auscultacion == 'true');
        this.monitoreoFg.controls.conjuntival7.setValue(response.reportes[6].conjuntival ==null ? null : response.reportes[6].conjuntival == 'true');
        this.monitoreoFg.controls.postracion7.setValue(response.reportes[6].postracion ==null ? null : response.reportes[6].postracion == 'true');
        this.monitoreoFg.controls.convulsiones7.setValue(response.reportes[6].convulsiones ==null ? null : response.reportes[6].convulsiones == 'true');

        this.monitoreoFg.controls.disgeusia7.setValue(response.reportes[6].percibeSabores ==null ? null : response.reportes[6].percibeSabores == 'true');
        this.monitoreoFg.controls.anosmia7.setValue(response.reportes[6].percibeOlores ==null ? null : response.reportes[6].percibeOlores == 'true');
        this.monitoreoFg.controls.rinorrea7.setValue(response.reportes[6].secrecionNasal ==null ? null : response.reportes[6].secrecionNasal == 'true');

        this.idReporteSalud8 = response.reportes[7].id;
        this.monitoreoFg.controls.tos8.setValue(response.reportes[7].tos ==null ? null : response.reportes[7].tos == 'true');
        this.monitoreoFg.controls.fiebre8.setValue(response.reportes[7].sentisFiebre ==null ? null : response.reportes[7].sentisFiebre == 'true');
        this.monitoreoFg.controls.dolorCabeza8.setValue(response.reportes[7].dolorCabeza ==null ? null : response.reportes[7].dolorCabeza == 'true');
        this.monitoreoFg.controls.dolorGarganta8.setValue(response.reportes[7].dolorGarganta ==null ? null : response.reportes[7].dolorGarganta == 'true');
        this.monitoreoFg.controls.dificultadRespirar8.setValue(response.reportes[7].dificultadRespirar ==null ? null : response.reportes[7].dificultadRespirar == 'true');
        this.monitoreoFg.controls.congestionNasal8.setValue(response.reportes[7].congestionNasal ==null ? null : response.reportes[7].congestionNasal == 'true');
        this.monitoreoFg.controls.otrosCansancios8.setValue(response.reportes[7].otrosCansancios ==null ? null : response.reportes[7].otrosCansancios == 'true');
        this.monitoreoFg.controls.diarrea8.setValue(response.reportes[7].diarrea ==null ? null : response.reportes[7].diarrea == 'true');
        this.monitoreoFg.controls.dolorOido8.setValue(response.reportes[7].dolorOido ==null ? null : response.reportes[7].dolorOido == 'true');
        this.monitoreoFg.controls.dolorAbdominal8.setValue(response.reportes[7].dolorAbdominal ==null ? null : response.reportes[7].dolorAbdominal == 'true');
        this.monitoreoFg.controls.mialgias8.setValue(response.reportes[7].mialgias ==null ? null : response.reportes[7].mialgias == 'true');
        this.monitoreoFg.controls.artralgias8.setValue(response.reportes[7].artralgias ==null ? null : response.reportes[7].artralgias == 'true');
        this.monitoreoFg.controls.nauseas8.setValue(response.reportes[7].nauseas ==null ? null : response.reportes[7].nauseas == 'true');
        this.monitoreoFg.controls.irritabilidad8.setValue(response.reportes[7].irritabilidad ==null ? null : response.reportes[7].irritabilidad == 'true');
        this.monitoreoFg.controls.auscultacion8.setValue(response.reportes[7].auscultacion ==null ? null : response.reportes[7].auscultacion == 'true');
        this.monitoreoFg.controls.conjuntival8.setValue(response.reportes[7].conjuntival ==null ? null : response.reportes[7].conjuntival == 'true');
        this.monitoreoFg.controls.postracion8.setValue(response.reportes[7].postracion ==null ? null : response.reportes[7].postracion == 'true');
        this.monitoreoFg.controls.convulsiones8.setValue(response.reportes[7].convulsiones ==null ? null : response.reportes[7].convulsiones == 'true');

        this.monitoreoFg.controls.disgeusia8.setValue(response.reportes[7].percibeSabores ==null ? null : response.reportes[7].percibeSabores == 'true');
        this.monitoreoFg.controls.anosmia8.setValue(response.reportes[7].percibeOlores ==null ? null : response.reportes[7].percibeOlores == 'true');
        this.monitoreoFg.controls.rinorrea8.setValue(response.reportes[7].secrecionNasal ==null ? null : response.reportes[7].secrecionNasal == 'true');

        this.idReporteSalud9 = response.reportes[8].id;
        this.monitoreoFg.controls.tos9.setValue(response.reportes[8].tos ==null ? null : response.reportes[8].tos == 'true');
        this.monitoreoFg.controls.fiebre9.setValue(response.reportes[8].sentisFiebre ==null ? null : response.reportes[8].sentisFiebre == 'true');
        this.monitoreoFg.controls.dolorCabeza9.setValue(response.reportes[8].dolorCabeza ==null ? null : response.reportes[8].dolorCabeza == 'true');
        this.monitoreoFg.controls.dolorGarganta9.setValue(response.reportes[8].dolorGarganta ==null ? null : response.reportes[8].dolorGarganta == 'true');
        this.monitoreoFg.controls.dificultadRespirar9.setValue(response.reportes[8].dificultadRespirar ==null ? null : response.reportes[8].dificultadRespirar == 'true');
        this.monitoreoFg.controls.congestionNasal9.setValue(response.reportes[8].congestionNasal ==null ? null : response.reportes[8].congestionNasal == 'true');
        this.monitoreoFg.controls.otrosCansancios9.setValue(response.reportes[8].otrosCansancios ==null ? null : response.reportes[8].otrosCansancios == 'true');

        this.monitoreoFg.controls.diarrea9.setValue(response.reportes[8].diarrea ==null ? null : response.reportes[8].diarrea == 'true');
        this.monitoreoFg.controls.dolorOido9.setValue(response.reportes[8].dolorOido ==null ? null : response.reportes[8].dolorOido == 'true');
        this.monitoreoFg.controls.dolorAbdominal9.setValue(response.reportes[8].dolorAbdominal ==null ? null : response.reportes[8].dolorAbdominal == 'true');
        this.monitoreoFg.controls.mialgias9.setValue(response.reportes[8].mialgias ==null ? null : response.reportes[8].mialgias == 'true');
        this.monitoreoFg.controls.artralgias9.setValue(response.reportes[8].artralgias ==null ? null : response.reportes[8].artralgias == 'true');
        this.monitoreoFg.controls.nauseas9.setValue(response.reportes[8].nauseas ==null ? null : response.reportes[8].nauseas == 'true');
        this.monitoreoFg.controls.irritabilidad9.setValue(response.reportes[8].irritabilidad ==null ? null : response.reportes[8].irritabilidad == 'true');
        this.monitoreoFg.controls.auscultacion9.setValue(response.reportes[8].auscultacion ==null ? null : response.reportes[8].auscultacion == 'true');
        this.monitoreoFg.controls.conjuntival9.setValue(response.reportes[8].conjuntival ==null ? null : response.reportes[8].conjuntival == 'true');
        this.monitoreoFg.controls.postracion9.setValue(response.reportes[8].postracion ==null ? null : response.reportes[8].postracion == 'true');
        this.monitoreoFg.controls.convulsiones9.setValue(response.reportes[8].convulsiones ==null ? null : response.reportes[8].convulsiones == 'true');

        this.monitoreoFg.controls.disgeusia9.setValue(response.reportes[8].percibeSabores ==null ? null : response.reportes[8].percibeSabores == 'true');
        this.monitoreoFg.controls.anosmia9.setValue(response.reportes[8].percibeOlores ==null ? null : response.reportes[8].percibeOlores == 'true');
        this.monitoreoFg.controls.rinorrea9.setValue(response.reportes[8].secrecionNasal ==null ? null : response.reportes[8].secrecionNasal == 'true');

        this.idReporteSalud10 = response.reportes[9].id;
        this.monitoreoFg.controls.tos10.setValue(response.reportes[9].tos ==null ? null : response.reportes[9].tos == 'true');
        this.monitoreoFg.controls.fiebre10.setValue(response.reportes[9].sentisFiebre ==null ? null : response.reportes[9].sentisFiebre == 'true');
        this.monitoreoFg.controls.dolorCabeza10.setValue(response.reportes[9].dolorCabeza ==null ? null : response.reportes[9].dolorCabeza == 'true');
        this.monitoreoFg.controls.dolorGarganta10.setValue(response.reportes[9].dolorGarganta ==null ? null : response.reportes[9].dolorGarganta == 'true');
        this.monitoreoFg.controls.dificultadRespirar10.setValue(response.reportes[9].dificultadRespirar ==null ? null : response.reportes[9].dificultadRespirar == 'true');
        this.monitoreoFg.controls.congestionNasal10.setValue(response.reportes[9].congestionNasal ==null ? null : response.reportes[9].congestionNasal == 'true');
        this.monitoreoFg.controls.otrosCansancios10.setValue(response.reportes[9].otrosCansancios ==null ? null : response.reportes[9].otrosCansancios == 'true');

        this.monitoreoFg.controls.diarrea10.setValue(response.reportes[9].diarrea ==null ? null : response.reportes[9].diarrea == 'true');
        this.monitoreoFg.controls.dolorOido10.setValue(response.reportes[9].dolorOido ==null ? null : response.reportes[9].dolorOido == 'true');
        this.monitoreoFg.controls.dolorAbdominal10.setValue(response.reportes[9].dolorAbdominal ==null ? null : response.reportes[9].dolorAbdominal == 'true');
        this.monitoreoFg.controls.mialgias10.setValue(response.reportes[9].mialgias ==null ? null : response.reportes[9].mialgias == 'true');
        this.monitoreoFg.controls.artralgias10.setValue(response.reportes[9].artralgias ==null ? null : response.reportes[9].artralgias == 'true');
        this.monitoreoFg.controls.nauseas10.setValue(response.reportes[9].nauseas ==null ? null : response.reportes[9].nauseas == 'true');
        this.monitoreoFg.controls.irritabilidad10.setValue(response.reportes[9].irritabilidad ==null ? null : response.reportes[9].irritabilidad == 'true');
        this.monitoreoFg.controls.auscultacion10.setValue(response.reportes[9].auscultacion ==null ? null : response.reportes[9].auscultacion == 'true');
        this.monitoreoFg.controls.conjuntival10.setValue(response.reportes[9].conjuntival ==null ? null : response.reportes[9].conjuntival == 'true');
        this.monitoreoFg.controls.postracion10.setValue(response.reportes[9].postracion ==null ? null : response.reportes[9].postracion == 'true');
        this.monitoreoFg.controls.convulsiones10.setValue(response.reportes[9].convulsiones ==null ? null : response.reportes[9].convulsiones == 'true');

        this.monitoreoFg.controls.disgeusia10.setValue(response.reportes[9].percibeSabores ==null ? null : response.reportes[9].percibeSabores == 'true');
        this.monitoreoFg.controls.anosmia10.setValue(response.reportes[9].percibeOlores ==null ? null : response.reportes[9].percibeOlores == 'true');
        this.monitoreoFg.controls.rinorrea10.setValue(response.reportes[9].secrecionNasal ==null ? null : response.reportes[9].secrecionNasal == 'true');

        this.idReporteSalud11 = response.reportes[10].id;
        this.monitoreoFg.controls.tos11.setValue(response.reportes[10].tos ==null ? null : response.reportes[10].tos == 'true');
        this.monitoreoFg.controls.fiebre11.setValue(response.reportes[10].sentisFiebre ==null ? null : response.reportes[10].sentisFiebre == 'true');
        this.monitoreoFg.controls.dolorCabeza11.setValue(response.reportes[10].dolorCabeza ==null ? null : response.reportes[10].dolorCabeza == 'true');
        this.monitoreoFg.controls.dolorGarganta11.setValue(response.reportes[10].dolorGarganta ==null ? null : response.reportes[10].dolorGarganta == 'true');
        this.monitoreoFg.controls.dificultadRespirar11.setValue(response.reportes[10].dificultadRespirar ==null ? null : response.reportes[10].dificultadRespirar == 'true');
        this.monitoreoFg.controls.congestionNasal11.setValue(response.reportes[10].congestionNasal ==null ? null : response.reportes[10].congestionNasal == 'true');
        this.monitoreoFg.controls.otrosCansancios11.setValue(response.reportes[10].otrosCansancios ==null ? null : response.reportes[10].otrosCansancios == 'true');

        this.monitoreoFg.controls.diarrea11.setValue(response.reportes[10].diarrea ==null ? null : response.reportes[10].diarrea == 'true');
        this.monitoreoFg.controls.dolorOido11.setValue(response.reportes[10].dolorOido ==null ? null : response.reportes[10].dolorOido == 'true');
        this.monitoreoFg.controls.dolorAbdominal11.setValue(response.reportes[10].dolorAbdominal ==null ? null : response.reportes[10].dolorAbdominal == 'true');
        this.monitoreoFg.controls.mialgias11.setValue(response.reportes[10].mialgias ==null ? null : response.reportes[10].mialgias == 'true');
        this.monitoreoFg.controls.artralgias11.setValue(response.reportes[10].artralgias ==null ? null : response.reportes[10].artralgias == 'true');
        this.monitoreoFg.controls.nauseas11.setValue(response.reportes[10].nauseas ==null ? null : response.reportes[10].nauseas == 'true');
        this.monitoreoFg.controls.irritabilidad11.setValue(response.reportes[10].irritabilidad ==null ? null : response.reportes[10].irritabilidad == 'true');
        this.monitoreoFg.controls.auscultacion11.setValue(response.reportes[10].auscultacion ==null ? null : response.reportes[10].auscultacion == 'true');
        this.monitoreoFg.controls.conjuntival11.setValue(response.reportes[10].conjuntival ==null ? null : response.reportes[10].conjuntival == 'true');
        this.monitoreoFg.controls.postracion11.setValue(response.reportes[10].postracion ==null ? null : response.reportes[10].postracion == 'true');
        this.monitoreoFg.controls.convulsiones11.setValue(response.reportes[10].convulsiones ==null ? null : response.reportes[10].convulsiones == 'true');

        this.monitoreoFg.controls.disgeusia11.setValue(response.reportes[10].percibeSabores ==null ? null : response.reportes[10].percibeSabores == 'true');
        this.monitoreoFg.controls.anosmia11.setValue(response.reportes[10].percibeOlores ==null ? null : response.reportes[10].percibeOlores == 'true');
        this.monitoreoFg.controls.rinorrea11.setValue(response.reportes[10].secrecionNasal ==null ? null : response.reportes[10].secrecionNasal == 'true');

        this.idReporteSalud12 = response.reportes[11].id;
        this.monitoreoFg.controls.tos12.setValue(response.reportes[11].tos ==null ? null : response.reportes[11].tos == 'true');
        this.monitoreoFg.controls.fiebre12.setValue(response.reportes[11].sentisFiebre ==null ? null : response.reportes[11].sentisFiebre == 'true');
        this.monitoreoFg.controls.dolorCabeza12.setValue(response.reportes[11].dolorCabeza ==null ? null : response.reportes[11].dolorCabeza == 'true');
        this.monitoreoFg.controls.dolorGarganta12.setValue(response.reportes[11].dolorGarganta ==null ? null : response.reportes[11].dolorGarganta == 'true');
        this.monitoreoFg.controls.dificultadRespirar12.setValue(response.reportes[11].dificultadRespirar ==null ? null : response.reportes[11].dificultadRespirar == 'true');
        this.monitoreoFg.controls.congestionNasal12.setValue(response.reportes[11].congestionNasal ==null ? null : response.reportes[11].congestionNasal == 'true');
        this.monitoreoFg.controls.otrosCansancios12.setValue(response.reportes[11].otrosCansancios ==null ? null : response.reportes[11].otrosCansancios == 'true');

        this.monitoreoFg.controls.diarrea12.setValue(response.reportes[11].diarrea ==null ? null : response.reportes[11].diarrea == 'true');
        this.monitoreoFg.controls.dolorOido12.setValue(response.reportes[11].dolorOido ==null ? null : response.reportes[11].dolorOido == 'true');
        this.monitoreoFg.controls.dolorAbdominal12.setValue(response.reportes[11].dolorAbdominal ==null ? null : response.reportes[11].dolorAbdominal == 'true');
        this.monitoreoFg.controls.mialgias12.setValue(response.reportes[11].mialgias ==null ? null : response.reportes[11].mialgias == 'true');
        this.monitoreoFg.controls.artralgias12.setValue(response.reportes[11].artralgias ==null ? null : response.reportes[11].artralgias == 'true');
        this.monitoreoFg.controls.nauseas12.setValue(response.reportes[11].nauseas ==null ? null : response.reportes[11].nauseas == 'true');
        this.monitoreoFg.controls.irritabilidad12.setValue(response.reportes[11].irritabilidad ==null ? null : response.reportes[11].irritabilidad == 'true');
        this.monitoreoFg.controls.auscultacion12.setValue(response.reportes[11].auscultacion ==null ? null : response.reportes[11].auscultacion == 'true');
        this.monitoreoFg.controls.conjuntival12.setValue(response.reportes[11].conjuntival ==null ? null : response.reportes[11].conjuntival == 'true');
        this.monitoreoFg.controls.postracion12.setValue(response.reportes[11].postracion ==null ? null : response.reportes[11].postracion == 'true');
        this.monitoreoFg.controls.convulsiones12.setValue(response.reportes[11].convulsiones ==null ? null : response.reportes[11].convulsiones == 'true');

        this.monitoreoFg.controls.disgeusia12.setValue(response.reportes[11].percibeSabores ==null ? null : response.reportes[11].percibeSabores == 'true');
        this.monitoreoFg.controls.anosmia12.setValue(response.reportes[11].percibeOlores ==null ? null : response.reportes[11].percibeOlores == 'true');
        this.monitoreoFg.controls.rinorrea12.setValue(response.reportes[11].secrecionNasal ==null ? null : response.reportes[11].secrecionNasal == 'true');

        this.idReporteSalud13 = response.reportes[12].id;
        this.monitoreoFg.controls.tos13.setValue(response.reportes[12].tos ==null ? null : response.reportes[12].tos == 'true');
        this.monitoreoFg.controls.fiebre13.setValue(response.reportes[12].sentisFiebre ==null ? null : response.reportes[12].sentisFiebre == 'true');
        this.monitoreoFg.controls.dolorCabeza13.setValue(response.reportes[12].dolorCabeza ==null ? null : response.reportes[12].dolorCabeza == 'true');
        this.monitoreoFg.controls.dolorGarganta13.setValue(response.reportes[12].dolorGarganta ==null ? null : response.reportes[12].dolorGarganta == 'true');
        this.monitoreoFg.controls.dificultadRespirar13.setValue(response.reportes[12].dificultadRespirar ==null ? null : response.reportes[12].dificultadRespirar == 'true');
        this.monitoreoFg.controls.congestionNasal13.setValue(response.reportes[12].congestionNasal ==null ? null : response.reportes[12].congestionNasal == 'true');
        this.monitoreoFg.controls.otrosCansancios13.setValue(response.reportes[12].otrosCansancios ==null ? null : response.reportes[12].otrosCansancios == 'true');

        this.monitoreoFg.controls.diarrea13.setValue(response.reportes[12].diarrea ==null ? null : response.reportes[12].diarrea == 'true');
        this.monitoreoFg.controls.dolorOido13.setValue(response.reportes[12].dolorOido ==null ? null : response.reportes[12].dolorOido == 'true');
        this.monitoreoFg.controls.dolorAbdominal13.setValue(response.reportes[12].dolorAbdominal ==null ? null : response.reportes[12].dolorAbdominal == 'true');
        this.monitoreoFg.controls.mialgias13.setValue(response.reportes[12].mialgias ==null ? null : response.reportes[12].mialgias == 'true');
        this.monitoreoFg.controls.artralgias13.setValue(response.reportes[12].artralgias ==null ? null : response.reportes[12].artralgias == 'true');
        this.monitoreoFg.controls.nauseas13.setValue(response.reportes[12].nauseas ==null ? null : response.reportes[12].nauseas == 'true');
        this.monitoreoFg.controls.irritabilidad13.setValue(response.reportes[12].irritabilidad ==null ? null : response.reportes[12].irritabilidad == 'true');
        this.monitoreoFg.controls.auscultacion13.setValue(response.reportes[12].auscultacion ==null ? null : response.reportes[12].auscultacion == 'true');
        this.monitoreoFg.controls.conjuntival13.setValue(response.reportes[12].conjuntival ==null ? null : response.reportes[12].conjuntival == 'true');
        this.monitoreoFg.controls.postracion13.setValue(response.reportes[12].postracion ==null ? null : response.reportes[12].postracion == 'true');
        this.monitoreoFg.controls.convulsiones13.setValue(response.reportes[12].convulsiones ==null ? null : response.reportes[12].convulsiones == 'true');

        this.monitoreoFg.controls.disgeusia13.setValue(response.reportes[12].percibeSabores ==null ? null : response.reportes[12].percibeSabores == 'true');
        this.monitoreoFg.controls.anosmia13.setValue(response.reportes[12].percibeOlores ==null ? null : response.reportes[12].percibeOlores == 'true');
        this.monitoreoFg.controls.rinorrea13.setValue(response.reportes[12].secrecionNasal ==null ? null : response.reportes[12].secrecionNasal == 'true');

        this.idReporteSalud14 = response.reportes[13].id;
        this.monitoreoFg.controls.tos14.setValue(response.reportes[13].tos ==null ? null : response.reportes[13].tos == 'true');
        this.monitoreoFg.controls.fiebre14.setValue(response.reportes[13].sentisFiebre ==null ? null : response.reportes[13].sentisFiebre == 'true');
        this.monitoreoFg.controls.dolorCabeza14.setValue(response.reportes[13].dolorCabeza ==null ? null : response.reportes[13].dolorCabeza == 'true');
        this.monitoreoFg.controls.dolorGarganta14.setValue(response.reportes[13].dolorGarganta ==null ? null : response.reportes[13].dolorGarganta == 'true');
        this.monitoreoFg.controls.dificultadRespirar14.setValue(response.reportes[13].dificultadRespirar ==null ? null : response.reportes[13].dificultadRespirar == 'true');
        this.monitoreoFg.controls.congestionNasal14.setValue(response.reportes[13].congestionNasal ==null ? null : response.reportes[13].congestionNasal == 'true');
        this.monitoreoFg.controls.otrosCansancios14.setValue(response.reportes[13].otrosCansancios ==null ? null : response.reportes[13].otrosCansancios == 'true');

        this.monitoreoFg.controls.diarrea14.setValue(response.reportes[13].diarrea ==null ? null : response.reportes[13].diarrea == 'true');
        this.monitoreoFg.controls.dolorOido14.setValue(response.reportes[13].dolorOido ==null ? null : response.reportes[13].dolorOido == 'true');
        this.monitoreoFg.controls.dolorAbdominal14.setValue(response.reportes[13].dolorAbdominal ==null ? null : response.reportes[13].dolorAbdominal == 'true');
        this.monitoreoFg.controls.mialgias14.setValue(response.reportes[13].mialgias ==null ? null : response.reportes[13].mialgias == 'true');
        this.monitoreoFg.controls.artralgias14.setValue(response.reportes[13].artralgias ==null ? null : response.reportes[13].artralgias == 'true');
        this.monitoreoFg.controls.nauseas14.setValue(response.reportes[13].nauseas ==null ? null : response.reportes[13].nauseas == 'true');
        this.monitoreoFg.controls.irritabilidad14.setValue(response.reportes[13].irritabilidad ==null ? null : response.reportes[13].irritabilidad == 'true');
        this.monitoreoFg.controls.auscultacion14.setValue(response.reportes[13].auscultacion ==null ? null : response.reportes[13].auscultacion == 'true');
        this.monitoreoFg.controls.conjuntival14.setValue(response.reportes[13].conjuntival ==null ? null : response.reportes[13].conjuntival == 'true');
        this.monitoreoFg.controls.postracion14.setValue(response.reportes[13].postracion ==null ? null : response.reportes[13].postracion == 'true');
        this.monitoreoFg.controls.convulsiones14.setValue(response.reportes[13].convulsiones ==null ? null : response.reportes[13].convulsiones == 'true');

        this.monitoreoFg.controls.disgeusia14.setValue(response.reportes[13].percibeSabores ==null ? null : response.reportes[13].percibeSabores == 'true');
        this.monitoreoFg.controls.anosmia14.setValue(response.reportes[13].percibeOlores ==null ? null : response.reportes[13].percibeOlores == 'true');
        this.monitoreoFg.controls.rinorrea14.setValue(response.reportes[13].secrecionNasal ==null ? null : response.reportes[13].secrecionNasal == 'true');

        this.registroFg.controls.fechaInicioMonitoreo.setValue(response.fechaInicioMonitoreo.substring(8, 10)+'/'+
        response.fechaInicioMonitoreo.substring(5, 7)+'/'+response.fechaInicioMonitoreo.substring(0, 4));
        this.clasificacionRiesgoFg.controls.exclusion.setValue(response.trabajoExclusion);
        this.clasificacionRiesgoFg.controls.autocontrol.setValue(response.trabajoAutocontrol);
        this.clasificacionRiesgoFg.controls.nada.setValue(response.trabajoNada);
        this.clasificacionRiesgoFg.controls.otroIndic.setValue(response.trabajoOtro);
        this.clasificacionRiesgoFg.controls.otroIndicEspecificar.setValue(response.trabajoOtroDescripcion);
        this.clasificacionRiesgoFg.controls.antigeno.setValue(response.laboratorioAntigeno);
        this.clasificacionRiesgoFg.controls.pcr.setValue(response.laboratorioPcr);
        this.clasificacionRiesgoFg.controls.ningunoLab.setValue(response.laboratorioNinguno);
        this.clasificacionRiesgoFg.controls.clasifFinal.setValue(response.clasificacionFinal);

        this.clasificacionRiesgoFg.controls.constAislamiento.setValue(response.constanciaAislamiento);
        this.clasificacionRiesgoFg.controls.fichaEpidemiologica.setValue(response.fichaEpidemiologica);
        this.clasificacionRiesgoFg.controls.evolucionFinal.setValue(response.evolucionFinal);
        this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(response.sePrimeraMuestra);
        this.clasificacionRiesgoFg.controls.resultadoPrimeraMuestra.setValue(response.resultadoPrimeraMuestra);
        this.clasificacionRiesgoFg.controls.fechaPrimeraMuestra.setValue(response.fechaPrimeraMuestra.substring(8, 10)+'/'+
        response.fechaPrimeraMuestra.substring(5, 7)+'/'+response.fechaPrimeraMuestra.substring(0, 4));
        this.clasificacionRiesgoFg.controls.fechaCierreCaso.setValue(response.fechaCierreCaso.substring(8, 10)+'/'+
        response.fechaCierreCaso.substring(5, 7)+'/'+response.fechaCierreCaso.substring(0, 4));

        this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(response.seCierreCaso);

        this.clasificacionRiesgoFg.controls.internado.setValue(response.internado);
        this.clasificacionRiesgoFg.controls.establecimiento.setValue({denominacion:response.establecimientoInternacion});
        this.clasificacionRiesgoFg.controls.especialidad.setValue(response.especialidadInternacion);

        if(this.clasificacionRiesgoFg.controls.otroServicioInternadoCheck.value){
          this.clasificacionRiesgoFg.controls.otroServicioInternadoCheck.setValue(response.otroServicioInternadoCheck);
          this.clasificacionRiesgoFg.controls.otroServicioInternado.setValue(response.otroServicioInternado);
        }
        
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

  setearServicioSalud(){
    this.registroFg.controls.servicioSalud.setValue(null);
  }

  verifEstablecimiento(){
    if(!this.clasificacionRiesgoFg.controls.internado.value){
      this.clasificacionRiesgoFg.controls.establecimiento.setValue('');
      this.clasificacionRiesgoFg.controls.especialidad.setValue('');
    }
  }

  verifOtroIndicEspecificar(){
    if(!this.clasificacionRiesgoFg.controls.otroIndic.value){
      this.clasificacionRiesgoFg.controls.otroIndicEspecificar.setValue('');
    }
  }

  editarFicha(): void {
    this.loading = true;
    this.fichaPersonalBlanco = new FichaPersonalBlanco();

    this.fichaPersonalBlanco.formSeccionDatosBasicos = new FormDatosBasicos();
    this.fichaPersonalBlanco.formSeccionDatosBasicos.tipoDocumento = "Cédula de Identidad";
    this.fichaPersonalBlanco.formSeccionDatosBasicos.tipoRegistro = "personal_blanco";
    this.fichaPersonalBlanco.formSeccionDatosBasicos.numeroDocumento = this.registroFg.controls.cedula.value;
    this.fichaPersonalBlanco.formSeccionDatosBasicos.nombre = this.registroFg.controls.nombre.value;
    this.fichaPersonalBlanco.formSeccionDatosBasicos.apellido = this.registroFg.controls.apellido.value;
    this.fichaPersonalBlanco.formSeccionDatosBasicos.sexo = this.registroFg.controls.sexo.value;
    this.fichaPersonalBlanco.formSeccionDatosBasicos.direccionDomicilio = this.registroFg.controls.direccion.value;
    this.fichaPersonalBlanco.formSeccionDatosBasicos.fechaNacimiento = this.registroFg.controls.fechaNacimiento.value;
    this.fichaPersonalBlanco.formSeccionDatosBasicos.numeroCelular = this.registroFg.controls.telefono.value;
    this.fichaPersonalBlanco.formSeccionDatosBasicos.edad = this.registroFg.controls.edad.value;
    this.fichaPersonalBlanco.formSeccionDatosBasicos.rangoEdad = this.registroFg.controls.rangoEdad.value;
    this.fichaPersonalBlanco.formSeccionDatosBasicos.ciudadDomicilio = this.registroFg.controls.ciudadDomicilio.value.nombre;
    this.fichaPersonalBlanco.formSeccionDatosBasicos.barrio = this.registroFg.controls.barrio.value;

    this.fichaPersonalBlanco.formSeccionPersonalBlanco = new FormSeccionPersonalBlanco();
    //this.fichaPersonalBlanco.formSeccionPersonalBlanco.profesion = this.registroFg.controls.profesion.value;
    let especialidadProfesion = this.registroFg.controls.profesion.value.nombre.split("-");
    this.fichaPersonalBlanco.formSeccionPersonalBlanco.profesion = especialidadProfesion[0];
    this.fichaPersonalBlanco.formSeccionPersonalBlanco.especialidadProfesion = especialidadProfesion[1];

    let lugarServicio = new LugarServicio();
    lugarServicio = this.registroFg.controls.servicioSalud.value;
    this.fichaPersonalBlanco.formSeccionPersonalBlanco.servicioSalud = lugarServicio.denominacion;
    
    //let regionSanitaria = new LugarServicio();
    //regionSanitaria = this.registroFg.controls.regionSanitaria.value;
    this.fichaPersonalBlanco.formSeccionPersonalBlanco.regionSanitaria = this.registroFg.controls.regionSanitaria.value.nombre;
    this.fichaPersonalBlanco.formSeccionPersonalBlanco.funcion = this.registroFg.controls.funcion.value.nombre;
    this.fichaPersonalBlanco.formSeccionPersonalBlanco.otrosLugares = this.registroFg.controls.otrosLugares.value;
    this.fichaPersonalBlanco.formSeccionPersonalBlanco.reingreso = this.registroFg.controls.reingreso.value;
    this.fichaPersonalBlanco.formSeccionPersonalBlanco.fallecido = this.registroFg.controls.fallecido.value;
    this.fichaPersonalBlanco.formSeccionPersonalBlanco.codigoPaciente = this.registroFg.controls.codPaciente.value;

    this.fichaPersonalBlanco.formSeccionPersonalBlanco.otroLugarNoListaCheck = this.registroFg.controls.otroLugarNoListaCheck.value;
    if(this.registroFg.controls.otroLugarNoListaCheck.value){
      this.fichaPersonalBlanco.formSeccionPersonalBlanco.otroLugarNoLista = this.registroFg.controls.otroLugarNoLista.value;
    }

    this.fichaPersonalBlanco.formSeccionDatosClinicos = new FormDatosClinicos();
    this.fichaPersonalBlanco.formSeccionDatosClinicos.enfermedadBaseCardiopatiaCronica = this.registroFg.controls.cardiopatia.value;
    this.fichaPersonalBlanco.formSeccionDatosClinicos.enfermedadBasePulmonarCronico = this.registroFg.controls.enfermedadPulmonar.value;
    this.fichaPersonalBlanco.formSeccionDatosClinicos.enfermedadBaseAsma = this.registroFg.controls.asma.value;
    this.fichaPersonalBlanco.formSeccionDatosClinicos.enfermedadBaseDiabetes = this.registroFg.controls.diabetes.value;
    this.fichaPersonalBlanco.formSeccionDatosClinicos.enfermedadBaseRenalCronico = this.registroFg.controls.enfermedadRenal.value;
    this.fichaPersonalBlanco.formSeccionDatosClinicos.enfermedadBaseAutoinmune = this.registroFg.controls.inmunodeficiencia.value;
    this.fichaPersonalBlanco.formSeccionDatosClinicos.enfermedadBaseObesidad = this.registroFg.controls.obesidad.value;
    this.fichaPersonalBlanco.formSeccionDatosClinicos.enfermedadBaseSindromeDown = this.registroFg.controls.sindromeDown.value;
    this.fichaPersonalBlanco.formSeccionDatosClinicos.enfermedadBaseNeurologica = this.registroFg.controls.enfermedadNeurologica.value;
    this.fichaPersonalBlanco.formSeccionDatosClinicos.enfermedadBaseHepaticaGrave = this.registroFg.controls.enfermedadHepatica.value;
    if(this.registroFg.controls.enfermedadOtros.value){
      this.fichaPersonalBlanco.formSeccionDatosClinicos.enfermedadBaseOtros = this.registroFg.controls.enfermedadOtros.value;
      this.fichaPersonalBlanco.formSeccionDatosClinicos.enfermedadBaseOtrosNombre = this.registroFg.controls.enfermedadOtrosNombre.value;
    }
    this.fichaPersonalBlanco.formSeccionDatosClinicos.embarazada = this.registroFg.controls.embarazada.value;
    this.fichaPersonalBlanco.formSeccionDatosClinicos.sintomatico = this.monitoreoFg.controls.sintomatico.value;

    this.fichaPersonalBlanco.formSeccionContactoContagio = new FormSeccionContactoContagio();
    this.fichaPersonalBlanco.formSeccionContactoContagio.nroDocumento = this.casoConfirmadoFg.controls.cedula.value;
    this.fichaPersonalBlanco.formSeccionContactoContagio.nombre = this.casoConfirmadoFg.controls.nombre.value;
    this.fichaPersonalBlanco.formSeccionContactoContagio.apellido = this.casoConfirmadoFg.controls.apellido.value;
    this.fichaPersonalBlanco.formSeccionContactoContagio.sexo = this.casoConfirmadoFg.controls.sexo.value;
    this.fichaPersonalBlanco.formSeccionContactoContagio.categoriaContagio = this.casoConfirmadoFg.controls.catContagio.value;
    this.fichaPersonalBlanco.formSeccionContactoContagio.fechaExposicion = this.casoConfirmadoFg.controls.fechaExposicion.value;
    this.fichaPersonalBlanco.formSeccionContactoContagio.clasificacionRiesgo = this.casoConfirmadoFg.controls.clasRiesgo.value;
    this.fichaPersonalBlanco.formSeccionContactoContagio.contagioAmbiente = this.casoConfirmadoFg.controls.contagioAmbiente.value;
    if(this.casoConfirmadoFg.controls.contagioEstablecimiento.value !== null){
      this.fichaPersonalBlanco.formSeccionContactoContagio.contagioEstablecimiento = this.casoConfirmadoFg.controls.contagioEstablecimiento.value.nombre;
    }
    
    this.fichaPersonalBlanco.formSeccionContactoContagio.otroServicioCheck = this.casoConfirmadoFg.controls.otroServicioCheck.value;
    if(this.casoConfirmadoFg.controls.otroServicioCheck.value){
      this.fichaPersonalBlanco.formSeccionContactoContagio.otroServicioNombre = this.casoConfirmadoFg.controls.otroServicioNombre.value;
    }

    this.fichaPersonalBlanco.reportesSalud = [];
    let reporteSalud1 = new FormSeccionReporteSalud();
    //reporteSalud1.fecha = this.monitoreoFg.controls.fecha1.value;
    reporteSalud1.id = this.idReporteSalud1;
    reporteSalud1.fecha = this.fechaSelec1;
    reporteSalud1.tos = this.monitoreoFg.controls.tos1.value;
    reporteSalud1.dolorGarganta = this.monitoreoFg.controls.dolorGarganta1.value;
    reporteSalud1.dolorCabeza = this.monitoreoFg.controls.dolorCabeza1.value;
    reporteSalud1.dificultadRespirar = this.monitoreoFg.controls.dificultadRespirar1.value;
    reporteSalud1.sentisFiebre = this.monitoreoFg.controls.fiebre1.value;
    reporteSalud1.congestionNasal = this.monitoreoFg.controls.congestionNasal1.value;
    reporteSalud1.otrosCansancios = this.monitoreoFg.controls.otrosCansancios1.value;

    reporteSalud1.diarrea = this.monitoreoFg.controls.diarrea1.value;
    reporteSalud1.dolorAbdominal = this.monitoreoFg.controls.dolorAbdominal1.value;
    reporteSalud1.convulsiones = this.monitoreoFg.controls.convulsiones1.value;
    reporteSalud1.conjuntival = this.monitoreoFg.controls.conjuntival1.value;
    reporteSalud1.dolorOido = this.monitoreoFg.controls.dolorOido1.value;
    reporteSalud1.postracion = this.monitoreoFg.controls.postracion1.value;
    reporteSalud1.artralgias = this.monitoreoFg.controls.artralgias1.value;
    reporteSalud1.mialgias = this.monitoreoFg.controls.mialgias1.value;
    reporteSalud1.irritabilidad = this.monitoreoFg.controls.irritabilidad1.value;
    reporteSalud1.nauseas = this.monitoreoFg.controls.nauseas1.value;
    reporteSalud1.auscultacion = this.monitoreoFg.controls.auscultacion1.value;

    reporteSalud1.secrecionNasal = this.monitoreoFg.controls.rinorrea1.value;
    reporteSalud1.percibeOlores = this.monitoreoFg.controls.anosmia1.value;
    reporteSalud1.percibeSabores = this.monitoreoFg.controls.disgeusia1.value;

    this.fichaPersonalBlanco.reportesSalud.push(reporteSalud1);

    let reporteSalud2 = new FormSeccionReporteSalud();
    //reporteSalud2.fecha = this.monitoreoFg.controls.fecha2.value;
    reporteSalud2.id = this.idReporteSalud2;
    reporteSalud2.fecha = this.fechaSelec2;
    reporteSalud2.tos = this.monitoreoFg.controls.tos2.value;
    reporteSalud2.dolorGarganta = this.monitoreoFg.controls.dolorGarganta2.value;
    reporteSalud2.dolorCabeza = this.monitoreoFg.controls.dolorCabeza2.value;
    reporteSalud2.dificultadRespirar = this.monitoreoFg.controls.dificultadRespirar2.value;
    reporteSalud2.sentisFiebre = this.monitoreoFg.controls.fiebre2.value;
    reporteSalud2.congestionNasal = this.monitoreoFg.controls.congestionNasal2.value;
    reporteSalud2.otrosCansancios = this.monitoreoFg.controls.otrosCansancios2.value;

    reporteSalud2.diarrea = this.monitoreoFg.controls.diarrea2.value;
    reporteSalud2.dolorAbdominal = this.monitoreoFg.controls.dolorAbdominal2.value;
    reporteSalud2.convulsiones = this.monitoreoFg.controls.convulsiones2.value;
    reporteSalud2.conjuntival = this.monitoreoFg.controls.conjuntival2.value;
    reporteSalud2.dolorOido = this.monitoreoFg.controls.dolorOido2.value;
    reporteSalud2.postracion = this.monitoreoFg.controls.postracion2.value;
    reporteSalud2.artralgias = this.monitoreoFg.controls.artralgias2.value;
    reporteSalud2.mialgias = this.monitoreoFg.controls.mialgias2.value;
    reporteSalud2.irritabilidad = this.monitoreoFg.controls.irritabilidad2.value;
    reporteSalud2.nauseas = this.monitoreoFg.controls.nauseas2.value;
    reporteSalud2.auscultacion = this.monitoreoFg.controls.auscultacion2.value;

    reporteSalud2.secrecionNasal = this.monitoreoFg.controls.rinorrea2.value;
    reporteSalud2.percibeOlores = this.monitoreoFg.controls.anosmia2.value;
    reporteSalud2.percibeSabores = this.monitoreoFg.controls.disgeusia2.value;

    this.fichaPersonalBlanco.reportesSalud.push(reporteSalud2);

    let reporteSalud3 = new FormSeccionReporteSalud();
    reporteSalud3.id = this.idReporteSalud3;
    reporteSalud3.fecha = this.fechaSelec3;
    //reporteSalud3.fecha = this.monitoreoFg.controls.fecha3.value;
    reporteSalud3.tos = this.monitoreoFg.controls.tos3.value;
    reporteSalud3.dolorGarganta = this.monitoreoFg.controls.dolorGarganta3.value;
    reporteSalud3.dolorCabeza = this.monitoreoFg.controls.dolorCabeza3.value;
    reporteSalud3.dificultadRespirar = this.monitoreoFg.controls.dificultadRespirar3.value;
    reporteSalud3.sentisFiebre = this.monitoreoFg.controls.fiebre3.value;
    reporteSalud3.congestionNasal = this.monitoreoFg.controls.congestionNasal3.value;
    reporteSalud3.otrosCansancios = this.monitoreoFg.controls.otrosCansancios3.value;

    reporteSalud3.diarrea = this.monitoreoFg.controls.diarrea3.value;
    reporteSalud3.dolorAbdominal = this.monitoreoFg.controls.dolorAbdominal3.value;
    reporteSalud3.convulsiones = this.monitoreoFg.controls.convulsiones3.value;
    reporteSalud3.conjuntival = this.monitoreoFg.controls.conjuntival3.value;
    reporteSalud3.dolorOido = this.monitoreoFg.controls.dolorOido3.value;
    reporteSalud3.postracion = this.monitoreoFg.controls.postracion3.value;
    reporteSalud3.artralgias = this.monitoreoFg.controls.artralgias3.value;
    reporteSalud3.mialgias = this.monitoreoFg.controls.mialgias3.value;
    reporteSalud3.irritabilidad = this.monitoreoFg.controls.irritabilidad3.value;
    reporteSalud3.nauseas = this.monitoreoFg.controls.nauseas3.value;
    reporteSalud3.auscultacion = this.monitoreoFg.controls.auscultacion3.value;

    reporteSalud3.secrecionNasal = this.monitoreoFg.controls.rinorrea3.value;
    reporteSalud3.percibeOlores = this.monitoreoFg.controls.anosmia3.value;
    reporteSalud3.percibeSabores = this.monitoreoFg.controls.disgeusia3.value;

    this.fichaPersonalBlanco.reportesSalud.push(reporteSalud3);

    let reporteSalud4 = new FormSeccionReporteSalud();
    reporteSalud4.id = this.idReporteSalud4;
    reporteSalud4.fecha = this.fechaSelec4;
    reporteSalud4.tos = this.monitoreoFg.controls.tos4.value;
    reporteSalud4.dolorGarganta = this.monitoreoFg.controls.dolorGarganta4.value;
    reporteSalud4.dolorCabeza = this.monitoreoFg.controls.dolorCabeza4.value;
    reporteSalud4.dificultadRespirar = this.monitoreoFg.controls.dificultadRespirar4.value;
    reporteSalud4.sentisFiebre = this.monitoreoFg.controls.fiebre4.value;
    reporteSalud4.congestionNasal = this.monitoreoFg.controls.congestionNasal4.value;
    reporteSalud4.otrosCansancios = this.monitoreoFg.controls.otrosCansancios4.value;

    reporteSalud4.diarrea = this.monitoreoFg.controls.diarrea4.value;
    reporteSalud4.dolorAbdominal = this.monitoreoFg.controls.dolorAbdominal4.value;
    reporteSalud4.convulsiones = this.monitoreoFg.controls.convulsiones4.value;
    reporteSalud4.conjuntival = this.monitoreoFg.controls.conjuntival4.value;
    reporteSalud4.dolorOido = this.monitoreoFg.controls.dolorOido4.value;
    reporteSalud4.postracion = this.monitoreoFg.controls.postracion4.value;
    reporteSalud4.artralgias = this.monitoreoFg.controls.artralgias4.value;
    reporteSalud4.mialgias = this.monitoreoFg.controls.mialgias4.value;
    reporteSalud4.irritabilidad = this.monitoreoFg.controls.irritabilidad4.value;
    reporteSalud4.nauseas = this.monitoreoFg.controls.nauseas4.value;
    reporteSalud4.auscultacion = this.monitoreoFg.controls.auscultacion4.value;

    reporteSalud4.secrecionNasal = this.monitoreoFg.controls.rinorrea4.value;
    reporteSalud4.percibeOlores = this.monitoreoFg.controls.anosmia4.value;
    reporteSalud4.percibeSabores = this.monitoreoFg.controls.disgeusia4.value;

    this.fichaPersonalBlanco.reportesSalud.push(reporteSalud4);

    let reporteSalud5 = new FormSeccionReporteSalud();
    reporteSalud5.id = this.idReporteSalud5;
    reporteSalud5.fecha = this.fechaSelec5;
    reporteSalud5.tos = this.monitoreoFg.controls.tos5.value;
    reporteSalud5.dolorGarganta = this.monitoreoFg.controls.dolorGarganta5.value;
    reporteSalud5.dolorCabeza = this.monitoreoFg.controls.dolorCabeza5.value;
    reporteSalud5.dificultadRespirar = this.monitoreoFg.controls.dificultadRespirar5.value;
    reporteSalud5.sentisFiebre = this.monitoreoFg.controls.fiebre5.value;
    reporteSalud5.congestionNasal = this.monitoreoFg.controls.congestionNasal5.value;
    reporteSalud5.otrosCansancios = this.monitoreoFg.controls.otrosCansancios5.value;

    reporteSalud5.diarrea = this.monitoreoFg.controls.diarrea5.value;
    reporteSalud5.dolorAbdominal = this.monitoreoFg.controls.dolorAbdominal5.value;
    reporteSalud5.convulsiones = this.monitoreoFg.controls.convulsiones5.value;
    reporteSalud5.conjuntival = this.monitoreoFg.controls.conjuntival5.value;
    reporteSalud5.dolorOido = this.monitoreoFg.controls.dolorOido5.value;
    reporteSalud5.postracion = this.monitoreoFg.controls.postracion5.value;
    reporteSalud5.artralgias = this.monitoreoFg.controls.artralgias5.value;
    reporteSalud5.mialgias = this.monitoreoFg.controls.mialgias5.value;
    reporteSalud5.irritabilidad = this.monitoreoFg.controls.irritabilidad5.value;
    reporteSalud5.nauseas = this.monitoreoFg.controls.nauseas5.value;
    reporteSalud5.auscultacion = this.monitoreoFg.controls.auscultacion5.value;

    reporteSalud5.secrecionNasal = this.monitoreoFg.controls.rinorrea5.value;
    reporteSalud5.percibeOlores = this.monitoreoFg.controls.anosmia5.value;
    reporteSalud5.percibeSabores = this.monitoreoFg.controls.disgeusia5.value;

    this.fichaPersonalBlanco.reportesSalud.push(reporteSalud5);

    let reporteSalud6 = new FormSeccionReporteSalud();
    reporteSalud6.id = this.idReporteSalud6;
    reporteSalud6.fecha = this.fechaSelec6;
    //reporteSalud6.fecha = this.monitoreoFg.controls.fecha6.value;
    reporteSalud6.tos = this.monitoreoFg.controls.tos6.value;
    reporteSalud6.dolorGarganta = this.monitoreoFg.controls.dolorGarganta6.value;
    reporteSalud6.dolorCabeza = this.monitoreoFg.controls.dolorCabeza6.value;
    reporteSalud6.dificultadRespirar = this.monitoreoFg.controls.dificultadRespirar6.value;
    reporteSalud6.percibeOlores = this.monitoreoFg.controls.percibeOlores6.value;
    reporteSalud6.sentisFiebre = this.monitoreoFg.controls.fiebre6.value;
    reporteSalud6.congestionNasal = this.monitoreoFg.controls.congestionNasal6.value;
    reporteSalud6.otrosCansancios = this.monitoreoFg.controls.otrosCansancios6.value;

    reporteSalud6.diarrea = this.monitoreoFg.controls.diarrea6.value;
    reporteSalud6.dolorAbdominal = this.monitoreoFg.controls.dolorAbdominal6.value;
    reporteSalud6.convulsiones = this.monitoreoFg.controls.convulsiones6.value;
    reporteSalud6.conjuntival = this.monitoreoFg.controls.conjuntival6.value;
    reporteSalud6.dolorOido = this.monitoreoFg.controls.dolorOido6.value;
    reporteSalud6.postracion = this.monitoreoFg.controls.postracion6.value;
    reporteSalud6.artralgias = this.monitoreoFg.controls.artralgias6.value;
    reporteSalud6.mialgias = this.monitoreoFg.controls.mialgias6.value;
    reporteSalud6.irritabilidad = this.monitoreoFg.controls.irritabilidad6.value;
    reporteSalud6.nauseas = this.monitoreoFg.controls.nauseas6.value;
    reporteSalud6.auscultacion = this.monitoreoFg.controls.auscultacion6.value;

    reporteSalud6.secrecionNasal = this.monitoreoFg.controls.rinorrea6.value;
    reporteSalud6.percibeOlores = this.monitoreoFg.controls.anosmia6.value;
    reporteSalud6.percibeSabores = this.monitoreoFg.controls.disgeusia6.value;

    this.fichaPersonalBlanco.reportesSalud.push(reporteSalud6);

    let reporteSalud7 = new FormSeccionReporteSalud();
    reporteSalud7.id = this.idReporteSalud7;
    reporteSalud7.fecha = this.fechaSelec7;
    //reporteSalud7.fecha = this.monitoreoFg.controls.fecha7.value;
    reporteSalud7.tos = this.monitoreoFg.controls.tos7.value;
    reporteSalud7.dolorGarganta = this.monitoreoFg.controls.dolorGarganta7.value;
    reporteSalud7.dolorCabeza = this.monitoreoFg.controls.dolorCabeza7.value;
    reporteSalud7.dificultadRespirar = this.monitoreoFg.controls.dificultadRespirar7.value;
    reporteSalud7.sentisFiebre = this.monitoreoFg.controls.fiebre7.value;
    reporteSalud7.congestionNasal = this.monitoreoFg.controls.congestionNasal7.value;
    reporteSalud7.otrosCansancios = this.monitoreoFg.controls.otrosCansancios7.value;

    reporteSalud7.diarrea = this.monitoreoFg.controls.diarrea7.value;
    reporteSalud7.dolorAbdominal = this.monitoreoFg.controls.dolorAbdominal7.value;
    reporteSalud7.convulsiones = this.monitoreoFg.controls.convulsiones7.value;
    reporteSalud7.conjuntival = this.monitoreoFg.controls.conjuntival7.value;
    reporteSalud7.dolorOido = this.monitoreoFg.controls.dolorOido7.value;
    reporteSalud7.postracion = this.monitoreoFg.controls.postracion7.value;
    reporteSalud7.artralgias = this.monitoreoFg.controls.artralgias7.value;
    reporteSalud7.mialgias = this.monitoreoFg.controls.mialgias7.value;
    reporteSalud7.irritabilidad = this.monitoreoFg.controls.irritabilidad7.value;
    reporteSalud7.nauseas = this.monitoreoFg.controls.nauseas7.value;
    reporteSalud7.auscultacion = this.monitoreoFg.controls.auscultacion7.value;

    reporteSalud7.secrecionNasal = this.monitoreoFg.controls.rinorrea7.value;
    reporteSalud7.percibeOlores = this.monitoreoFg.controls.anosmia7.value;
    reporteSalud7.percibeSabores = this.monitoreoFg.controls.disgeusia7.value;

    this.fichaPersonalBlanco.reportesSalud.push(reporteSalud7);

    let reporteSalud8 = new FormSeccionReporteSalud();
    reporteSalud8.id = this.idReporteSalud8;
    reporteSalud8.fecha = this.fechaSelec8;
    //reporteSalud8.fecha = this.monitoreoFg.controls.fecha8.value;
    reporteSalud8.tos = this.monitoreoFg.controls.tos8.value;
    reporteSalud8.dolorGarganta = this.monitoreoFg.controls.dolorGarganta8.value;
    reporteSalud8.dolorCabeza = this.monitoreoFg.controls.dolorCabeza8.value;
    reporteSalud8.dificultadRespirar = this.monitoreoFg.controls.dificultadRespirar8.value;
    reporteSalud8.sentisFiebre = this.monitoreoFg.controls.fiebre8.value;
    reporteSalud8.congestionNasal = this.monitoreoFg.controls.congestionNasal8.value;
    reporteSalud8.otrosCansancios = this.monitoreoFg.controls.otrosCansancios8.value;

    reporteSalud8.diarrea = this.monitoreoFg.controls.diarrea8.value;
    reporteSalud8.dolorAbdominal = this.monitoreoFg.controls.dolorAbdominal8.value;
    reporteSalud8.convulsiones = this.monitoreoFg.controls.convulsiones8.value;
    reporteSalud8.conjuntival = this.monitoreoFg.controls.conjuntival8.value;
    reporteSalud8.dolorOido = this.monitoreoFg.controls.dolorOido8.value;
    reporteSalud8.postracion = this.monitoreoFg.controls.postracion8.value;
    reporteSalud8.artralgias = this.monitoreoFg.controls.artralgias8.value;
    reporteSalud8.mialgias = this.monitoreoFg.controls.mialgias8.value;
    reporteSalud8.irritabilidad = this.monitoreoFg.controls.irritabilidad8.value;
    reporteSalud8.nauseas = this.monitoreoFg.controls.nauseas8.value;
    reporteSalud8.auscultacion = this.monitoreoFg.controls.auscultacion8.value;

    reporteSalud8.secrecionNasal = this.monitoreoFg.controls.rinorrea8.value;
    reporteSalud8.percibeOlores = this.monitoreoFg.controls.anosmia8.value;
    reporteSalud8.percibeSabores = this.monitoreoFg.controls.disgeusia8.value;

    this.fichaPersonalBlanco.reportesSalud.push(reporteSalud8);

    let reporteSalud9 = new FormSeccionReporteSalud();
    reporteSalud9.id = this.idReporteSalud9;
    reporteSalud9.fecha = this.fechaSelec9;
    //reporteSalud9.fecha = this.monitoreoFg.controls.fecha9.value;
    reporteSalud9.tos = this.monitoreoFg.controls.tos9.value;
    reporteSalud9.dolorGarganta = this.monitoreoFg.controls.dolorGarganta9.value;
    reporteSalud9.dolorCabeza = this.monitoreoFg.controls.dolorCabeza9.value;
    reporteSalud9.dificultadRespirar = this.monitoreoFg.controls.dificultadRespirar9.value;
    reporteSalud9.sentisFiebre = this.monitoreoFg.controls.fiebre9.value;
    reporteSalud9.congestionNasal = this.monitoreoFg.controls.congestionNasal9.value;
    reporteSalud9.otrosCansancios = this.monitoreoFg.controls.otrosCansancios9.value;
    reporteSalud9.diarrea = this.monitoreoFg.controls.diarrea9.value;
    reporteSalud9.dolorAbdominal = this.monitoreoFg.controls.dolorAbdominal9.value;
    reporteSalud9.convulsiones = this.monitoreoFg.controls.convulsiones9.value;
    reporteSalud9.conjuntival = this.monitoreoFg.controls.conjuntival9.value;
    reporteSalud9.dolorOido = this.monitoreoFg.controls.dolorOido9.value;
    reporteSalud9.postracion = this.monitoreoFg.controls.postracion9.value;
    reporteSalud9.artralgias = this.monitoreoFg.controls.artralgias9.value;
    reporteSalud9.mialgias = this.monitoreoFg.controls.mialgias9.value;
    reporteSalud9.irritabilidad = this.monitoreoFg.controls.irritabilidad9.value;
    reporteSalud9.nauseas = this.monitoreoFg.controls.nauseas9.value;
    reporteSalud9.auscultacion = this.monitoreoFg.controls.auscultacion9.value;

    reporteSalud9.secrecionNasal = this.monitoreoFg.controls.rinorrea9.value;
    reporteSalud9.percibeOlores = this.monitoreoFg.controls.anosmia9.value;
    reporteSalud9.percibeSabores = this.monitoreoFg.controls.disgeusia9.value;

    this.fichaPersonalBlanco.reportesSalud.push(reporteSalud9);

    let reporteSalud10 = new FormSeccionReporteSalud();
    reporteSalud10.id = this.idReporteSalud10;
    reporteSalud10.fecha = this.fechaSelec10;
    reporteSalud10.tos = this.monitoreoFg.controls.tos10.value;
    reporteSalud10.dolorGarganta = this.monitoreoFg.controls.dolorGarganta10.value;
    reporteSalud10.dolorCabeza = this.monitoreoFg.controls.dolorCabeza10.value;
    reporteSalud10.dificultadRespirar = this.monitoreoFg.controls.dificultadRespirar10.value;
    reporteSalud10.sentisFiebre = this.monitoreoFg.controls.fiebre10.value;
    reporteSalud10.congestionNasal = this.monitoreoFg.controls.congestionNasal10.value;
    reporteSalud10.otrosCansancios = this.monitoreoFg.controls.otrosCansancios10.value;

    reporteSalud10.diarrea = this.monitoreoFg.controls.diarrea10.value;
    reporteSalud10.dolorAbdominal = this.monitoreoFg.controls.dolorAbdominal10.value;
    reporteSalud10.convulsiones = this.monitoreoFg.controls.convulsiones10.value;
    reporteSalud10.conjuntival = this.monitoreoFg.controls.conjuntival10.value;
    reporteSalud10.dolorOido = this.monitoreoFg.controls.dolorOido10.value;
    reporteSalud10.postracion = this.monitoreoFg.controls.postracion10.value;
    reporteSalud10.artralgias = this.monitoreoFg.controls.artralgias10.value;
    reporteSalud10.mialgias = this.monitoreoFg.controls.mialgias10.value;
    reporteSalud10.irritabilidad = this.monitoreoFg.controls.irritabilidad10.value;
    reporteSalud10.nauseas = this.monitoreoFg.controls.nauseas10.value;
    reporteSalud10.auscultacion = this.monitoreoFg.controls.auscultacion10.value;

    reporteSalud10.secrecionNasal = this.monitoreoFg.controls.rinorrea10.value;
    reporteSalud10.percibeOlores = this.monitoreoFg.controls.anosmia10.value;
    reporteSalud10.percibeSabores = this.monitoreoFg.controls.disgeusia10.value;

    this.fichaPersonalBlanco.reportesSalud.push(reporteSalud10);

    let reporteSalud11 = new FormSeccionReporteSalud();
    reporteSalud11.id = this.idReporteSalud11;
    reporteSalud11.fecha = this.fechaSelec11;
    reporteSalud11.tos = this.monitoreoFg.controls.tos11.value;
    reporteSalud11.dolorGarganta = this.monitoreoFg.controls.dolorGarganta11.value;
    reporteSalud11.dolorCabeza = this.monitoreoFg.controls.dolorCabeza11.value;
    reporteSalud11.dificultadRespirar = this.monitoreoFg.controls.dificultadRespirar11.value;
    reporteSalud11.sentisFiebre = this.monitoreoFg.controls.fiebre11.value;
    reporteSalud11.congestionNasal = this.monitoreoFg.controls.congestionNasal11.value;
    reporteSalud11.otrosCansancios = this.monitoreoFg.controls.otrosCansancios11.value;

    reporteSalud11.diarrea = this.monitoreoFg.controls.diarrea11.value;
    reporteSalud11.dolorAbdominal = this.monitoreoFg.controls.dolorAbdominal11.value;
    reporteSalud11.convulsiones = this.monitoreoFg.controls.convulsiones11.value;
    reporteSalud11.conjuntival = this.monitoreoFg.controls.conjuntival11.value;
    reporteSalud11.dolorOido = this.monitoreoFg.controls.dolorOido11.value;
    reporteSalud11.postracion = this.monitoreoFg.controls.postracion11.value;
    reporteSalud11.artralgias = this.monitoreoFg.controls.artralgias11.value;
    reporteSalud11.mialgias = this.monitoreoFg.controls.mialgias11.value;
    reporteSalud11.irritabilidad = this.monitoreoFg.controls.irritabilidad11.value;
    reporteSalud11.nauseas = this.monitoreoFg.controls.nauseas11.value;
    reporteSalud11.auscultacion = this.monitoreoFg.controls.auscultacion11.value;

    reporteSalud11.secrecionNasal = this.monitoreoFg.controls.rinorrea11.value;
    reporteSalud11.percibeOlores = this.monitoreoFg.controls.anosmia11.value;
    reporteSalud11.percibeSabores = this.monitoreoFg.controls.disgeusia11.value;

    this.fichaPersonalBlanco.reportesSalud.push(reporteSalud11);

    let reporteSalud12 = new FormSeccionReporteSalud();
    reporteSalud12.id = this.idReporteSalud12;
    reporteSalud12.fecha = this.fechaSelec12;
    reporteSalud12.tos = this.monitoreoFg.controls.tos12.value;
    reporteSalud12.dolorGarganta = this.monitoreoFg.controls.dolorGarganta12.value;
    reporteSalud12.dolorCabeza = this.monitoreoFg.controls.dolorCabeza12.value;
    reporteSalud12.dificultadRespirar = this.monitoreoFg.controls.dificultadRespirar12.value;
    reporteSalud12.sentisFiebre = this.monitoreoFg.controls.fiebre12.value;
    reporteSalud12.congestionNasal = this.monitoreoFg.controls.congestionNasal12.value;
    reporteSalud12.otrosCansancios = this.monitoreoFg.controls.otrosCansancios12.value;

    reporteSalud12.diarrea = this.monitoreoFg.controls.diarrea12.value;
    reporteSalud12.dolorAbdominal = this.monitoreoFg.controls.dolorAbdominal12.value;
    reporteSalud12.convulsiones = this.monitoreoFg.controls.convulsiones12.value;
    reporteSalud12.conjuntival = this.monitoreoFg.controls.conjuntival12.value;
    reporteSalud12.dolorOido = this.monitoreoFg.controls.dolorOido12.value;
    reporteSalud12.postracion = this.monitoreoFg.controls.postracion12.value;
    reporteSalud12.artralgias = this.monitoreoFg.controls.artralgias12.value;
    reporteSalud12.mialgias = this.monitoreoFg.controls.mialgias12.value;
    reporteSalud12.irritabilidad = this.monitoreoFg.controls.irritabilidad12.value;
    reporteSalud12.nauseas = this.monitoreoFg.controls.nauseas12.value;
    reporteSalud12.auscultacion = this.monitoreoFg.controls.auscultacion12.value;

    reporteSalud12.secrecionNasal = this.monitoreoFg.controls.rinorrea12.value;
    reporteSalud12.percibeOlores = this.monitoreoFg.controls.anosmia12.value;
    reporteSalud12.percibeSabores = this.monitoreoFg.controls.disgeusia12.value;
    this.fichaPersonalBlanco.reportesSalud.push(reporteSalud12);

    let reporteSalud13 = new FormSeccionReporteSalud();
    reporteSalud13.id = this.idReporteSalud13;
    reporteSalud13.fecha = this.fechaSelec13;
    reporteSalud13.tos = this.monitoreoFg.controls.tos13.value;
    reporteSalud13.dolorGarganta = this.monitoreoFg.controls.dolorGarganta13.value;
    reporteSalud13.dolorCabeza = this.monitoreoFg.controls.dolorCabeza13.value;
    reporteSalud13.dificultadRespirar = this.monitoreoFg.controls.dificultadRespirar13.value;
    reporteSalud13.sentisFiebre = this.monitoreoFg.controls.fiebre13.value;
    reporteSalud13.congestionNasal = this.monitoreoFg.controls.congestionNasal13.value;
    reporteSalud13.otrosCansancios = this.monitoreoFg.controls.otrosCansancios13.value;

    reporteSalud13.diarrea = this.monitoreoFg.controls.diarrea13.value;
    reporteSalud13.dolorAbdominal = this.monitoreoFg.controls.dolorAbdominal13.value;
    reporteSalud13.convulsiones = this.monitoreoFg.controls.convulsiones13.value;
    reporteSalud13.conjuntival = this.monitoreoFg.controls.conjuntival13.value;
    reporteSalud13.dolorOido = this.monitoreoFg.controls.dolorOido13.value;
    reporteSalud13.postracion = this.monitoreoFg.controls.postracion13.value;
    reporteSalud13.artralgias = this.monitoreoFg.controls.artralgias13.value;
    reporteSalud13.mialgias = this.monitoreoFg.controls.mialgias13.value;
    reporteSalud13.irritabilidad = this.monitoreoFg.controls.irritabilidad13.value;
    reporteSalud13.nauseas = this.monitoreoFg.controls.nauseas13.value;
    reporteSalud13.auscultacion = this.monitoreoFg.controls.auscultacion13.value;

    reporteSalud13.secrecionNasal = this.monitoreoFg.controls.rinorrea13.value;
    reporteSalud13.percibeOlores = this.monitoreoFg.controls.anosmia13.value;
    reporteSalud13.percibeSabores = this.monitoreoFg.controls.disgeusia13.value;

    this.fichaPersonalBlanco.reportesSalud.push(reporteSalud13);

    let reporteSalud14 = new FormSeccionReporteSalud();
    reporteSalud14.id = this.idReporteSalud14;
    reporteSalud14.fecha = this.fechaSelec14;
    //reporteSalud14.fecha = this.monitoreoFg.controls.fecha14.value;
    reporteSalud14.tos = this.monitoreoFg.controls.tos14.value;
    reporteSalud14.dolorGarganta = this.monitoreoFg.controls.dolorGarganta14.value;
    reporteSalud14.dolorCabeza = this.monitoreoFg.controls.dolorCabeza14.value;
    reporteSalud14.dificultadRespirar = this.monitoreoFg.controls.dificultadRespirar14.value;
    reporteSalud14.sentisFiebre = this.monitoreoFg.controls.fiebre14.value;
    reporteSalud14.congestionNasal = this.monitoreoFg.controls.congestionNasal14.value;
    reporteSalud14.otrosCansancios = this.monitoreoFg.controls.otrosCansancios14.value;

    reporteSalud14.diarrea = this.monitoreoFg.controls.diarrea14.value;
    reporteSalud14.dolorAbdominal = this.monitoreoFg.controls.dolorAbdominal14.value;
    reporteSalud14.convulsiones = this.monitoreoFg.controls.convulsiones14.value;
    reporteSalud14.conjuntival = this.monitoreoFg.controls.conjuntival14.value;
    reporteSalud14.dolorOido = this.monitoreoFg.controls.dolorOido14.value;
    reporteSalud14.postracion = this.monitoreoFg.controls.postracion14.value;
    reporteSalud14.artralgias = this.monitoreoFg.controls.artralgias14.value;
    reporteSalud14.mialgias = this.monitoreoFg.controls.mialgias14.value;
    reporteSalud14.irritabilidad = this.monitoreoFg.controls.irritabilidad14.value;
    reporteSalud14.nauseas = this.monitoreoFg.controls.nauseas14.value;
    reporteSalud14.auscultacion = this.monitoreoFg.controls.auscultacion14.value;

    reporteSalud14.secrecionNasal = this.monitoreoFg.controls.rinorrea14.value;
    reporteSalud14.percibeOlores = this.monitoreoFg.controls.anosmia14.value;
    reporteSalud14.percibeSabores = this.monitoreoFg.controls.disgeusia14.value;

    this.fichaPersonalBlanco.reportesSalud.push(reporteSalud14);

    /*this.fichaPersonalBlanco.formSeccionReporteSalud = new FormSeccionReporteSalud();
    this.fichaPersonalBlanco.formSeccionReporteSalud.fecha1 = this.monitoreoFg.controls.fecha1.value;
    this.fichaPersonalBlanco.formSeccionReporteSalud.fecha2 = this.monitoreoFg.controls.fecha2.value;
    this.fichaPersonalBlanco.formSeccionReporteSalud.fecha3 = this.monitoreoFg.controls.fecha3.value;
    this.fichaPersonalBlanco.formSeccionReporteSalud.fecha4 = this.monitoreoFg.controls.fecha4.value;*/

    this.fichaPersonalBlanco.formSeccionClasifRiesgo = new FormSeccionClasifRiesgo();
    this.fichaPersonalBlanco.formSeccionClasifRiesgo.clasificacionFinal = this.clasificacionRiesgoFg.controls.clasifFinal.value;
    this.fichaPersonalBlanco.formSeccionClasifRiesgo.trabajoExclusion = this.clasificacionRiesgoFg.controls.exclusion.value;
    this.fichaPersonalBlanco.formSeccionClasifRiesgo.trabajoAutocontrol = this.clasificacionRiesgoFg.controls.autocontrol.value;
    this.fichaPersonalBlanco.formSeccionClasifRiesgo.trabajoNada = this.clasificacionRiesgoFg.controls.nada.value;
    this.fichaPersonalBlanco.formSeccionClasifRiesgo.trabajoOtro = this.clasificacionRiesgoFg.controls.otroIndic.value;
    this.fichaPersonalBlanco.formSeccionClasifRiesgo.trabajoOtroDescripcion = this.clasificacionRiesgoFg.controls.otroIndicEspecificar.value;
    this.fichaPersonalBlanco.formSeccionClasifRiesgo.laboratorioAntigeno = this.clasificacionRiesgoFg.controls.antigeno.value;
    this.fichaPersonalBlanco.formSeccionClasifRiesgo.laboratorioPcr = this.clasificacionRiesgoFg.controls.pcr.value;
    
    this.fichaPersonalBlanco.formSeccionClasifRiesgo.fechaInicioSintomas = this.monitoreoFg.controls.fechaSintomas.value;
    this.fichaPersonalBlanco.formSeccionClasifRiesgo.seFis = this.monitoreoFg.controls.seFis.value;
    this.fichaPersonalBlanco.formSeccionClasifRiesgo.sePrimeraMuestra = this.clasificacionRiesgoFg.controls.sePrimeraMuestra.value;
    this.fichaPersonalBlanco.formSeccionClasifRiesgo.fechaPrimeraMuestra = this.clasificacionRiesgoFg.controls.fechaPrimeraMuestra.value;
    this.fichaPersonalBlanco.formSeccionClasifRiesgo.resultadoPrimeraMuestra = this.clasificacionRiesgoFg.controls.resultadoPrimeraMuestra.value;
    this.fichaPersonalBlanco.formSeccionClasifRiesgo.constanciaAislamiento = this.clasificacionRiesgoFg.controls.constAislamiento.value;
    this.fichaPersonalBlanco.formSeccionClasifRiesgo.fichaEpidemiologica = this.clasificacionRiesgoFg.controls.fichaEpidemiologica.value;
    this.fichaPersonalBlanco.formSeccionClasifRiesgo.evolucionFinal = this.clasificacionRiesgoFg.controls.evolucionFinal.value;
    this.fichaPersonalBlanco.formSeccionClasifRiesgo.fechaCierreCaso = this.clasificacionRiesgoFg.controls.fechaCierreCaso.value;

    this.fichaPersonalBlanco.formSeccionClasifRiesgo.internado = this.clasificacionRiesgoFg.controls.internado.value;
    if(this.clasificacionRiesgoFg.controls.establecimiento.value){
      this.fichaPersonalBlanco.formSeccionClasifRiesgo.establecimientoInternacion = this.clasificacionRiesgoFg.controls.establecimiento.value.denominacion;
    }
    if(this.clasificacionRiesgoFg.controls.especialidad.value){
      this.fichaPersonalBlanco.formSeccionClasifRiesgo.especialidadInternacion = this.clasificacionRiesgoFg.controls.especialidad.value;
    }

    this.fichaPersonalBlanco.formSeccionClasifRiesgo.otroServicioInternadoCheck = this.clasificacionRiesgoFg.controls.otroServicioInternadoCheck.value;
    if(this.clasificacionRiesgoFg.controls.otroServicioInternado.value !==null){
      this.fichaPersonalBlanco.formSeccionClasifRiesgo.otroServicioInternado = this.clasificacionRiesgoFg.controls.otroServicioInternado.value;
    }

    this.fichaPersonalBlanco.formSeccionClasifRiesgo.vacunaCovid = this.registroFg.controls.vacunaCovid.value;
    this.fichaPersonalBlanco.formSeccionClasifRiesgo.se = this.registroFg.controls.se.value;
    this.fichaPersonalBlanco.formSeccionClasifRiesgo.seCierreCaso = this.clasificacionRiesgoFg.controls.seCierreCaso.value;
    this.service.editarFichaPB(this.fichaPersonalBlanco, this.idRegistroForm).subscribe(response => {
          //this.idRegistro = +response;
          this.loading = false;
          this.mensaje = "Ficha editada exitosamente!";
          this.openMessageDialogExito();
            
        }, error => {
          console.log(error);
          this.loading = false;
          this.mensaje = error.error;
          this.openMessageDialog(); 
        }
    );
  }

  /*guardarFormPersonalBlanco(idRegistro){
    this.formPersonalBlanco = new FormSeccionPersonalBlanco();
    this.formPersonalBlanco.idRegistro = idRegistro;
    this.formPersonalBlanco.profesion = this.registroFg.controls.profesion.value;
    let lugarServicio = new LugarServicio();
    lugarServicio = this.registroFg.controls.servicioSalud.value;
    this.formPersonalBlanco.servicioSalud = lugarServicio.nombre;
    //this.formPersonalBlanco.servicioSalud = this.registroFg.controls.servicioSalud.value;
    let regionSanitaria = new LugarServicio();
    regionSanitaria = this.registroFg.controls.regionSanitaria.value;
    this.formPersonalBlanco.regionSanitaria = regionSanitaria.nombre;
    //this.formPersonalBlanco.regionSanitaria = this.registroFg.controls.regionSanitaria.value;
    this.formPersonalBlanco.funcion = this.registroFg.controls.funcion.value;
    this.formPersonalBlanco.otrosLugares = this.registroFg.controls.otrosLugares.value;
    this.formPersonalBlanco.reingreso = this.registroFg.controls.reingreso.value;
    this.formPersonalBlanco.fallecido = this.registroFg.controls.fallecido.value;
    this.formPersonalBlanco.internado = this.registroFg.controls.internado.value;
    if(this.registroFg.controls.establecimiento.value !== null){
      this.formPersonalBlanco.establecimientoInternacion = this.registroFg.controls.establecimiento.value;
    }
    if(this.registroFg.controls.especialidad.value !== null){
      this.formPersonalBlanco.especialidadInternacion = this.registroFg.controls.especialidad.value;
    }
    this.service.guardarFormPersonalBlanco(this.formPersonalBlanco).subscribe(response => {
    },error => {
      console.log(error);
    });
  }
  guardarFormClasifRiesgo(idRegistro){
    this.clasifRiesgoPaciente = new FormSeccionClasifRiesgo();
    this.clasifRiesgoPaciente.idRegistro = idRegistro;
    this.clasifRiesgoPaciente.clasificacionRiesgo = this.clasificacionRiesgoFg.controls.clasRiesgo.value;
    this.clasifRiesgoPaciente.categoriaContagio = this.clasificacionRiesgoFg.controls.catContagio.value;
    this.clasifRiesgoPaciente.clasificacionFinal = this.clasificacionRiesgoFg.controls.clasifFinal.value;
    this.clasifRiesgoPaciente.trabajoExclusion = this.clasificacionRiesgoFg.controls.exclusion.value;
    this.clasifRiesgoPaciente.trabajoAutocontrol = this.clasificacionRiesgoFg.controls.autocontrol.value;
    this.clasifRiesgoPaciente.trabajoNada = this.clasificacionRiesgoFg.controls.nada.value;
    this.clasifRiesgoPaciente.trabajoOtro = this.clasificacionRiesgoFg.controls.otroIndic.value;
    this.clasifRiesgoPaciente.trabajoOtroDescripcion = this.clasificacionRiesgoFg.controls.otroIndicEspecificar.value;
    this.clasifRiesgoPaciente.laboratorioAntigeno = this.clasificacionRiesgoFg.controls.antigeno.value;
    this.service.guardarClasifRiesgo(this.clasifRiesgoPaciente).subscribe(response => {
    },error => {
      console.log(error);
    });
  }*/

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

  filtrarServicio(event) {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    let filtered : any[] = [];
    let query = event.query;
    for(let i = 0; i < this.lugares.length; i++) {
        let servicio = this.lugares[i];

        if (servicio.denominacion.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
          filtered.push(servicio);
        }
    }
    this.serviSaludFiltrados = filtered;
  }

  filtrarEstablecimiento(event) {
    //let establecimientos = [{'id':4,'nombre':'Hospital Materno Infantil San Pablo'},{'id':5,'nombre':'Instituto Medicina Tropical'},{'id':6,'nombre':'Hospital de Trauma'}];
    let filtered : any[] = [];
    let query = event.query;

    for(let i = 0; i < this.serviciosSalud.length; i++) {
        let servicio = this.serviciosSalud[i];

        if (servicio.nombre.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
          filtered.push(servicio);
        }
    }

    this.establecimientosFiltrados = filtered;
  }

  filtrarProfesion(event) {
    let profesiones = [{'id':1,'nombre':'FONOAUDIOLOGO-DOCTOR/A EN AUDIOLOGIA'},{'id':2,'nombre':'FONOAUDIOLOGO-LICENCIADO/A EN FONOAUDIOLOGIA'},
    {'id':3,'nombre':'FONOAUDIOLOGO-TECNICO EN FONOAUDIOLOGIA'}, {'id':4,'nombre':'ANESTESIA-AUXILIAR EN ANESTESIA'},
    {'id':5,'nombre':'ANESTESIA-TECNICO EN ANESTESIA'}, {'id':6,'nombre':'ANESTESIA-LICENCIADO/A EN ANESTESIA'},
    {'id':7,'nombre':'EMERGENCISTA-AUXILIAR DE EMERGENCIAS MEDICAS'}, {'id':8,'nombre':'EMERGENCISTA-TECNICO EN EMERGENCIAS MEDICAS'},
    {'id':9,'nombre':'EMERGENCISTA-LICENCIADO/A EN EMERGENCIAS MEDICAS'}, {'id':10,'nombre':'EMERGENCISTA-LICENCIADO/A EN TECNOLOGIA DE LA SALUD EN TRAUMATOLOGIA'},
    {'id':11,'nombre':'ENFERMERO/A-AUXILIAR DE ENFERMERIA'}, {'id':11,'nombre':'ENFERMERO/A-TECNICO SUPERIOR EN ENFERMERIA'},
    {'id':12,'nombre':'ENFERMERO/A-TECNICO EN ELECTROCARDIOGRAMA'}, {'id':13,'nombre':'ENFERMERO/A-TECNICO EN HEMODIALISIS'},
    {'id':14,'nombre':'ENFERMERO/A-TECNICO BASICO EN HEMOTERAPIA'}, {'id':14,'nombre':'ENFERMERO/A-TECNICO SUPERIOR EN VIGILANCIA DE LA SALUD'},
    {'id':15,'nombre':'ENFERMERO/A-LICENCIADO/A EN ENFERMERIA'}, {'id':16,'nombre':'FARMACIA-IDONEO DE FARMACIA'},
    {'id':17,'nombre':'FARMACIA-AUXILIAR DE FARMACIA'},{'id':18,'nombre':'FARMACIA-TECNICO SUPERIOR EN FARMACIA'}, {'id':19,'nombre':'FARMACIA-LICENCIADO/A EN FARMACIAS'},
    {'id':20,'nombre':'FARMACIA-QUIMICO/A FARMACEUTICO/A'}, {'id':21,'nombre':'LABORATORIO/BIOQUIMICOS/QUIMICOS-AUXILIAR EN LABORATORIO'},
    {'id':22,'nombre':'LABORATORIO/BIOQUIMICOS/QUIMICOS-TECNICO EN LABORATORIO'}, {'id':23,'nombre':'LABORATORIO/BIOQUIMICOS/QUIMICOS-LICENCIADO/A EN LABORATORIO CLINICO'},
    {'id':24,'nombre':'LABORATORIO/BIOQUIMICOS/QUIMICOS-CITOTECNOLOGO/A'}, {'id':25,'nombre':'LABORATORIO/BIOQUIMICOS/QUIMICOS-BIOQUIMICO/A'}, {'id':26,'nombre':'LABORATORIO/BIOQUIMICOS/QUIMICOS-LICENCIADO/A EN CIENCIAS MENCION: QUIMICA'},
    {'id':27,'nombre':'LABORATORIO/BIOQUIMICOS/QUIMICOS-QUIMICO/A ANALITICO/A'}, {'id':28,'nombre':'LABORATORIO/BIOQUIMICOS/QUIMICOS-LICENCIADO/A EN QUIMICA INDUSTRIAL'},
    {'id':29,'nombre':'LABORATORIO/BIOQUIMICOS/QUIMICOS-INGENIERO/A QUIMICO/A'}, {'id':30,'nombre':'LABORATORIO/BIOQUIMICOS/QUIMICOS-ANALISTA INDUSTRIAL'}, 
    {'id':31,'nombre':'OBSTETRA-AUXILIAR DE OBSTETRICIA'}, {'id':32,'nombre':'OBSTETRA-TECNICO EN OBSTETRICIA'}, {'id':33,'nombre':'OBSTETRA-LICENCIADO/A EN OBSTETRICIA'},
    {'id':34,'nombre':'ODONTOLOGO/A-AUXILIAR DE ODONTOLOGIA'}, {'id':34,'nombre':'ODONTOLOGO/A-MECANICO/A DENTAL'}, {'id':35,'nombre':'ODONTOLOGO/A-TECNICO SUPERIOR EN PROTESIS DENTAL'},
    {'id':36,'nombre':'ODONTOLOGO/A-LICENCIADO/A EN PROTESIS DENTAL'}, {'id':37,'nombre':'ODONTOLOGO/A-DOCTOR/A EN ODONTOLOGIA'}, {'id':38,'nombre':'RADIOLOGO/A-AUXILIAR DE RADIOLOGIA'},
    {'id':39,'nombre':'RADIOLOGO/A-TECNICO EN RADIOLOGIA'}, {'id':40,'nombre':'RADIOLOGO/A-LICENCIADO/A EN RADIOLOGIA'}, {'id':41,'nombre':'BIOTECNOLOGO-LICENCIADO/A EN BIOTECNOLOGIA'},
    {'id':42,'nombre':'BIOLOGO-LICENCIADO/A EN CIENCIAS MENCION : BIOLOGIA'}, {'id':43,'nombre':'ELECTROMEDICINA Y AFINES-INGENIERO/A EN ELECTRONICA.ENFASIS EN ELECTRONICA MEDICA'}, {'id':44,'nombre':'ELECTROMEDICINA Y AFINES-TECNICO EN ELECTROMEDICINA'},
    {'id':45,'nombre':'ELECTROMEDICINA Y AFINES-TECNICO SUPERIOR EN MANTENIMIENTO DE EQUIPOS BIOMEDICOS'}, {'id':46,'nombre':'INSTRUMENTADOR QUIRURGICO-LICENCIADO/A EN INSTRUMENTACION Y AREA QUIRURGICA'},
    {'id':47,'nombre':'INSTRUMENTADOR QUIRURGICO-TECNICO EN INSTRUMENTACION QUIRURGICA'}, {'id':48,'nombre':'TRABAJADOR SOCIAL-LICENCIADO/A EN TRABAJO SOCIAL'}, {'id':49,'nombre':'TRABAJADOR SOCIAL-TECNICO EN TRABAJO SOCIAL'},
    {'id':50,'nombre':'EDUCACION SANITARIA-LICENCIADO/A  EN CIENCIAS DE LA SALUD CON ENFASIS EN EDUC. SANITARIA'}, {'id':51,'nombre':'EDUCACION SANITARIA-TECNICO EN EDUCACION PARA LA SALUD'},
    {'id':52,'nombre':'EDUCACION SANITARIA-TECNICO BASICO EN EDUCACION PARA LA SALUD'}, {'id':53,'nombre':'EDUCACION SANITARIA-TECNICO SUPERIOR EN EDUCACION PARA LA SALUD'},
    {'id':54,'nombre':'KINESIOLOGIA Y AFINES-MASAJISTA TERAPEUTICO'}, {'id':55,'nombre':'KINESIOLOGIA Y AFINES-TECNICO SUPERIOR EN TERAPIA FISICA Y REHABILITACION'}, {'id':56,'nombre':'KINESIOLOGIA Y AFINES-LICENCIADO/A EN KINESIOLOGIA Y FISIOTERAPIA'},
    {'id':57,'nombre':'KINESIOLOGIA Y AFINES-LICENCIADO/A EN FISIOTERAPIA'}, {'id':58,'nombre':'KINESIOLOGIA Y AFINES-MASAJE ESTETICO'}, {'id':59,'nombre':'KINESIOLOGIA Y AFINES-MASAJISTA DEPORTIVO'},{'id':60,'nombre':'KINESIOLOGIA Y AFINES-AUXILIAR REFLEJOTERAPEUTA'},
    {'id':61,'nombre':'KINESIOLOGIA Y AFINES-TECNICO EN FISIOTERAPIA'}, {'id':62,'nombre':'KINESIOLOGIA Y AFINES-INSTRUCTOR DE GIMNASIA'}, {'id':63,'nombre':'KINESIOLOGIA Y AFINES-TERAPISTA OCUPACIONAL'}, {'id':64,'nombre':'KINESIOLOGIA Y AFINES-LICENCIADO/A EN EDUCACION FISICA'},
    {'id':65,'nombre':'KINESIOLOGIA Y AFINES-PROFESOR/A DE EDUCACION FISICA'}, {'id':66,'nombre':'KINESIOLOGIA Y AFINES-LICENCIADO/A EN CIENCIAS DEL DEPORTE'}, {'id':67,'nombre':'KINESIOLOGIA Y AFINES-LICENCIADO/A EN CIENCIAS. MENCION FISICA'},
    {'id':68,'nombre':'CIENCIAS DE ALIMENTOS Y AFINES-NUTRICIONISTA'}, {'id':69,'nombre':'CIENCIAS DE ALIMENTOS Y AFINES-LICENCIADO/A EN TECNOLOGIA DE PRODUCCION'}, {'id':70,'nombre':'CIENCIAS DE ALIMENTOS Y AFINES-LICENCIADO/A EN TECNOLOGIA DE LA SALUD EN HIGIENE Y EPIDEMIOLOGIA'},
    {'id':71,'nombre':'CIENCIAS DE ALIMENTOS Y AFINES-LICENCIADO/A EN CIENCIA Y TECNOLOGIA DE LA PRODUCCION APLICADA A LOS ALIMENTOS'}, {'id':72,'nombre':'PSICOLOGIA-LICENCIADO/A EN PSICOLOGIA'},
    {'id':73,'nombre':'OPTICA Y AFINES-LICENCIADO/A EN OPTICA Y CONTACTOLOGIA'}, {'id':74,'nombre':'OPTICA Y AFINES-TECNICO SUPERIOR EN OPTICA Y CONTACTOLOGIA'},
    {'id':75,'nombre':'PEDAGOGIA Y PSICOMOTRICIDAD-LICENCIADO/A EN PSICOMOTRICIDAD'},{'id':76,'nombre':'PEDAGOGIA Y PSICOMOTRICIDAD-LICENCIADO/A EN PSICOPEDAGOGIA'},
    {'id':77,'nombre':'BIOESTADISTICA-AUXILIAR DE BIOESTADISTICA'}, {'id':78,'nombre':'MEDICO/A-ALERGOLOGIA'}, {'id':79,'nombre':'MEDICO/A-ANESTESIOLOGIA'}, {'id':80,'nombre':'MEDICO/A-CARDIOLOGIA'},
    {'id':81,'nombre':'MEDICO/A-ENDOCRINOLOGIA'}, {'id':82,'nombre':'MEDICO/A-EPIDEMIOLOGIA'}, {'id':83,'nombre':'MEDICO/A-GASTROENTEROLOGIA'}, {'id':84,'nombre':'MEDICO/A-GERIATRIA'},
    {'id':85,'nombre':'MEDICO/A-HEMATOLOGIA'}, {'id':86,'nombre':'MEDICO/A-INFECTOLOGIA'}, {'id':86,'nombre':'MEDICO/A-MEDICINA DEL DEPORTE'},
    {'id':87,'nombre':'MEDICO/A-MEDICINA DE EMERGENCIA'}, {'id':88,'nombre':'MEDICO/A-MEDICINA FAMILIAR Y COMUNITARIA'}, {'id':89,'nombre':'MEDICO/A-MEDICINA FISICA Y REHABILITACION'},
    {'id':90,'nombre':'MEDICO/A-MEDICINA FORENSE'},  {'id':91,'nombre':'MEDICO/A-MEDICINA INTENSIVA'},  {'id':92,'nombre':'MEDICO/A-MEDICINA INTERNA'},
    {'id':93,'nombre':'MEDICO/A-MEDICINA PREVENTIVA Y SALUD PUBLICA'},  {'id':94,'nombre':'MEDICO/A-MEDICINA DEL TRABAJO'},  {'id':95,'nombre':'MEDICO/A-NEFROLOGIA'},
    {'id':96,'nombre':'MEDICO/A-NEUMOLOGIA'}, {'id':97,'nombre':'MEDICO/A-NEUROLOGIA'}, {'id':98,'nombre':'MEDICO/A-NUTRIOLOGIA'},
    {'id':99,'nombre':'MEDICO/A-ONCOLOGIA'}, {'id':100,'nombre':'MEDICO/A-PEDIATRIA'}, {'id':101,'nombre':'MEDICO/A-PSIQUIATRIA'}, {'id':102,'nombre':'MEDICO/A-REUMATOLOGIA'},
    {'id':103,'nombre':'MEDICO/A-TOXICOLOGIA'}, {'id':104,'nombre':'MEDICO/A-CIRUGIA VASCULAR'}, {'id':105,'nombre':'MEDICO/A-NEUROCIRUGIA'}, {'id':106,'nombre':'MEDICO/A-DERMATOLOGIA'},
    {'id':107,'nombre':'MEDICO/A-GINECOLOGIA Y OBSTETRICIA O TOCOLOGIA'}, {'id':108,'nombre':'MEDICO/A-OFTALMOLOGIA'}, {'id':109,'nombre':'MEDICO/A-OTORRINOLARINGOLOGIA'},
    {'id':110,'nombre':'MEDICO/A-TRAUMATOLOGIA'}, {'id':111,'nombre':'MEDICO/A-UROLOGIA'}];
    let filtered : any[] = [];
    let query = event.query;

    for(let i = 0; i < profesiones.length; i++) {
        let servicio = profesiones[i];

        if (servicio.nombre.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
          filtered.push(servicio);
        }
    }

    this.profesionesFiltradas = filtered;
  }

  filtrarFuncion(event) {
    let funciones = [{'id':1,'nombre':'GERENCIAL'},{'id':2,'nombre':'DIRECTOR'},
    {'id':3,'nombre':'JEFE DE SALA'}, {'id':4,'nombre':'MEDICO DE GUARDIA'},
    {'id':5,'nombre':'MEDICO DE CONSULTORIO'}, {'id':6,'nombre':'JEFATURA DE ENFERMERIA'},
    {'id':7,'nombre':'COORDINACION'}, {'id':8,'nombre':'ASISTENCIAL'},
    {'id':9,'nombre':'LIMPIEZA'}, {'id':10,'nombre':'COCINA'},
    {'id':11,'nombre':'LAVANDERIA'}, {'id':11,'nombre':'PROFESIONAL ADMINISTRATIVO'},
    {'id':12,'nombre':'AUXILIAR ADMINISTRATIVO'}, {'id':13,'nombre':'CHOFER/CHOFER DE AMBULANCIA'},
    {'id':14,'nombre':'MANTENIMIENTO'}, {'id':15,'nombre':'SERENO'}];
    let filtered : any[] = [];
    let query = event.query;

    for(let i = 0; i < funciones.length; i++) {
        let funcion = funciones[i];

        if (funcion.nombre.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
          filtered.push(funcion);
        }
    }
    this.funcionesFiltradas = filtered;
  }

  consultarIdentificaciones(value, band) {
    this.nroDocumento = value;
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
                /*this.registroFg.controls.fechaNacimiento.setValue(response.obtenerPersonaPorNroCedulaResponse.return.fechNacim.substring(0, 4)+'-'+
                response.obtenerPersonaPorNroCedulaResponse.return.fechNacim.substring(5, 7)+'-'+response.obtenerPersonaPorNroCedulaResponse.return.fechNacim.substring(8, 10));*/
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

  getRecaptchaToken(action){
    this.subscription = this.recaptchaV3Service.execute(action)
        .subscribe(response => {
            this.recentToken = response;
            this.recaptchaAvailable = true;
        },error=>{
          console.log("error getting recaptcha");
          this.ngOnDestroy()

        });
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

  openMessageDialogExito() {
    setTimeout(function() { $("#modalExito").modal("toggle"); }, 1000);
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

  setearFechasTabla(event, band){
    console.log(event);
    let fechaSelec = new Date(event);
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
      if(mm < 10){
        this.monitoreoFg.controls.fecha1.setValue('0'+dd + '/' + '0'+mm);
        this.fechaSelec1 = y + '-'+'0'+mm+'-'+'0'+dd;  //fechaSelec
      }else{
        this.monitoreoFg.controls.fecha1.setValue('0'+dd + '/' + mm);
        this.fechaSelec1 = y + '-'+ mm+'-'+'0'+dd;  //fechaSelec
      }
    }else{
      if(mm < 10){
        this.monitoreoFg.controls.fecha1.setValue(dd + '/' + '0'+mm);
        this.fechaSelec1 = y + '-'+'0'+mm+'-'+dd;
      }else{
        this.monitoreoFg.controls.fecha1.setValue(dd + '/' + mm);
        this.fechaSelec1 = y + '-'+ mm+'-'+dd;
      }
    }
    
    fechaSelec.setDate(fechaSelec.getDate()+2);
    var dd = fechaSelec.getDate();
    var mm = fechaSelec.getMonth() + 1;
    var y = fechaSelec.getFullYear();
    //var formattedDate = dd + '-' + mm + '-' + y;
    if(dd < 10){
      if(mm < 10){
        this.monitoreoFg.controls.fecha2.setValue('0'+dd + '/' + '0'+mm);
        this.fechaSelec2 = y + '-'+'0'+mm+'-'+'0'+dd;  //fechaSelec
      }else{
        this.monitoreoFg.controls.fecha2.setValue('0'+dd + '/' + mm);
        this.fechaSelec2 = y + '-'+ mm+'-'+'0'+dd;  //fechaSelec
      }
    }else{
      if(mm < 10){
        this.monitoreoFg.controls.fecha2.setValue(dd + '/' + '0'+mm);
        this.fechaSelec2 = y + '-'+'0'+mm+'-'+dd;
      }else{
        this.monitoreoFg.controls.fecha2.setValue(dd + '/' + mm);
        this.fechaSelec2 = y + '-'+ mm+'-'+dd;
      }
    }

    fechaSelec.setDate(fechaSelec.getDate()+1);
    var dd = fechaSelec.getDate();
    var mm = fechaSelec.getMonth() + 1;
    var y = fechaSelec.getFullYear();
    
    if(dd < 10){
      if(mm < 10){
        this.monitoreoFg.controls.fecha3.setValue('0'+dd + '/' + '0'+mm);
        this.fechaSelec3 = y + '-'+'0'+mm+'-'+'0'+dd;  //fechaSelec
      }else{
        this.monitoreoFg.controls.fecha3.setValue('0'+dd + '/' + mm);
        this.fechaSelec3 = y + '-'+ mm+'-'+'0'+dd;  //fechaSelec
      }
    }else{
      if(mm < 10){
        this.monitoreoFg.controls.fecha3.setValue(dd + '/' + '0'+mm);
        this.fechaSelec3 = y + '-'+'0'+mm+'-'+dd;
      }else{
        this.monitoreoFg.controls.fecha3.setValue(dd + '/' + mm);
        this.fechaSelec3 = y + '-'+ mm+'-'+dd;
      }
    }

    fechaSelec.setDate(fechaSelec.getDate()+1);
    var dd = fechaSelec.getDate();
    var mm = fechaSelec.getMonth() + 1;
    var y = fechaSelec.getFullYear();

    if(dd < 10){
      if(mm < 10){
        this.monitoreoFg.controls.fecha4.setValue('0'+dd + '/' + '0'+mm);
        this.fechaSelec4 = y + '-'+'0'+mm+'-'+'0'+dd;  //fechaSelec
      }else{
        this.monitoreoFg.controls.fecha4.setValue('0'+dd + '/' + mm);
        this.fechaSelec4 = y + '-'+ mm+'-'+'0'+dd;  //fechaSelec
      }
    }else{
      if(mm < 10){
        this.monitoreoFg.controls.fecha4.setValue(dd + '/' + '0'+mm);
        this.fechaSelec4 = y + '-'+'0'+mm+'-'+dd;
      }else{
        this.monitoreoFg.controls.fecha4.setValue(dd + '/' + mm);
        this.fechaSelec4 = y + '-'+ mm+'-'+dd;
      }
    }

    fechaSelec.setDate(fechaSelec.getDate()+1);
    var dd = fechaSelec.getDate();
    var mm = fechaSelec.getMonth() + 1;
    var y = fechaSelec.getFullYear();
    
    if(dd < 10){
      if(mm < 10){
        this.monitoreoFg.controls.fecha5.setValue('0'+dd + '/' + '0'+mm);
        this.fechaSelec5 = y + '-'+'0'+mm+'-'+'0'+dd;  //fechaSelec
      }else{
        this.monitoreoFg.controls.fecha5.setValue('0'+dd + '/' + mm);
        this.fechaSelec5 = y + '-'+ mm+'-'+'0'+dd;  //fechaSelec
      }
    }else{
      if(mm < 10){
        this.monitoreoFg.controls.fecha5.setValue(dd + '/' + '0'+mm);
        this.fechaSelec5 = y + '-'+'0'+mm+'-'+dd;
      }else{
        this.monitoreoFg.controls.fecha5.setValue(dd + '/' + mm);
        this.fechaSelec5 = y + '-'+ mm+'-'+dd;
      }
    }

    fechaSelec.setDate(fechaSelec.getDate()+1);
    var dd = fechaSelec.getDate();
    var mm = fechaSelec.getMonth() + 1;
    var y = fechaSelec.getFullYear();

    if(dd < 10){
      if(mm < 10){
        this.monitoreoFg.controls.fecha6.setValue('0'+dd + '/' + '0'+mm);
        this.fechaSelec6 = y + '-'+'0'+mm+'-'+'0'+dd;  //fechaSelec
      }else{
        this.monitoreoFg.controls.fecha6.setValue('0'+dd + '/' + mm);
        this.fechaSelec6 = y + '-'+ mm+'-'+'0'+dd;  //fechaSelec
      }
    }else{
      if(mm < 10){
        this.monitoreoFg.controls.fecha6.setValue(dd + '/' + '0'+mm);
        this.fechaSelec6 = y + '-'+'0'+mm+'-'+dd;
      }else{
        this.monitoreoFg.controls.fecha6.setValue(dd + '/' + mm);
        this.fechaSelec6 = y + '-'+ mm+'-'+dd;
      }
    }

    fechaSelec.setDate(fechaSelec.getDate()+1);
    var dd = fechaSelec.getDate();
    var mm = fechaSelec.getMonth() + 1;
    var y = fechaSelec.getFullYear();

    if(dd < 10){
      if(mm < 10){
        this.monitoreoFg.controls.fecha7.setValue('0'+dd + '/' + '0'+mm);
        this.fechaSelec7 = y + '-'+'0'+mm+'-'+'0'+dd;  //fechaSelec
      }else{
        this.monitoreoFg.controls.fecha7.setValue('0'+dd + '/' + mm);
        this.fechaSelec7 = y + '-'+ mm+'-'+'0'+dd;  //fechaSelec
      }
    }else{
      if(mm < 10){
        this.monitoreoFg.controls.fecha7.setValue(dd + '/' + '0'+mm);
        this.fechaSelec7 = y + '-'+'0'+mm+'-'+dd;
      }else{
        this.monitoreoFg.controls.fecha7.setValue(dd + '/' + mm);
        this.fechaSelec7 = y + '-'+ mm+'-'+dd;
      }
    }

    fechaSelec.setDate(fechaSelec.getDate()+1);
    var dd = fechaSelec.getDate();
    var mm = fechaSelec.getMonth() + 1;
    var y = fechaSelec.getFullYear();

    if(dd < 10){
      if(mm < 10){
        this.monitoreoFg.controls.fecha8.setValue('0'+dd + '/' + '0'+mm);
        this.fechaSelec8 = y + '-'+'0'+mm+'-'+'0'+dd;  //fechaSelec
      }else{
        this.monitoreoFg.controls.fecha8.setValue('0'+dd + '/' + mm);
        this.fechaSelec8 = y + '-'+ mm+'-'+'0'+dd;  //fechaSelec
      }
    }else{
      if(mm < 10){
        this.monitoreoFg.controls.fecha8.setValue(dd + '/' + '0'+mm);
        this.fechaSelec8 = y + '-'+'0'+mm+'-'+dd;
      }else{
        this.monitoreoFg.controls.fecha8.setValue(dd + '/' + mm);
        this.fechaSelec8 = y + '-'+ mm+'-'+dd;
      }
    }

    fechaSelec.setDate(fechaSelec.getDate()+1);
    var dd = fechaSelec.getDate();
    var mm = fechaSelec.getMonth() + 1;
    var y = fechaSelec.getFullYear();

    if(dd < 10){
      if(mm < 10){
        this.monitoreoFg.controls.fecha9.setValue('0'+dd + '/' + '0'+mm);
        this.fechaSelec9 = y + '-'+'0'+mm+'-'+'0'+dd;  //fechaSelec
      }else{
        this.monitoreoFg.controls.fecha9.setValue('0'+dd + '/' + mm);
        this.fechaSelec9 = y + '-'+ mm+'-'+'0'+dd;  //fechaSelec
      }
    }else{
      if(mm < 10){
        this.monitoreoFg.controls.fecha9.setValue(dd + '/' + '0'+mm);
        this.fechaSelec9 = y + '-'+'0'+mm+'-'+dd;
      }else{
        this.monitoreoFg.controls.fecha9.setValue(dd + '/' + mm);
        this.fechaSelec9 = y + '-'+ mm+'-'+dd;
      }
    }

    fechaSelec.setDate(fechaSelec.getDate()+1);
    var dd = fechaSelec.getDate();
    var mm = fechaSelec.getMonth() + 1;
    var y = fechaSelec.getFullYear();

    if(dd < 10){
      if(mm < 10){
        this.monitoreoFg.controls.fecha10.setValue('0'+dd + '/' + '0'+mm);
        this.fechaSelec10 = y + '-'+'0'+mm+'-'+'0'+dd;  //fechaSelec
      }else{
        this.monitoreoFg.controls.fecha10.setValue('0'+dd + '/' + mm);
        this.fechaSelec10 = y + '-'+ mm+'-'+'0'+dd;  //fechaSelec
      }
    }else{
      if(mm < 10){
        this.monitoreoFg.controls.fecha10.setValue(dd + '/' + '0'+mm);
        this.fechaSelec10 = y + '-'+'0'+mm+'-'+dd;
      }else{
        this.monitoreoFg.controls.fecha10.setValue(dd + '/' + mm);
        this.fechaSelec10 = y + '-'+ mm+'-'+dd;
      }
    }

    fechaSelec.setDate(fechaSelec.getDate()+1);
    var dd = fechaSelec.getDate();
    var mm = fechaSelec.getMonth() + 1;
    var y = fechaSelec.getFullYear();

    if(dd < 10){
      if(mm < 10){
        this.monitoreoFg.controls.fecha11.setValue('0'+dd + '/' + '0'+mm);
        this.fechaSelec11 = y + '-'+'0'+mm+'-'+'0'+dd;  //fechaSelec
      }else{
        this.monitoreoFg.controls.fecha11.setValue('0'+dd + '/' + mm);
        this.fechaSelec11 = y + '-'+ mm+'-'+'0'+dd;  //fechaSelec
      }
    }else{
      if(mm < 10){
        this.monitoreoFg.controls.fecha11.setValue(dd + '/' + '0'+mm);
        this.fechaSelec11 = y + '-'+'0'+mm+'-'+dd;
      }else{
        this.monitoreoFg.controls.fecha11.setValue(dd + '/' + mm);
        this.fechaSelec11 = y + '-'+ mm+'-'+dd;
      }
    }

    fechaSelec.setDate(fechaSelec.getDate()+1);
    var dd = fechaSelec.getDate();
    var mm = fechaSelec.getMonth() + 1;
    var y = fechaSelec.getFullYear();
    
    if(dd < 10){
      if(mm < 10){
        this.monitoreoFg.controls.fecha12.setValue('0'+dd + '/' + '0'+mm);
        this.fechaSelec12 = y + '-'+'0'+mm+'-'+'0'+dd;  //fechaSelec
      }else{
        this.monitoreoFg.controls.fecha12.setValue('0'+dd + '/' + mm);
        this.fechaSelec12 = y + '-'+ mm+'-'+'0'+dd;  //fechaSelec
      }
    }else{
      if(mm < 10){
        this.monitoreoFg.controls.fecha12.setValue(dd + '/' + '0'+mm);
        this.fechaSelec12 = y + '-'+'0'+mm+'-'+dd;
      }else{
        this.monitoreoFg.controls.fecha12.setValue(dd + '/' + mm);
        this.fechaSelec12 = y + '-'+ mm+'-'+dd;
      }
    }

    fechaSelec.setDate(fechaSelec.getDate()+1);
    var dd = fechaSelec.getDate();
    var mm = fechaSelec.getMonth() + 1;
    var y = fechaSelec.getFullYear();
    
    if(dd < 10){
      if(mm < 10){
        this.monitoreoFg.controls.fecha13.setValue('0'+dd + '/' + '0'+mm);
        this.fechaSelec13 = y + '-'+'0'+mm+'-'+'0'+dd;  //fechaSelec
      }else{
        this.monitoreoFg.controls.fecha13.setValue('0'+dd + '/' + mm);
        this.fechaSelec13 = y + '-'+ mm+'-'+'0'+dd;  //fechaSelec
      }
    }else{
      if(mm < 10){
        this.monitoreoFg.controls.fecha13.setValue(dd + '/' + '0'+mm);
        this.fechaSelec13 = y + '-'+'0'+mm+'-'+dd;
      }else{
        this.monitoreoFg.controls.fecha13.setValue(dd + '/' + mm);
        this.fechaSelec13 = y + '-'+ mm+'-'+dd;
      }
    }

    fechaSelec.setDate(fechaSelec.getDate()+1);
    var dd = fechaSelec.getDate();
    var mm = fechaSelec.getMonth() + 1;
    var y = fechaSelec.getFullYear();
    
    if(dd < 10){
      if(mm < 10){
        this.monitoreoFg.controls.fecha14.setValue('0'+dd + '/' + '0'+mm);
        this.fechaSelec14 = y + '-'+'0'+mm+'-'+'0'+dd;  //fechaSelec
      }else{
        this.monitoreoFg.controls.fecha14.setValue('0'+dd + '/' + mm);
        this.fechaSelec14 = y + '-'+ mm+'-'+'0'+dd;  //fechaSelec
      }
    }else{
      if(mm < 10){
        this.monitoreoFg.controls.fecha14.setValue(dd + '/' + '0'+mm);
        this.fechaSelec14 = y + '-'+'0'+mm+'-'+dd;
      }else{
        this.monitoreoFg.controls.fecha14.setValue(dd + '/' + mm);
        this.fechaSelec14 = y + '-'+ mm+'-'+dd;
      }
    }
  }

}
