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

import { AutoComplete } from 'primeng/autocomplete';
import { StorageManagerService } from "../../login/shared/storage-manager.service";

declare var $: any;
@Component({
  selector: "ficha-monitoreo-selector",
  templateUrl: "./ficha-monitoreo.component.html",
  styleUrls: ['./ficha-monitoreo.component.css'],
  providers: [Covid19Service]
})

export class FichaMonitoreoComponent implements OnInit {

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
  public contrasenhaConfirm: string;

  public idRegistro: number;

  public sexoOptions=[{value:'M',label:'Masculino'},{value:'F',label:'Femenino'}];

  public clasRiesgoOptions=[{value:'alto',label:'Alto'},{value:'moderado',label:'Moderado'},{value:'bajo',label:'Bajo'}];

  public evoFinalOptions=[{value:'alta',label:'Alta'},{value:'obito',label:'Obito'}];

  public rangoEdadOptions=[{value:'18-28',label:'18 a 28 años'}, {value:'29-39',label:'29 a 39 años'},{value:'40-50',label:'40 a 50 años'},{value:'51-61',label:'51 a 61 años'},
  {value:'>=62',label:'62 años y más'}];

  public profesionOptions =[{value:'medico',label:'Médico/a'}, {value:'enfermero',label:'Enfermero/a'}];

  public catContagioOptions=[{value:'asistencia_paciente',label:'Asistencia a paciente con COVID-19'}, {value:'contacto_personal_salud',label:'Contacto con Personal de Salud con COVID-19'},
  {value:'asistencia_penitenciaria',label:'Asistencia en penitenciaría'},{value:'asistencia_albergue',label:'Asistencia en albergues/hotel salud'},
  {value:'familiar_social',label:'Familiar Social'}, {value:'viajero',label:'Viajero'},{value:'sin_nexo',label:'Sin Nexo'}];

  public tipoRegistroOptions=[{value:'ingreso_pais',label:'Ingreso al país'},{value:'aislamiento',label:'Caso sospechoso Covid-19'}];
  
/*public regionSanitariaOptions=[{value:'Capital',label:'Capital'}, {value:'Concepción',label:'Concepción'},{value:'San Pedro',label:'San Pedro'},
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

                              public regionSanitariaOptions=[{id:1, nombre:'Concepción'},{id:2, nombre:'San Pedro Norte'},
                              {id:3, nombre:'San Pedro Sur'}, {id:4, nombre:'Cordillera'},
                              {id:5, nombre:'Guairá'}, {id:6, nombre:'Caaguazú'},
                              {id:7,nombre:'Caazapá'}, {id:8, nombre:'Itapúa'},
                              {id:9,nombre:'Misiones'},
                              {id:10, nombre:'Paraguarí'},{id:11, nombre:'Alto Paraná'},
                              {id:12, nombre:'Central'},{id:13, nombre:'Ñeembucú'},
                              {id:14, nombre:'Amambay'},{id:15, nombre:'Canindeyú'},
                              {id:16, nombre:'Presidente Hayes'}, {id:17, nombre:'Boquerón'},
                              {id:18, nombre:'Alto Paraguay'}, {id:19, nombre:'Capital'}];

  public clasifFinalOptions=[{value:'descartado',label:'Descartado'},{value:'confirmado',label:'Confirmado'}];
  public ciudadOptions: any[];

  public resulPriMuestraOptions=[{value:'negativo',label:'Negativo'},{value:'positivo',label:'Positivo'}];

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

  //Forms del Wizard
  registroFg: FormGroup;
  clasificacionRiesgoFg: FormGroup;
  casoConfirmadoFg: FormGroup;
  monitoreoFg: FormGroup;

  nroDocumento;
  //serviciosSalud: any[];
  serviSaludFiltrados: any[] = [];

  es = calendarEsLocale;

  lugares: any[]=[];
  regionesFiltradas: any[];
  establecimientosFiltrados: any[];

  profesionesFiltradas: any[];

  funcionesFiltradas: any[];

  public ciudadesOptions: any[];
  public ciudadesFiltradas: any[];

  public barriosOptions: any[];
  public barriosFiltrados: any[];

  public coddpto;

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
  fallaSII: boolean;

  region: string;

  constructor(
    private _router: Router,
    private service: Covid19Service,
    private _route: ActivatedRoute,
    private recaptchaV3Service: ReCaptchaV3Service,
    private _formBuilder: FormBuilder,
    private storageManager: StorageManagerService
  ) {
    this.loading = false;
    if (typeof localStorage !== "undefined") {
      localStorage.clear();
    }
  }

  @ViewChild('stepper') stepper: MatHorizontalStepper;

  ngOnInit() {
    const {usuario} = this.storageManager.getLoginData();
    this.region = usuario.regionSanitaria;

    this.fallaSII = false;
    this.fechaHoy = new Date().toLocaleDateString('fr-CA');

    this.options="{types: ['(cities)'], componentRestrictions: { country: 'PY' }}";

    this.service.getLugaresServicio().subscribe(lugares => {
      this.lugares = [];
      this.lugares = lugares;
      /*for (let i = 0; i < ciudades.length; i++) {
        let c = ciudades[i];
        this.ciudadOptions[i] = { label: c.descripcion, value: c.idCiudad };
      }*/
    }, error => {
      console.log(error);
      this.mensaje = error.error;
      this.openMessageDialog();
    });

    window.scrollTo(0, 0);

    this.registroFg = this._formBuilder.group({
      fechaInicioMonitoreo: [new Date(), Validators.required],
      cedula: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      edad:[0, Validators.required],
      rangoEdad:['', Validators.required],
      telefono: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      direccion: [''],
      sexo: ['', Validators.required],
      servicioSalud: ['', Validators.required],
      regionSanitaria: ['', Validators.required],
      profesion: ['', Validators.required],
      funcion: ['', Validators.required],
      otrosLugares: [[]],
      reingreso: [null],
      reinfeccion: [null],
      fallecido: [null],
      ciudadDomicilio:['', Validators.required],
      barrio:[''],
      codPaciente:[''],
      otroServicio:[null],
      se:[1],
      otroLugarNoListaCheck:[null],
      otroLugarNoLista:[''],
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
      ningunaEnfBase:[null]
    });

    this.casoConfirmadoFg = this._formBuilder.group({
      cedula: [''],
      nombre: [''],
      apellido: [''],
      sexo: [''],
      contagioAmbiente: [null, Validators.required],
      contagioEstablecimiento: [],
      fechaExposicion: [''],
      catContagio: [''],
      clasRiesgo: [''],
      otroServicioCheck:[null],
      otroServicioNombre:['']
    });

    this.monitoreoFg = this._formBuilder.group({
      /*cedula: ['', Validators.required],
      nombre: ['', Validators.required],*/
      sintomatico: [null, Validators.required],
      fechaSintomas: [''],
      seFis:[1],
      fecha1: [''],
      fecha2: [''],
      fecha3: [''],
      fecha4: [''],
      fecha5: [''],
      fecha6: [''],
      fecha7: [''],
      fecha8: [''],
      fecha9: [''],
      fecha10: [''],
      fecha11: [''],
      fecha12: [''],
      fecha13: [''],
      fecha14: [''],
      tos1: [null],
      tos2: [null],
      tos3: [null],
      tos4: [null],
      tos5: [null],
      tos6: [null],
      tos7: [null],
      tos8: [null],
      tos9: [null],
      tos10: [null],
      tos11: [null],
      tos12: [null],
      tos13: [null],
      tos14: [null],
      fiebre1: [null],
      fiebre2: [null],
      fiebre3: [null],
      fiebre4: [null],
      fiebre5: [null],
      fiebre6: [null],
      fiebre7: [null],
      fiebre8: [null],
      fiebre9: [null],
      fiebre10: [null],
      fiebre11: [null],
      fiebre12: [null],
      fiebre13: [null],
      fiebre14: [null],
      dolorGarganta1: [null],
      dolorGarganta2: [null],
      dolorGarganta3: [null],
      dolorGarganta4: [null],
      dolorGarganta5: [null],
      dolorGarganta6: [null],
      dolorGarganta7: [null],
      dolorGarganta8: [null],
      dolorGarganta9: [null],
      dolorGarganta10: [null],
      dolorGarganta11: [null],
      dolorGarganta12: [null],
      dolorGarganta13: [null],
      dolorGarganta14: [null],
      dolorCabeza1: [null],
      dolorCabeza2: [null],
      dolorCabeza3: [null],
      dolorCabeza4: [null],
      dolorCabeza5: [null],
      dolorCabeza6: [null],
      dolorCabeza7: [null],
      dolorCabeza8: [null],
      dolorCabeza9: [null],
      dolorCabeza10: [null],
      dolorCabeza11: [null],
      dolorCabeza12: [null],
      dolorCabeza13: [null],
      dolorCabeza14: [null],
      dificultadRespirar1: [null],
      dificultadRespirar2: [null],
      dificultadRespirar3: [null],
      dificultadRespirar4: [null],
      dificultadRespirar5: [null],
      dificultadRespirar6: [null],
      dificultadRespirar7: [null],
      dificultadRespirar8: [null],
      dificultadRespirar9: [null],
      dificultadRespirar10: [null],
      dificultadRespirar11: [null],
      dificultadRespirar12: [null],
      dificultadRespirar13: [null],
      dificultadRespirar14: [null],
      percibeOlores1: [null],
      percibeOlores2: [null],
      percibeOlores3: [null],
      percibeOlores4: [null],
      percibeOlores5: [null],
      percibeOlores6: [null],
      percibeOlores7: [null],
      percibeOlores8: [null],
      percibeOlores9: [null],
      percibeOlores10: [null],
      percibeOlores11: [null],
      percibeOlores12: [null],
      percibeOlores13: [null],
      percibeOlores14: [null],
      congestionNasal1: [null],
      congestionNasal2: [null],
      congestionNasal3: [null],
      congestionNasal4: [null],
      congestionNasal5: [null],
      congestionNasal6: [null],
      congestionNasal7: [null],
      congestionNasal8: [null],
      congestionNasal9: [null],
      congestionNasal10: [null],
      congestionNasal11: [null],
      congestionNasal12: [null],
      congestionNasal13: [null],
      congestionNasal14: [null],
      diarrea1: [null],
      diarrea2: [null],
      diarrea3: [null],
      diarrea4: [null],
      diarrea5: [null],
      diarrea6: [null],
      diarrea7: [null],
      diarrea8: [null],
      diarrea9: [null],
      diarrea10: [null],
      diarrea11: [null],
      diarrea12: [null],
      diarrea13: [null],
      diarrea14: [null],
      dolorOido1: [null],
      dolorOido2: [null],
      dolorOido3: [null],
      dolorOido4: [null],
      dolorOido5: [null],
      dolorOido6: [null],
      dolorOido7: [null],
      dolorOido8: [null],
      dolorOido9: [null],
      dolorOido10: [null],
      dolorOido11: [null],
      dolorOido12: [null],
      dolorOido13: [null],
      dolorOido14: [null],
      convulsiones1: [null],
      convulsiones2: [null],
      convulsiones3: [null],
      convulsiones4: [null],
      convulsiones5: [null],
      convulsiones6: [null],
      convulsiones7: [null],
      convulsiones8: [null],
      convulsiones9: [null],
      convulsiones10: [null],
      convulsiones11: [null],
      convulsiones12: [null],
      convulsiones13: [null],
      convulsiones14: [null],
      mialgias1: [null],
      mialgias2: [null],
      mialgias3: [null],
      mialgias4: [null],
      mialgias5: [null],
      mialgias6: [null],
      mialgias7: [null],
      mialgias8: [null],
      mialgias9: [null],
      mialgias10: [null],
      mialgias11: [null],
      mialgias12: [null],
      mialgias13: [null],
      mialgias14: [null],
      artralgias1: [null],
      artralgias2: [null],
      artralgias3: [null],
      artralgias4: [null],
      artralgias5: [null],
      artralgias6: [null],
      artralgias7: [null],
      artralgias8: [null],
      artralgias9: [null],
      artralgias10: [null],
      artralgias11: [null],
      artralgias12: [null],
      artralgias13: [null],
      artralgias14: [null],
      postracion1: [null],
      postracion2: [null],
      postracion3: [null],
      postracion4: [null],
      postracion5: [null],
      postracion6: [null],
      postracion7: [null],
      postracion8: [null],
      postracion9: [null],
      postracion10: [null],
      postracion11: [null],
      postracion12: [null],
      postracion13: [null],
      postracion14: [null],
      nauseas1: [null],
      nauseas2: [null],
      nauseas3: [null],
      nauseas4: [null],
      nauseas5: [null],
      nauseas6: [null],
      nauseas7: [null],
      nauseas8: [null],
      nauseas9: [null],
      nauseas10: [null],
      nauseas11: [null],
      nauseas12: [null],
      nauseas13: [null],
      nauseas14: [null],
      irritabilidad1: [null],
      irritabilidad2: [null],
      irritabilidad3: [null],
      irritabilidad4: [null],
      irritabilidad5: [null],
      irritabilidad6: [null],
      irritabilidad7: [null],
      irritabilidad8: [null],
      irritabilidad9: [null],
      irritabilidad10: [null],
      irritabilidad11: [null],
      irritabilidad12: [null],
      irritabilidad13: [null],
      irritabilidad14: [null],
      dolorAbdominal1: [null],
      dolorAbdominal2: [null],
      dolorAbdominal3: [null],
      dolorAbdominal4: [null],
      dolorAbdominal5: [null],
      dolorAbdominal6: [null],
      dolorAbdominal7: [null],
      dolorAbdominal8: [null],
      dolorAbdominal9: [null],
      dolorAbdominal10: [null],
      dolorAbdominal11: [null],
      dolorAbdominal12: [null],
      dolorAbdominal13: [null],
      dolorAbdominal14: [null],
      rinorrea1: [null],
      rinorrea2: [null],
      rinorrea3: [null],
      rinorrea4: [null],
      rinorrea5: [null],
      rinorrea6: [null],
      rinorrea7: [null],
      rinorrea8: [null],
      rinorrea9: [null],
      rinorrea10: [null],
      rinorrea11: [null],
      rinorrea12: [null],
      rinorrea13: [null],
      rinorrea14: [null],
      conjuntival1: [null],
      conjuntival2: [null],
      conjuntival3: [null],
      conjuntival4: [null],
      conjuntival5: [null],
      conjuntival6: [null],
      conjuntival7: [null],
      conjuntival8: [null],
      conjuntival9: [null],
      conjuntival10: [null],
      conjuntival11: [null],
      conjuntival12: [null],
      conjuntival13: [null],
      conjuntival14: [null],
      auscultacion1: [null],
      auscultacion2: [null],
      auscultacion3: [null],
      auscultacion4: [null],
      auscultacion5: [null],
      auscultacion6: [null],
      auscultacion7: [null],
      auscultacion8: [null],
      auscultacion9: [null],
      auscultacion10: [null],
      auscultacion11: [null],
      auscultacion12: [null],
      auscultacion13: [null],
      auscultacion14: [null],
      anosmia1: [null],
      anosmia2: [null],
      anosmia3: [null],
      anosmia4: [null],
      anosmia5: [null],
      anosmia6: [null],
      anosmia7: [null],
      anosmia8: [null],
      anosmia9: [null],
      anosmia10: [null],
      anosmia11: [null],
      anosmia12: [null],
      anosmia13: [null],
      anosmia14: [null],
      disgeusia1: [null],
      disgeusia2: [null],
      disgeusia3: [null],
      disgeusia4: [null],
      disgeusia5: [null],
      disgeusia6: [null],
      disgeusia7: [null],
      disgeusia8: [null],
      disgeusia9: [null],
      disgeusia10: [null],
      disgeusia11: [null],
      disgeusia12: [null],
      disgeusia13: [null],
      disgeusia14: [null],
      otrosCansancios1: [null],
      otrosCansancios2: [null],
      otrosCansancios3: [null],
      otrosCansancios4: [null],
      otrosCansancios5: [null],
      otrosCansancios6: [null],
      otrosCansancios7: [null],
      otrosCansancios8: [null],
      otrosCansancios9: [null],
      otrosCansancios10: [null],
      otrosCansancios11: [null],
      otrosCansancios12: [null],
      otrosCansancios13: [null],
      otrosCansancios14: [null]
    });

    this.clasificacionRiesgoFg = this._formBuilder.group({
      clasifFinal:[''],
      otroIndicEspecificar: [''],
      autocontrol: [null],
      nada: [null],
      otroIndic: [null],
      antigeno: [null],
      pcr: [null],
      ningunoLab: [null],

      fechaCierreCaso: [''],
      seCierreCaso:[1],
      fechaPrimeraMuestra: [''],
      sePrimeraMuestra:[1],
      resultadoPrimeraMuestra: [''],
      exclusion: [null, Validators.required],
      constAislamiento: [null, Validators.required],
      fichaEpidemiologica: [null, Validators.required],
      evolucionFinal: [''],
      internado: [null, Validators.required],
      establecimiento: [],
      especialidad: [],
      otroServicioInternadoCheck:[null],
      otroServicioInternado:[],
      nroConstancia: [null]
    });

    this.setearFechasTabla(this.fechaHoy, 'inicio');

    this.calcularSE(this.fechaHoy);
  }

  esObligatorio(){
    if(this.registroFg.controls.sexo.value =='F'){
      this.registroFg.controls.embarazada.setValidators([Validators.required]);
    }

    if(this.monitoreoFg.controls.sintomatico.value){
      this.monitoreoFg.controls.fechaSintomas.setValidators([Validators.required]);
    }

    if(this.casoConfirmadoFg.controls.contagioAmbiente.value === 'familiar_social'){
      /*this.casoConfirmadoFg.controls.fechaExposicion.setValidators([Validators.required]);
      this.casoConfirmadoFg.controls.nombre.setValidators([Validators.required]);*/
      this.casoConfirmadoFg.controls.clasRiesgo.setValidators([Validators.required]);

    }else if(this.casoConfirmadoFg.controls.contagioAmbiente.value === 'establecimiento_salud'){
      this.casoConfirmadoFg.controls.contagioEstablecimiento.setValidators([Validators.required]);
      this.casoConfirmadoFg.controls.catContagio.setValidators([Validators.required]);
      this.casoConfirmadoFg.controls.clasRiesgo.setValidators([Validators.required]);
      //this.casoConfirmadoFg.controls.fechaExposicion.setValidators([Validators.required]);
    }else{
      this.casoConfirmadoFg.controls.contagioEstablecimiento.clearValidators();
      this.casoConfirmadoFg.controls.catContagio.clearValidators();
      this.casoConfirmadoFg.controls.clasRiesgo.clearValidators();
      this.casoConfirmadoFg.controls.fechaExposicion.clearValidators();
    }
  }

  calcularSE(event){
    let fechaSelec = new Date(event);

    if(fechaSelec >= new Date('2021-01-03') && fechaSelec <= new Date('2021-01-10')){
      this.registroFg.controls.se.setValue(1);
    }
    if(fechaSelec >= new Date('2021-01-10') && fechaSelec <= new Date('2021-01-17')){
      this.registroFg.controls.se.setValue(2);
    }
    if(fechaSelec >= new Date('2021-01-17') && fechaSelec <= new Date('2021-01-24')){
      this.registroFg.controls.se.setValue(3);
    }
    if(fechaSelec >= new Date('2021-01-24') && fechaSelec <= new Date('2021-01-31')){
      this.registroFg.controls.se.setValue(4);
    }
    if(fechaSelec >= new Date('2021-01-31') && fechaSelec <= new Date('2021-02-07')){
      this.registroFg.controls.se.setValue(5);
    }
    if(fechaSelec >= new Date('2021-02-07') && fechaSelec <= new Date('2021-02-14')){
      this.registroFg.controls.se.setValue(6);
    }
    if(fechaSelec >= new Date('2021-02-14') && fechaSelec <= new Date('2021-02-21')){
      this.registroFg.controls.se.setValue(7);
    }
    if(fechaSelec >= new Date('2021-02-21') && fechaSelec <= new Date('2021-02-28')){
      this.registroFg.controls.se.setValue(8);
    }
    if(fechaSelec >= new Date('2021-02-28') && fechaSelec <= new Date('2021-03-07')){
      this.registroFg.controls.se.setValue(9);
    }
    if(fechaSelec >= new Date('2021-03-07') && fechaSelec <= new Date('2021-03-14')){
      this.registroFg.controls.se.setValue(10);
    }
    if(fechaSelec >= new Date('2021-03-14') && fechaSelec <= new Date('2021-03-21')){
      this.registroFg.controls.se.setValue(11);
    }
    if(fechaSelec >= new Date('2021-03-21') && fechaSelec <= new Date('2021-03-28')){
      this.registroFg.controls.se.setValue(12);
    }
    if(fechaSelec >= new Date('2021-03-28') && fechaSelec <= new Date('2021-04-04')){
      this.registroFg.controls.se.setValue(13);
    }
    if(fechaSelec >= new Date('2021-04-04') && fechaSelec <= new Date('2021-04-11')){
      this.registroFg.controls.se.setValue(14);
    }
    if(fechaSelec >= new Date('2021-04-11') && fechaSelec <= new Date('2021-04-18')){
      this.registroFg.controls.se.setValue(15);
    }
    if(fechaSelec >= new Date('2021-04-18') && fechaSelec <= new Date('2021-04-25')){
      this.registroFg.controls.se.setValue(16);
    }
    if(fechaSelec >= new Date('2021-04-25') && fechaSelec <= new Date('2021-05-02')){
      this.registroFg.controls.se.setValue(17);
    }
    if(fechaSelec >= new Date('2021-05-02') && fechaSelec <= new Date('2021-05-09')){
      this.registroFg.controls.se.setValue(18);
    }
    if(fechaSelec >= new Date('2021-05-09') && fechaSelec <= new Date('2021-05-16')){
      this.registroFg.controls.se.setValue(19);
    }
    if(fechaSelec >= new Date('2021-05-16') && fechaSelec <= new Date('2021-05-23')){
      this.registroFg.controls.se.setValue(20);
    }
    if(fechaSelec >= new Date('2021-05-23') && fechaSelec <= new Date('2021-05-30')){
      this.registroFg.controls.se.setValue(21);
    }
    if(fechaSelec >= new Date('2021-05-30') && fechaSelec <= new Date('2021-06-06')){
      this.registroFg.controls.se.setValue(22);
    }
    if(fechaSelec >= new Date('2021-06-06') && fechaSelec <= new Date('2021-06-13')){
      this.registroFg.controls.se.setValue(23);
    }
    if(fechaSelec >= new Date('2021-06-13') && fechaSelec <= new Date('2021-06-20')){
      this.registroFg.controls.se.setValue(24);
    }
    if(fechaSelec >= new Date('2021-06-20') && fechaSelec <= new Date('2021-06-27')){
      this.registroFg.controls.se.setValue(25);
    }
    if(fechaSelec >= new Date('2021-06-27') && fechaSelec <= new Date('2021-07-04')){
      this.registroFg.controls.se.setValue(26);
    }
    if(fechaSelec >= new Date('2021-07-04') && fechaSelec <= new Date('2021-07-11')){
      this.registroFg.controls.se.setValue(27);
    }
    if(fechaSelec >= new Date('2021-07-11') && fechaSelec <= new Date('2021-07-18')){
      this.registroFg.controls.se.setValue(28);
    }
    if(fechaSelec >= new Date('2021-07-18') && fechaSelec <= new Date('2021-07-25')){
      this.registroFg.controls.se.setValue(29);
    }
    if(fechaSelec >= new Date('2021-07-25') && fechaSelec <= new Date('2021-08-01')){
      this.registroFg.controls.se.setValue(30);
    }
    if(fechaSelec >= new Date('2021-08-01') && fechaSelec <= new Date('2021-08-08')){
      this.registroFg.controls.se.setValue(31);
    }
    if(fechaSelec >= new Date('2021-08-08') && fechaSelec <= new Date('2021-08-15')){
      this.registroFg.controls.se.setValue(32);
    }
    if(fechaSelec >= new Date('2021-08-15') && fechaSelec <= new Date('2021-08-22')){
      this.registroFg.controls.se.setValue(33);
    }
    if(fechaSelec >= new Date('2021-08-22') && fechaSelec <= new Date('2021-08-29')){
      this.registroFg.controls.se.setValue(34);
    }
    if(fechaSelec >= new Date('2021-08-29') && fechaSelec <= new Date('2021-09-05')){
      this.registroFg.controls.se.setValue(35);
    }
    if(fechaSelec >= new Date('2021-09-05') && fechaSelec <= new Date('2021-09-12')){
      this.registroFg.controls.se.setValue(36);
    }
    if(fechaSelec >= new Date('2021-09-12') && fechaSelec <= new Date('2021-09-19')){
      this.registroFg.controls.se.setValue(37);
    }
    if(fechaSelec >= new Date('2021-09-19') && fechaSelec <= new Date('2021-09-26')){
      this.registroFg.controls.se.setValue(38);
    }
    if(fechaSelec >= new Date('2021-09-26') && fechaSelec <= new Date('2021-10-03')){
      this.registroFg.controls.se.setValue(39);
    }
    if(fechaSelec >= new Date('2021-10-03') && fechaSelec <= new Date('2021-10-10')){
      this.registroFg.controls.se.setValue(40);
    }
    if(fechaSelec >= new Date('2021-10-10') && fechaSelec <= new Date('2021-10-17')){
      this.registroFg.controls.se.setValue(41);
    }
    if(fechaSelec >= new Date('2021-10-17') && fechaSelec <= new Date('2021-10-24')){
      this.registroFg.controls.se.setValue(42);
    }
    if(fechaSelec >= new Date('2021-10-24') && fechaSelec <= new Date('2021-10-31')){
      this.registroFg.controls.se.setValue(43);
    }
    if(fechaSelec >= new Date('2021-10-31') && fechaSelec <= new Date('2021-11-07')){
      this.registroFg.controls.se.setValue(44);
    }
    if(fechaSelec >= new Date('2021-11-07') && fechaSelec <= new Date('2021-11-14')){
      this.registroFg.controls.se.setValue(45);
    }
    if(fechaSelec >= new Date('2021-11-14') && fechaSelec <= new Date('2021-11-21')){
      this.registroFg.controls.se.setValue(46);
    }
    if(fechaSelec >= new Date('2021-11-21') && fechaSelec <= new Date('2021-11-28')){
      this.registroFg.controls.se.setValue(47);
    }
    if(fechaSelec >= new Date('2021-11-28') && fechaSelec <= new Date('2021-12-05')){
      this.registroFg.controls.se.setValue(48);
    }
    if(fechaSelec >= new Date('2021-12-05') && fechaSelec <= new Date('2021-12-12')){
      this.registroFg.controls.se.setValue(49);
    }
    if(fechaSelec >= new Date('2021-12-12') && fechaSelec <= new Date('2021-12-19')){
      this.registroFg.controls.se.setValue(50);
    }
    if(fechaSelec >= new Date('2021-12-19') && fechaSelec <= new Date('2021-12-26')){
      this.registroFg.controls.se.setValue(51);
    }
    if(fechaSelec >= new Date('2021-12-26') && fechaSelec <= new Date('2022-01-02')){
      this.registroFg.controls.se.setValue(52);
    }
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

  selectCiudad(event){
    console.log(event);
    this.registroFg.controls.barrio.setValue(null);
    this.service.getBarriosCiudad(this.coddpto, event.valor).subscribe(barrios => {
      console.log(barrios);
      this.barriosOptions = barrios;
      for (let i = 0; i < barrios.length; i++) {
        let d = barrios[i];
        this.barriosOptions[i] = { nombre: d.nombarrio, valor: d.codbarrio };
      }
    }, error => {
      console.log(error);
      this.mensaje = error.error;
      this.openMessageDialog();
    });
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

  filtrarBarrio(event) {
    let filtered : any[] = [];
    let query = event.query;
    for(let i = 0; i < this.barriosOptions.length; i++) {
        let barrio = this.barriosOptions[i];

        if (barrio.nombre.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
          filtered.push(barrio);
        }
    }
    
    this.barriosFiltrados = filtered;
  }

  setearEdad(fechaNacimiento){
    const birth = new Date(fechaNacimiento);
    const curr  = new Date();
    const diff = curr.getTime() - birth.getTime();
    
    const edad = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    this.registroFg.controls.edad.setValue(edad);

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

  selecAmbiente(band){
    if(band ==='salud'){
      this.catContagioOptions = [{value:'asistencia_paciente',label:'Asistencia a paciente con COVID-19'}, {value:'contacto_personal_salud',label:'Contacto con Personal de Salud con COVID-19'},
      {value:'asistencia_penitenciaria',label:'Asistencia en penitenciaría'},{value:'asistencia_albergue',label:'Asistencia en albergues/hotel salud'}];
    }else{
      this.catContagioOptions = [{value:'familiar_social',label:'Familiar Social'}, {value:'viajero',label:'Viajero'},{value:'sin_nexo',label:'Sin Nexo'}];
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

  verifContagioEstablecimiento(){
    if(!this.casoConfirmadoFg.controls.contagioSalud.value){
      this.casoConfirmadoFg.controls.contagioEstablecimiento.setValue('');
    }
  }

  setearServicioSalud(){
    this.registroFg.controls.servicioSalud.setValue(null);
  }

  setearOtroLugarNoLista(){
    this.registroFg.controls.otroLugarNoLista.setValue(null);
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

  elegirNingunoLab(){
    if(this.clasificacionRiesgoFg.controls.ningunoLab.value){
      this.clasificacionRiesgoFg.controls.antigeno.setValue(null);
      this.clasificacionRiesgoFg.controls.pcr.setValue(null);
    }
  }

  guardarFicha(): void {
    //this.formDatosBasicos = new FormDatosBasicos();
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
    this.fichaPersonalBlanco.formSeccionDatosBasicos.departamentoDomicilio = this.registroFg.controls.regionSanitaria.value.nombre;

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
    this.fichaPersonalBlanco.formSeccionDatosClinicos.ningunaEnfermedadBase = this.registroFg.controls.ningunaEnfBase.value;
    if(this.registroFg.controls.enfermedadOtros.value){
      this.fichaPersonalBlanco.formSeccionDatosClinicos.enfermedadBaseOtros = this.registroFg.controls.enfermedadOtros.value;
      this.fichaPersonalBlanco.formSeccionDatosClinicos.enfermedadBaseOtrosNombre = this.registroFg.controls.enfermedadOtrosNombre.value;
    }

    this.fichaPersonalBlanco.formSeccionDatosClinicos.embarazada = this.registroFg.controls.embarazada.value;
    this.fichaPersonalBlanco.formSeccionDatosClinicos.sintomatico = this.monitoreoFg.controls.sintomatico.value;

    //2020-12-14
    if(this.fallaSII){
      this.fichaPersonalBlanco.formSeccionDatosBasicos.fechaNacimiento = this.registroFg.controls.fechaNacimiento.value.substring(8,10)+'/'+this.registroFg.controls.fechaNacimiento.value.substring(5,7)+'/'+this.registroFg.controls.fechaNacimiento.value.substring(0,4);
    }else{
       this.fichaPersonalBlanco.formSeccionDatosBasicos.fechaNacimiento = this.registroFg.controls.fechaNacimiento.value;
    }
    this.fichaPersonalBlanco.formSeccionDatosBasicos.numeroCelular = this.registroFg.controls.telefono.value;

    this.fichaPersonalBlanco.formSeccionDatosBasicos.edad = this.registroFg.controls.edad.value;
    this.fichaPersonalBlanco.formSeccionDatosBasicos.rangoEdad = this.registroFg.controls.rangoEdad.value;
    this.fichaPersonalBlanco.formSeccionDatosBasicos.ciudadDomicilio = this.registroFg.controls.ciudadDomicilio.value.nombre;
    this.fichaPersonalBlanco.formSeccionDatosBasicos.barrio = this.registroFg.controls.barrio.value.nombre;

    this.fichaPersonalBlanco.formSeccionPersonalBlanco = new FormSeccionPersonalBlanco();
    let especialidadProfesion = this.registroFg.controls.profesion.value.nombre.split("-");
    this.fichaPersonalBlanco.formSeccionPersonalBlanco.profesion = especialidadProfesion[0];
    this.fichaPersonalBlanco.formSeccionPersonalBlanco.especialidadProfesion = especialidadProfesion[1];

    this.fichaPersonalBlanco.formSeccionPersonalBlanco.otroServicio = this.registroFg.controls.otroServicio.value;
    if(this.registroFg.controls.otroServicio.value){
      this.fichaPersonalBlanco.formSeccionPersonalBlanco.servicioSalud = this.registroFg.controls.servicioSalud.value;
    }else{
      let lugarServicio = new LugarServicio();
      lugarServicio = this.registroFg.controls.servicioSalud.value;
      this.fichaPersonalBlanco.formSeccionPersonalBlanco.servicioSalud = lugarServicio.denominacion;
    }

    //let regionSanitaria = new LugarServicio();
    //regionSanitaria = this.registroFg.controls.regionSanitaria.value;
    this.fichaPersonalBlanco.formSeccionPersonalBlanco.regionSanitaria = this.registroFg.controls.regionSanitaria.value.id;
    this.fichaPersonalBlanco.formSeccionPersonalBlanco.funcion = this.registroFg.controls.funcion.value.nombre;
    this.fichaPersonalBlanco.formSeccionPersonalBlanco.otrosLugares = this.registroFg.controls.otrosLugares.value;
    this.fichaPersonalBlanco.formSeccionPersonalBlanco.reingreso = this.registroFg.controls.reingreso.value;

    if(this.fichaPersonalBlanco.formSeccionPersonalBlanco.reingreso){
      this.fichaPersonalBlanco.formSeccionPersonalBlanco.ultimoReingreso = true;
    }
    //this.fichaPersonalBlanco.formSeccionPersonalBlanco.fallecido = this.registroFg.controls.fallecido.value;

    this.fichaPersonalBlanco.formSeccionPersonalBlanco.codigoPaciente = this.registroFg.controls.codPaciente.value;

    this.fichaPersonalBlanco.formSeccionPersonalBlanco.otroLugarNoListaCheck = this.registroFg.controls.otroLugarNoListaCheck.value;
    if(this.registroFg.controls.otroLugarNoListaCheck.value){
      this.fichaPersonalBlanco.formSeccionPersonalBlanco.otroLugarNoLista = this.registroFg.controls.otroLugarNoLista.value;
    }

    this.fichaPersonalBlanco.formSeccionContactoContagio = new FormSeccionContactoContagio();
    this.fichaPersonalBlanco.formSeccionContactoContagio.nroDocumento = this.casoConfirmadoFg.controls.cedula.value;
    this.fichaPersonalBlanco.formSeccionContactoContagio.nombre = this.casoConfirmadoFg.controls.nombre.value;
    this.fichaPersonalBlanco.formSeccionContactoContagio.apellido = this.casoConfirmadoFg.controls.apellido.value;
    this.fichaPersonalBlanco.formSeccionContactoContagio.sexo = this.casoConfirmadoFg.controls.sexo.value;

    this.fichaPersonalBlanco.formSeccionContactoContagio.contagioAmbiente = this.casoConfirmadoFg.controls.contagioAmbiente.value;
    if(this.casoConfirmadoFg.controls.contagioEstablecimiento.value !== null){
      this.fichaPersonalBlanco.formSeccionContactoContagio.contagioEstablecimiento = this.casoConfirmadoFg.controls.contagioEstablecimiento.value.nombre;
    }
    this.fichaPersonalBlanco.formSeccionContactoContagio.categoriaContagio = this.casoConfirmadoFg.controls.catContagio.value;
    this.fichaPersonalBlanco.formSeccionContactoContagio.fechaExposicion = this.casoConfirmadoFg.controls.fechaExposicion.value;
    this.fichaPersonalBlanco.formSeccionContactoContagio.clasificacionRiesgo = this.casoConfirmadoFg.controls.clasRiesgo.value;

    this.fichaPersonalBlanco.formSeccionContactoContagio.otroServicioCheck = this.casoConfirmadoFg.controls.otroServicioCheck.value;
    if(this.casoConfirmadoFg.controls.otroServicioCheck.value){
      this.fichaPersonalBlanco.formSeccionContactoContagio.otroServicioNombre = this.casoConfirmadoFg.controls.otroServicioNombre.value;
    }

    this.fichaPersonalBlanco.reportesSalud = [];
    let reporteSalud1 = new FormSeccionReporteSalud();
    //reporteSalud1.fecha = this.monitoreoFg.controls.fecha1.value;
    reporteSalud1.fecha = this.fechaSelec1;

    reporteSalud1.tos = this.monitoreoFg.controls.tos1.value;
    reporteSalud1.sentisFiebre = this.monitoreoFg.controls.fiebre1.value;
    reporteSalud1.dolorGarganta = this.monitoreoFg.controls.dolorGarganta1.value;
    reporteSalud1.dificultadRespirar = this.monitoreoFg.controls.dificultadRespirar1.value;
    reporteSalud1.dolorCabeza = this.monitoreoFg.controls.dolorCabeza1.value;
    reporteSalud1.conjuntival = this.monitoreoFg.controls.conjuntival1.value;
    reporteSalud1.secrecionNasal = this.monitoreoFg.controls.rinorrea1.value;
    reporteSalud1.congestionNasal = this.monitoreoFg.controls.congestionNasal1.value;
    reporteSalud1.irritabilidad = this.monitoreoFg.controls.irritabilidad1.value;
    reporteSalud1.diarrea = this.monitoreoFg.controls.diarrea1.value;
    reporteSalud1.dolorOido = this.monitoreoFg.controls.dolorOido1.value;
    reporteSalud1.mialgias = this.monitoreoFg.controls.mialgias1.value;
    reporteSalud1.artralgias = this.monitoreoFg.controls.artralgias1.value;
    reporteSalud1.postracion = this.monitoreoFg.controls.postracion1.value;
    reporteSalud1.nauseas = this.monitoreoFg.controls.nauseas1.value;
    reporteSalud1.dolorAbdominal = this.monitoreoFg.controls.dolorAbdominal1.value;
    reporteSalud1.convulsiones = this.monitoreoFg.controls.convulsiones1.value;
    reporteSalud1.auscultacion = this.monitoreoFg.controls.auscultacion1.value;
    reporteSalud1.percibeSabores = this.monitoreoFg.controls.disgeusia1.value;
    reporteSalud1.percibeOlores = this.monitoreoFg.controls.anosmia1.value;
    reporteSalud1.otrosCansancios = this.monitoreoFg.controls.otrosCansancios1.value;
    
    this.fichaPersonalBlanco.reportesSalud.push(reporteSalud1);

    let reporteSalud2 = new FormSeccionReporteSalud();
    //reporteSalud2.fecha = this.monitoreoFg.controls.fecha2.value;
    reporteSalud2.fecha = this.fechaSelec2;

    reporteSalud2.tos = this.monitoreoFg.controls.tos2.value;
    reporteSalud2.sentisFiebre = this.monitoreoFg.controls.fiebre2.value;
    reporteSalud2.dolorGarganta = this.monitoreoFg.controls.dolorGarganta2.value;
    reporteSalud2.dificultadRespirar = this.monitoreoFg.controls.dificultadRespirar2.value;
    reporteSalud2.dolorCabeza = this.monitoreoFg.controls.dolorCabeza2.value;
    reporteSalud2.conjuntival = this.monitoreoFg.controls.conjuntival2.value;
    reporteSalud2.secrecionNasal = this.monitoreoFg.controls.rinorrea2.value;
    reporteSalud2.congestionNasal = this.monitoreoFg.controls.congestionNasal2.value;
    reporteSalud2.irritabilidad = this.monitoreoFg.controls.irritabilidad2.value;
    reporteSalud2.diarrea = this.monitoreoFg.controls.diarrea2.value;
    reporteSalud2.dolorOido = this.monitoreoFg.controls.dolorOido2.value;
    reporteSalud2.mialgias = this.monitoreoFg.controls.mialgias2.value;
    reporteSalud2.artralgias = this.monitoreoFg.controls.artralgias2.value;
    reporteSalud2.postracion = this.monitoreoFg.controls.postracion2.value;
    reporteSalud2.nauseas = this.monitoreoFg.controls.nauseas2.value;
    reporteSalud2.dolorAbdominal = this.monitoreoFg.controls.dolorAbdominal2.value;
    reporteSalud2.convulsiones = this.monitoreoFg.controls.convulsiones2.value;
    reporteSalud2.auscultacion = this.monitoreoFg.controls.auscultacion2.value;
    reporteSalud2.percibeSabores = this.monitoreoFg.controls.disgeusia2.value;
    reporteSalud2.percibeOlores = this.monitoreoFg.controls.anosmia2.value;
    reporteSalud2.otrosCansancios = this.monitoreoFg.controls.otrosCansancios2.value;
    
    this.fichaPersonalBlanco.reportesSalud.push(reporteSalud2);

    let reporteSalud3 = new FormSeccionReporteSalud();
    reporteSalud3.fecha = this.fechaSelec3;
    //reporteSalud3.fecha = this.monitoreoFg.controls.fecha3.value;
    reporteSalud3.tos = this.monitoreoFg.controls.tos3.value;
    reporteSalud3.sentisFiebre = this.monitoreoFg.controls.fiebre3.value;
    reporteSalud3.dolorGarganta = this.monitoreoFg.controls.dolorGarganta3.value;
    reporteSalud3.dificultadRespirar = this.monitoreoFg.controls.dificultadRespirar3.value;
    reporteSalud3.dolorCabeza = this.monitoreoFg.controls.dolorCabeza3.value;
    reporteSalud3.conjuntival = this.monitoreoFg.controls.conjuntival3.value;
    reporteSalud3.secrecionNasal = this.monitoreoFg.controls.rinorrea3.value;
    reporteSalud3.congestionNasal = this.monitoreoFg.controls.congestionNasal3.value;
    reporteSalud3.irritabilidad = this.monitoreoFg.controls.irritabilidad3.value;
    reporteSalud3.diarrea = this.monitoreoFg.controls.diarrea3.value;
    reporteSalud3.dolorOido = this.monitoreoFg.controls.dolorOido3.value;
    reporteSalud3.mialgias = this.monitoreoFg.controls.mialgias3.value;
    reporteSalud3.artralgias = this.monitoreoFg.controls.artralgias3.value;
    reporteSalud3.postracion = this.monitoreoFg.controls.postracion3.value;
    reporteSalud3.nauseas = this.monitoreoFg.controls.nauseas3.value;
    reporteSalud3.dolorAbdominal = this.monitoreoFg.controls.dolorAbdominal3.value;
    reporteSalud3.convulsiones = this.monitoreoFg.controls.convulsiones3.value;
    reporteSalud3.auscultacion = this.monitoreoFg.controls.auscultacion3.value;
    reporteSalud3.percibeSabores = this.monitoreoFg.controls.disgeusia3.value;
    reporteSalud3.percibeOlores = this.monitoreoFg.controls.anosmia3.value;
    reporteSalud3.otrosCansancios = this.monitoreoFg.controls.otrosCansancios3.value;

    this.fichaPersonalBlanco.reportesSalud.push(reporteSalud3);

    let reporteSalud4 = new FormSeccionReporteSalud();
    reporteSalud4.fecha = this.fechaSelec4;
    //reporteSalud4.fecha = this.monitoreoFg.controls.fecha4.value;
    reporteSalud4.tos = this.monitoreoFg.controls.tos4.value;
    reporteSalud4.sentisFiebre = this.monitoreoFg.controls.fiebre4.value;
    reporteSalud4.dolorGarganta = this.monitoreoFg.controls.dolorGarganta4.value;
    reporteSalud4.dificultadRespirar = this.monitoreoFg.controls.dificultadRespirar4.value;
    reporteSalud4.dolorCabeza = this.monitoreoFg.controls.dolorCabeza4.value;
    reporteSalud4.conjuntival = this.monitoreoFg.controls.conjuntival4.value;
    reporteSalud4.secrecionNasal = this.monitoreoFg.controls.rinorrea4.value;
    reporteSalud4.congestionNasal = this.monitoreoFg.controls.congestionNasal4.value;
    reporteSalud4.irritabilidad = this.monitoreoFg.controls.irritabilidad4.value;
    reporteSalud4.diarrea = this.monitoreoFg.controls.diarrea4.value;
    reporteSalud4.dolorOido = this.monitoreoFg.controls.dolorOido4.value;
    reporteSalud4.mialgias = this.monitoreoFg.controls.mialgias4.value;
    reporteSalud4.artralgias = this.monitoreoFg.controls.artralgias4.value;
    reporteSalud4.postracion = this.monitoreoFg.controls.postracion4.value;
    reporteSalud4.nauseas = this.monitoreoFg.controls.nauseas4.value;
    reporteSalud4.dolorAbdominal = this.monitoreoFg.controls.dolorAbdominal4.value;
    reporteSalud4.convulsiones = this.monitoreoFg.controls.convulsiones4.value;
    reporteSalud4.auscultacion = this.monitoreoFg.controls.auscultacion4.value;
    reporteSalud4.percibeSabores = this.monitoreoFg.controls.disgeusia4.value;
    reporteSalud4.percibeOlores = this.monitoreoFg.controls.anosmia4.value;
    reporteSalud4.otrosCansancios = this.monitoreoFg.controls.otrosCansancios4.value;
    
    this.fichaPersonalBlanco.reportesSalud.push(reporteSalud4);

    let reporteSalud5 = new FormSeccionReporteSalud();
    reporteSalud5.fecha = this.fechaSelec5;

    reporteSalud5.tos = this.monitoreoFg.controls.tos5.value;
    reporteSalud5.sentisFiebre = this.monitoreoFg.controls.fiebre5.value;
    reporteSalud5.dolorGarganta = this.monitoreoFg.controls.dolorGarganta5.value;
    reporteSalud5.dificultadRespirar = this.monitoreoFg.controls.dificultadRespirar5.value;
    reporteSalud5.dolorCabeza = this.monitoreoFg.controls.dolorCabeza5.value;
    reporteSalud5.conjuntival = this.monitoreoFg.controls.conjuntival5.value;
    reporteSalud5.secrecionNasal = this.monitoreoFg.controls.rinorrea5.value;
    reporteSalud5.congestionNasal = this.monitoreoFg.controls.congestionNasal5.value;
    reporteSalud5.irritabilidad = this.monitoreoFg.controls.irritabilidad5.value;
    reporteSalud5.diarrea = this.monitoreoFg.controls.diarrea5.value;
    reporteSalud5.dolorOido = this.monitoreoFg.controls.dolorOido5.value;
    reporteSalud5.mialgias = this.monitoreoFg.controls.mialgias5.value;
    reporteSalud5.artralgias = this.monitoreoFg.controls.artralgias5.value;
    reporteSalud5.postracion = this.monitoreoFg.controls.postracion5.value;
    reporteSalud5.nauseas = this.monitoreoFg.controls.nauseas5.value;
    reporteSalud5.dolorAbdominal = this.monitoreoFg.controls.dolorAbdominal5.value;
    reporteSalud5.convulsiones = this.monitoreoFg.controls.convulsiones5.value;
    reporteSalud5.auscultacion = this.monitoreoFg.controls.auscultacion5.value;
    reporteSalud5.percibeSabores = this.monitoreoFg.controls.disgeusia5.value;
    reporteSalud5.percibeOlores = this.monitoreoFg.controls.anosmia5.value;
    reporteSalud5.otrosCansancios = this.monitoreoFg.controls.otrosCansancios5.value;

    this.fichaPersonalBlanco.reportesSalud.push(reporteSalud5);

    let reporteSalud6 = new FormSeccionReporteSalud();
    reporteSalud6.fecha = this.fechaSelec6;
    //reporteSalud6.fecha = this.monitoreoFg.controls.fecha6.value;
    reporteSalud6.tos = this.monitoreoFg.controls.tos6.value;
    reporteSalud6.sentisFiebre = this.monitoreoFg.controls.fiebre6.value;
    reporteSalud6.dolorGarganta = this.monitoreoFg.controls.dolorGarganta6.value;
    reporteSalud6.dificultadRespirar = this.monitoreoFg.controls.dificultadRespirar6.value;
    reporteSalud6.dolorCabeza = this.monitoreoFg.controls.dolorCabeza6.value;
    reporteSalud6.conjuntival = this.monitoreoFg.controls.conjuntival6.value;
    reporteSalud6.secrecionNasal = this.monitoreoFg.controls.rinorrea6.value;
    reporteSalud6.congestionNasal = this.monitoreoFg.controls.congestionNasal6.value;
    reporteSalud6.irritabilidad = this.monitoreoFg.controls.irritabilidad6.value;
    reporteSalud6.diarrea = this.monitoreoFg.controls.diarrea6.value;
    reporteSalud6.dolorOido = this.monitoreoFg.controls.dolorOido6.value;
    reporteSalud6.mialgias = this.monitoreoFg.controls.mialgias6.value;
    reporteSalud6.artralgias = this.monitoreoFg.controls.artralgias6.value;
    reporteSalud6.postracion = this.monitoreoFg.controls.postracion6.value;
    reporteSalud6.nauseas = this.monitoreoFg.controls.nauseas6.value;
    reporteSalud6.dolorAbdominal = this.monitoreoFg.controls.dolorAbdominal6.value;
    reporteSalud6.convulsiones = this.monitoreoFg.controls.convulsiones6.value;
    reporteSalud6.auscultacion = this.monitoreoFg.controls.auscultacion6.value;
    reporteSalud6.percibeSabores = this.monitoreoFg.controls.disgeusia6.value;
    reporteSalud6.percibeOlores = this.monitoreoFg.controls.anosmia6.value;
    reporteSalud6.otrosCansancios = this.monitoreoFg.controls.otrosCansancios6.value;

    this.fichaPersonalBlanco.reportesSalud.push(reporteSalud6);

    let reporteSalud7 = new FormSeccionReporteSalud();
    reporteSalud7.fecha = this.fechaSelec7;
    //reporteSalud7.fecha = this.monitoreoFg.controls.fecha7.value;
    reporteSalud7.tos = this.monitoreoFg.controls.tos7.value;
    reporteSalud7.sentisFiebre = this.monitoreoFg.controls.fiebre7.value;
    reporteSalud7.dolorGarganta = this.monitoreoFg.controls.dolorGarganta7.value;
    reporteSalud7.dificultadRespirar = this.monitoreoFg.controls.dificultadRespirar7.value;
    reporteSalud7.dolorCabeza = this.monitoreoFg.controls.dolorCabeza7.value;
    reporteSalud7.conjuntival = this.monitoreoFg.controls.conjuntival7.value;
    reporteSalud7.secrecionNasal = this.monitoreoFg.controls.rinorrea7.value;
    reporteSalud7.congestionNasal = this.monitoreoFg.controls.congestionNasal7.value;
    reporteSalud7.irritabilidad = this.monitoreoFg.controls.irritabilidad7.value;
    reporteSalud7.diarrea = this.monitoreoFg.controls.diarrea7.value;
    reporteSalud7.dolorOido = this.monitoreoFg.controls.dolorOido7.value;
    reporteSalud7.mialgias = this.monitoreoFg.controls.mialgias7.value;
    reporteSalud7.artralgias = this.monitoreoFg.controls.artralgias7.value;
    reporteSalud7.postracion = this.monitoreoFg.controls.postracion7.value;
    reporteSalud7.nauseas = this.monitoreoFg.controls.nauseas7.value;
    reporteSalud7.dolorAbdominal = this.monitoreoFg.controls.dolorAbdominal7.value;
    reporteSalud7.convulsiones = this.monitoreoFg.controls.convulsiones7.value;
    reporteSalud7.auscultacion = this.monitoreoFg.controls.auscultacion7.value;
    reporteSalud7.percibeSabores = this.monitoreoFg.controls.disgeusia7.value;
    reporteSalud7.percibeOlores = this.monitoreoFg.controls.anosmia7.value;
    reporteSalud7.otrosCansancios = this.monitoreoFg.controls.otrosCansancios7.value;

    this.fichaPersonalBlanco.reportesSalud.push(reporteSalud7);

    let reporteSalud8 = new FormSeccionReporteSalud();
    reporteSalud8.fecha = this.fechaSelec8;
    //reporteSalud8.fecha = this.monitoreoFg.controls.fecha8.value;
    reporteSalud8.tos = this.monitoreoFg.controls.tos8.value;
    reporteSalud8.sentisFiebre = this.monitoreoFg.controls.fiebre8.value;
    reporteSalud8.dolorGarganta = this.monitoreoFg.controls.dolorGarganta8.value;
    reporteSalud8.dificultadRespirar = this.monitoreoFg.controls.dificultadRespirar8.value;
    reporteSalud8.dolorCabeza = this.monitoreoFg.controls.dolorCabeza8.value;
    reporteSalud8.conjuntival = this.monitoreoFg.controls.conjuntival8.value;
    reporteSalud8.secrecionNasal = this.monitoreoFg.controls.rinorrea8.value;
    reporteSalud8.congestionNasal = this.monitoreoFg.controls.congestionNasal8.value;
    reporteSalud8.irritabilidad = this.monitoreoFg.controls.irritabilidad8.value;
    reporteSalud8.diarrea = this.monitoreoFg.controls.diarrea8.value;
    reporteSalud8.dolorOido = this.monitoreoFg.controls.dolorOido8.value;
    reporteSalud8.mialgias = this.monitoreoFg.controls.mialgias8.value;
    reporteSalud8.artralgias = this.monitoreoFg.controls.artralgias8.value;
    reporteSalud8.postracion = this.monitoreoFg.controls.postracion8.value;
    reporteSalud8.nauseas = this.monitoreoFg.controls.nauseas8.value;
    reporteSalud8.dolorAbdominal = this.monitoreoFg.controls.dolorAbdominal8.value;
    reporteSalud8.convulsiones = this.monitoreoFg.controls.convulsiones8.value;
    reporteSalud8.auscultacion = this.monitoreoFg.controls.auscultacion8.value;
    reporteSalud8.percibeSabores = this.monitoreoFg.controls.disgeusia8.value;
    reporteSalud8.percibeOlores = this.monitoreoFg.controls.anosmia8.value;
    reporteSalud8.otrosCansancios = this.monitoreoFg.controls.otrosCansancios8.value;

    this.fichaPersonalBlanco.reportesSalud.push(reporteSalud8);

    let reporteSalud9 = new FormSeccionReporteSalud();
    reporteSalud9.fecha = this.fechaSelec9;
    //reporteSalud9.fecha = this.monitoreoFg.controls.fecha9.value;
    reporteSalud9.tos = this.monitoreoFg.controls.tos9.value;
    reporteSalud9.sentisFiebre = this.monitoreoFg.controls.fiebre9.value;
    reporteSalud9.dolorGarganta = this.monitoreoFg.controls.dolorGarganta9.value;
    reporteSalud9.dificultadRespirar = this.monitoreoFg.controls.dificultadRespirar9.value;
    reporteSalud9.dolorCabeza = this.monitoreoFg.controls.dolorCabeza9.value;
    reporteSalud9.conjuntival = this.monitoreoFg.controls.conjuntival9.value;
    reporteSalud9.secrecionNasal = this.monitoreoFg.controls.rinorrea9.value;
    reporteSalud9.congestionNasal = this.monitoreoFg.controls.congestionNasal9.value;
    reporteSalud9.irritabilidad = this.monitoreoFg.controls.irritabilidad9.value;
    reporteSalud9.diarrea = this.monitoreoFg.controls.diarrea9.value;
    reporteSalud9.dolorOido = this.monitoreoFg.controls.dolorOido9.value;
    reporteSalud9.mialgias = this.monitoreoFg.controls.mialgias9.value;
    reporteSalud9.artralgias = this.monitoreoFg.controls.artralgias9.value;
    reporteSalud9.postracion = this.monitoreoFg.controls.postracion9.value;
    reporteSalud9.nauseas = this.monitoreoFg.controls.nauseas9.value;
    reporteSalud9.dolorAbdominal = this.monitoreoFg.controls.dolorAbdominal9.value;
    reporteSalud9.convulsiones = this.monitoreoFg.controls.convulsiones9.value;
    reporteSalud9.auscultacion = this.monitoreoFg.controls.auscultacion9.value;
    reporteSalud9.percibeSabores = this.monitoreoFg.controls.disgeusia9.value;
    reporteSalud9.percibeOlores = this.monitoreoFg.controls.anosmia9.value;
    reporteSalud9.otrosCansancios = this.monitoreoFg.controls.otrosCansancios9.value;

    this.fichaPersonalBlanco.reportesSalud.push(reporteSalud9);

    let reporteSalud10 = new FormSeccionReporteSalud();
    reporteSalud10.fecha = this.fechaSelec10;
    //reporteSalud10.fecha = this.monitoreoFg.controls.fecha10.value;
    reporteSalud10.tos = this.monitoreoFg.controls.tos10.value;
    reporteSalud10.sentisFiebre = this.monitoreoFg.controls.fiebre10.value;
    reporteSalud10.dolorGarganta = this.monitoreoFg.controls.dolorGarganta10.value;
    reporteSalud10.dificultadRespirar = this.monitoreoFg.controls.dificultadRespirar10.value;
    reporteSalud10.dolorCabeza = this.monitoreoFg.controls.dolorCabeza10.value;
    reporteSalud10.conjuntival = this.monitoreoFg.controls.conjuntival10.value;
    reporteSalud10.secrecionNasal = this.monitoreoFg.controls.rinorrea10.value;
    reporteSalud10.congestionNasal = this.monitoreoFg.controls.congestionNasal10.value;
    reporteSalud10.irritabilidad = this.monitoreoFg.controls.irritabilidad10.value;
    reporteSalud10.diarrea = this.monitoreoFg.controls.diarrea10.value;
    reporteSalud10.dolorOido = this.monitoreoFg.controls.dolorOido10.value;
    reporteSalud10.mialgias = this.monitoreoFg.controls.mialgias10.value;
    reporteSalud10.artralgias = this.monitoreoFg.controls.artralgias10.value;
    reporteSalud10.postracion = this.monitoreoFg.controls.postracion10.value;
    reporteSalud10.nauseas = this.monitoreoFg.controls.nauseas10.value;
    reporteSalud10.dolorAbdominal = this.monitoreoFg.controls.dolorAbdominal10.value;
    reporteSalud10.convulsiones = this.monitoreoFg.controls.convulsiones10.value;
    reporteSalud10.auscultacion = this.monitoreoFg.controls.auscultacion10.value;
    reporteSalud10.percibeSabores = this.monitoreoFg.controls.disgeusia10.value;
    reporteSalud10.percibeOlores = this.monitoreoFg.controls.anosmia10.value;
    reporteSalud10.otrosCansancios = this.monitoreoFg.controls.otrosCansancios10.value;

    this.fichaPersonalBlanco.reportesSalud.push(reporteSalud10);

    let reporteSalud11 = new FormSeccionReporteSalud();
    reporteSalud11.fecha = this.fechaSelec11;
    //reporteSalud11.fecha = this.monitoreoFg.controls.fecha11.value;
    reporteSalud11.tos = this.monitoreoFg.controls.tos11.value;
    reporteSalud11.sentisFiebre = this.monitoreoFg.controls.fiebre11.value;
    reporteSalud11.dolorGarganta = this.monitoreoFg.controls.dolorGarganta11.value;
    reporteSalud11.dificultadRespirar = this.monitoreoFg.controls.dificultadRespirar11.value;
    reporteSalud11.dolorCabeza = this.monitoreoFg.controls.dolorCabeza11.value;
    reporteSalud11.conjuntival = this.monitoreoFg.controls.conjuntival11.value;
    reporteSalud11.secrecionNasal = this.monitoreoFg.controls.rinorrea11.value;
    reporteSalud11.congestionNasal = this.monitoreoFg.controls.congestionNasal11.value;
    reporteSalud11.irritabilidad = this.monitoreoFg.controls.irritabilidad11.value;
    reporteSalud11.diarrea = this.monitoreoFg.controls.diarrea11.value;
    reporteSalud11.dolorOido = this.monitoreoFg.controls.dolorOido11.value;
    reporteSalud11.mialgias = this.monitoreoFg.controls.mialgias11.value;
    reporteSalud11.artralgias = this.monitoreoFg.controls.artralgias11.value;
    reporteSalud11.postracion = this.monitoreoFg.controls.postracion11.value;
    reporteSalud11.nauseas = this.monitoreoFg.controls.nauseas11.value;
    reporteSalud11.dolorAbdominal = this.monitoreoFg.controls.dolorAbdominal11.value;
    reporteSalud11.convulsiones = this.monitoreoFg.controls.convulsiones11.value;
    reporteSalud11.auscultacion = this.monitoreoFg.controls.auscultacion11.value;
    reporteSalud11.percibeSabores = this.monitoreoFg.controls.disgeusia11.value;
    reporteSalud11.percibeOlores = this.monitoreoFg.controls.anosmia11.value;
    reporteSalud11.otrosCansancios = this.monitoreoFg.controls.otrosCansancios11.value;

    this.fichaPersonalBlanco.reportesSalud.push(reporteSalud11);

    let reporteSalud12 = new FormSeccionReporteSalud();
    reporteSalud12.fecha = this.fechaSelec12;
    //reporteSalud12.fecha = this.monitoreoFg.controls.fecha12.value;
    reporteSalud12.tos = this.monitoreoFg.controls.tos12.value;
    reporteSalud12.sentisFiebre = this.monitoreoFg.controls.fiebre12.value;
    reporteSalud12.dolorGarganta = this.monitoreoFg.controls.dolorGarganta12.value;
    reporteSalud12.dificultadRespirar = this.monitoreoFg.controls.dificultadRespirar12.value;
    reporteSalud12.dolorCabeza = this.monitoreoFg.controls.dolorCabeza12.value;
    reporteSalud12.conjuntival = this.monitoreoFg.controls.conjuntival12.value;
    reporteSalud12.secrecionNasal = this.monitoreoFg.controls.rinorrea12.value;
    reporteSalud12.congestionNasal = this.monitoreoFg.controls.congestionNasal12.value;
    reporteSalud12.irritabilidad = this.monitoreoFg.controls.irritabilidad12.value;
    reporteSalud12.diarrea = this.monitoreoFg.controls.diarrea12.value;
    reporteSalud12.dolorOido = this.monitoreoFg.controls.dolorOido12.value;
    reporteSalud12.mialgias = this.monitoreoFg.controls.mialgias12.value;
    reporteSalud12.artralgias = this.monitoreoFg.controls.artralgias12.value;
    reporteSalud12.postracion = this.monitoreoFg.controls.postracion12.value;
    reporteSalud12.nauseas = this.monitoreoFg.controls.nauseas12.value;
    reporteSalud12.dolorAbdominal = this.monitoreoFg.controls.dolorAbdominal12.value;
    reporteSalud12.convulsiones = this.monitoreoFg.controls.convulsiones12.value;
    reporteSalud12.auscultacion = this.monitoreoFg.controls.auscultacion12.value;
    reporteSalud12.percibeSabores = this.monitoreoFg.controls.disgeusia12.value;
    reporteSalud12.percibeOlores = this.monitoreoFg.controls.anosmia12.value;
    reporteSalud12.otrosCansancios = this.monitoreoFg.controls.otrosCansancios12.value;

    this.fichaPersonalBlanco.reportesSalud.push(reporteSalud12);

    let reporteSalud13 = new FormSeccionReporteSalud();
    reporteSalud13.fecha = this.fechaSelec13;

    reporteSalud13.tos = this.monitoreoFg.controls.tos13.value;
    reporteSalud13.sentisFiebre = this.monitoreoFg.controls.fiebre13.value;
    reporteSalud13.dolorGarganta = this.monitoreoFg.controls.dolorGarganta13.value;
    reporteSalud13.dificultadRespirar = this.monitoreoFg.controls.dificultadRespirar13.value;
    reporteSalud13.dolorCabeza = this.monitoreoFg.controls.dolorCabeza13.value;
    reporteSalud13.conjuntival = this.monitoreoFg.controls.conjuntival13.value;
    reporteSalud13.secrecionNasal = this.monitoreoFg.controls.rinorrea13.value;
    reporteSalud13.congestionNasal = this.monitoreoFg.controls.congestionNasal13.value;
    reporteSalud13.irritabilidad = this.monitoreoFg.controls.irritabilidad13.value;
    reporteSalud13.diarrea = this.monitoreoFg.controls.diarrea13.value;
    reporteSalud13.dolorOido = this.monitoreoFg.controls.dolorOido13.value;
    reporteSalud13.mialgias = this.monitoreoFg.controls.mialgias13.value;
    reporteSalud13.artralgias = this.monitoreoFg.controls.artralgias13.value;
    reporteSalud13.postracion = this.monitoreoFg.controls.postracion13.value;
    reporteSalud13.nauseas = this.monitoreoFg.controls.nauseas13.value;
    reporteSalud13.dolorAbdominal = this.monitoreoFg.controls.dolorAbdominal13.value;
    reporteSalud13.convulsiones = this.monitoreoFg.controls.convulsiones13.value;
    reporteSalud13.auscultacion = this.monitoreoFg.controls.auscultacion13.value;
    reporteSalud13.percibeSabores = this.monitoreoFg.controls.disgeusia13.value;
    reporteSalud13.percibeOlores = this.monitoreoFg.controls.anosmia13.value;
    reporteSalud13.otrosCansancios = this.monitoreoFg.controls.otrosCansancios13.value;
    this.fichaPersonalBlanco.reportesSalud.push(reporteSalud13);

    let reporteSalud14 = new FormSeccionReporteSalud();
    reporteSalud14.fecha = this.fechaSelec14;
    //reporteSalud14.fecha = this.monitoreoFg.controls.fecha14.value;
    reporteSalud14.tos = this.monitoreoFg.controls.tos14.value;
    reporteSalud14.sentisFiebre = this.monitoreoFg.controls.fiebre14.value;
    reporteSalud14.dolorGarganta = this.monitoreoFg.controls.dolorGarganta14.value;
    reporteSalud14.dificultadRespirar = this.monitoreoFg.controls.dificultadRespirar14.value;
    reporteSalud14.dolorCabeza = this.monitoreoFg.controls.dolorCabeza14.value;
    reporteSalud14.conjuntival = this.monitoreoFg.controls.conjuntival14.value;
    reporteSalud14.secrecionNasal = this.monitoreoFg.controls.rinorrea14.value;
    reporteSalud14.congestionNasal = this.monitoreoFg.controls.congestionNasal14.value;
    reporteSalud14.irritabilidad = this.monitoreoFg.controls.irritabilidad14.value;
    reporteSalud14.diarrea = this.monitoreoFg.controls.diarrea14.value;
    reporteSalud14.dolorOido = this.monitoreoFg.controls.dolorOido14.value;
    reporteSalud14.mialgias = this.monitoreoFg.controls.mialgias14.value;
    reporteSalud14.artralgias = this.monitoreoFg.controls.artralgias14.value;
    reporteSalud14.postracion = this.monitoreoFg.controls.postracion14.value;
    reporteSalud14.nauseas = this.monitoreoFg.controls.nauseas14.value;
    reporteSalud14.dolorAbdominal = this.monitoreoFg.controls.dolorAbdominal14.value;
    reporteSalud14.convulsiones = this.monitoreoFg.controls.convulsiones14.value;
    reporteSalud14.auscultacion = this.monitoreoFg.controls.auscultacion14.value;
    reporteSalud14.percibeSabores = this.monitoreoFg.controls.disgeusia14.value;
    reporteSalud14.percibeOlores = this.monitoreoFg.controls.anosmia14.value;
    reporteSalud14.otrosCansancios = this.monitoreoFg.controls.otrosCansancios14.value;

    this.fichaPersonalBlanco.reportesSalud.push(reporteSalud14);

    /*this.fichaPersonalBlanco.formSeccionReporteSalud.fecha1 = this.monitoreoFg.controls.fecha1.value;
    this.fichaPersonalBlanco.formSeccionReporteSalud.tos = this.monitoreoFg.controls.tos1.value;
    this.fichaPersonalBlanco.formSeccionReporteSalud.fiebre = this.monitoreoFg.controls.fiebre1.value;
    this.fichaPersonalBlanco.formSeccionReporteSalud.dolorGarganta = this.monitoreoFg.controls.dolorGarganta1.value;
    this.fichaPersonalBlanco.formSeccionReporteSalud.tos2 = this.monitoreoFg.controls.tos2.value;
    this.fichaPersonalBlanco.formSeccionReporteSalud.tos3 = this.monitoreoFg.controls.tos3.value;*/

    this.fichaPersonalBlanco.formSeccionClasifRiesgo = new FormSeccionClasifRiesgo();
    this.fichaPersonalBlanco.formSeccionClasifRiesgo.clasificacionFinal = this.clasificacionRiesgoFg.controls.clasifFinal.value;
    this.fichaPersonalBlanco.formSeccionClasifRiesgo.trabajoExclusion = this.clasificacionRiesgoFg.controls.exclusion.value;
    this.fichaPersonalBlanco.formSeccionClasifRiesgo.trabajoAutocontrol = this.clasificacionRiesgoFg.controls.autocontrol.value;
    this.fichaPersonalBlanco.formSeccionClasifRiesgo.trabajoNada = this.clasificacionRiesgoFg.controls.nada.value;
    this.fichaPersonalBlanco.formSeccionClasifRiesgo.trabajoOtro = this.clasificacionRiesgoFg.controls.otroIndic.value;
    this.fichaPersonalBlanco.formSeccionClasifRiesgo.trabajoOtroDescripcion = this.clasificacionRiesgoFg.controls.otroIndicEspecificar.value;
    this.fichaPersonalBlanco.formSeccionClasifRiesgo.laboratorioAntigeno = this.clasificacionRiesgoFg.controls.antigeno.value;
    this.fichaPersonalBlanco.formSeccionClasifRiesgo.laboratorioPcr = this.clasificacionRiesgoFg.controls.pcr.value;

    this.fichaPersonalBlanco.formSeccionClasifRiesgo.laboratorioNinguno = this.clasificacionRiesgoFg.controls.ningunoLab.value;
    this.fichaPersonalBlanco.formSeccionClasifRiesgo.fechaInicioSintomas = this.monitoreoFg.controls.fechaSintomas.value;
    
    this.fichaPersonalBlanco.formSeccionClasifRiesgo.seFis = this.monitoreoFg.controls.seFis.value;
    this.fichaPersonalBlanco.formSeccionClasifRiesgo.fechaInicioMonitoreo = this.registroFg.controls.fechaInicioMonitoreo.value;
    this.fichaPersonalBlanco.formSeccionClasifRiesgo.fechaCierreCaso = this.clasificacionRiesgoFg.controls.fechaCierreCaso.value;
    this.fichaPersonalBlanco.formSeccionClasifRiesgo.seCierreCaso = this.clasificacionRiesgoFg.controls.seCierreCaso.value;
    this.fichaPersonalBlanco.formSeccionClasifRiesgo.fechaPrimeraMuestra = this.clasificacionRiesgoFg.controls.fechaPrimeraMuestra.value;
    this.fichaPersonalBlanco.formSeccionClasifRiesgo.sePrimeraMuestra = this.clasificacionRiesgoFg.controls.sePrimeraMuestra.value;
    this.fichaPersonalBlanco.formSeccionClasifRiesgo.resultadoPrimeraMuestra = this.clasificacionRiesgoFg.controls.resultadoPrimeraMuestra.value;
    this.fichaPersonalBlanco.formSeccionClasifRiesgo.constanciaAislamiento = this.clasificacionRiesgoFg.controls.constAislamiento.value;
    this.fichaPersonalBlanco.formSeccionClasifRiesgo.fichaEpidemiologica = this.clasificacionRiesgoFg.controls.fichaEpidemiologica.value;
    this.fichaPersonalBlanco.formSeccionClasifRiesgo.evolucionFinal = this.clasificacionRiesgoFg.controls.evolucionFinal.value;

    this.fichaPersonalBlanco.formSeccionClasifRiesgo.internado = this.clasificacionRiesgoFg.controls.internado.value;
    if(this.clasificacionRiesgoFg.controls.establecimiento.value !== null){
      this.fichaPersonalBlanco.formSeccionClasifRiesgo.establecimientoInternacion = this.clasificacionRiesgoFg.controls.establecimiento.value.nombre;
    }
    if(this.clasificacionRiesgoFg.controls.especialidad.value !== null){
      this.fichaPersonalBlanco.formSeccionClasifRiesgo.especialidadInternacion = this.clasificacionRiesgoFg.controls.especialidad.value;
    }

    this.fichaPersonalBlanco.formSeccionClasifRiesgo.se = this.registroFg.controls.se.value;

    if(this.clasificacionRiesgoFg.controls.otroServicioInternado.value !==null){
      this.fichaPersonalBlanco.formSeccionClasifRiesgo.otroServicioInternado = this.clasificacionRiesgoFg.controls.otroServicioInternado.value;
    }

    this.fichaPersonalBlanco.formSeccionClasifRiesgo.vacunaCovid = this.registroFg.controls.vacunaCovid.value;
    this.fichaPersonalBlanco.formSeccionClasifRiesgo.nroConstancia = this.clasificacionRiesgoFg.controls.nroConstancia.value;

    this.service.guardarFichaPB(this.fichaPersonalBlanco).subscribe(response => {
          this.idRegistro = +response;
          //this._router.navigate(["covid19/carga-operador/datos-clinicos/",this.idRegistro]);
          /*this.guardarFormPersonalBlanco(this.idRegistro);
          this.guardarFormContactoContagio(this.idRegistro);
          this.guardarFormClasifRiesgo(this.idRegistro);
          this.guardarFormSintomas(this.idRegistro);*/
          this.loading = false;
          this.mensaje = "Personal de salud registrado exitosamente!";
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
    this.clasifRiesgoPaciente.laboratorioPcr = this.clasificacionRiesgoFg.controls.pcr.value;

    this.service.guardarClasifRiesgo(this.clasifRiesgoPaciente).subscribe(response => {

    },error => {
      console.log(error);
    });
  }*/

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

  filtrarServicio(event) {
    let filtered : any[] = [];
    let query = event.query;

    //for(let i = 0; i < this.serviciosSalud.length; i++) {
    for(let j = 0; j < this.lugares.length; j++) {
    //for(let lugar of this.lugares){
      let servicio = this.lugares[j];
      if (servicio.denominacion.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
        filtered.push(servicio);
      }
    }
    this.serviSaludFiltrados = filtered;
  }

  filtrarEstablecimiento(event) {
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
    {'id':34,'nombre':'AUXILIAR EN ODONTOLOGIA-ODONTOLOGIA'},
    {'id':35,'nombre':'ODONTOLOGO/A-ODONTOLOGIA'}, {'id':36,'nombre':'RADIOLOGO/A-AUXILIAR DE RADIOLOGIA'},
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
    {'id':87,'nombre':'MEDICO/A-EMERGENTOLOGO'}, {'id':88,'nombre':'MEDICO/A-MEDICINA FAMILIAR Y COMUNITARIA'}, {'id':89,'nombre':'MEDICO/A-MEDICINA FISICA Y REHABILITACION'},
    {'id':90,'nombre':'MEDICO/A-MEDICINA FORENSE'},  {'id':91,'nombre':'MEDICO/A-MEDICINA INTENSIVA'},  {'id':92,'nombre':'MEDICO/A-MEDICINA INTERNA'},
    {'id':93,'nombre':'MEDICO/A-MEDICINA PREVENTIVA Y SALUD PUBLICA'},  {'id':94,'nombre':'MEDICO/A-MEDICINA DEL TRABAJO'},  {'id':95,'nombre':'MEDICO/A-NEFROLOGIA'},
    {'id':96,'nombre':'MEDICO/A-NEUMOLOGIA'}, {'id':97,'nombre':'MEDICO/A-NEUROLOGIA'}, {'id':98,'nombre':'MEDICO/A-NUTRIOLOGIA'},
    {'id':99,'nombre':'MEDICO/A-ONCOLOGIA'}, {'id':100,'nombre':'MEDICO/A-PEDIATRIA'}, {'id':101,'nombre':'MEDICO/A-PSIQUIATRIA'}, {'id':102,'nombre':'MEDICO/A-REUMATOLOGIA'},
    {'id':103,'nombre':'MEDICO/A-TOXICOLOGIA'}, {'id':104,'nombre':'MEDICO/A-CIRUGIA VASCULAR'}, {'id':105,'nombre':'MEDICO/A-NEUROCIRUGIA'}, {'id':106,'nombre':'MEDICO/A-DERMATOLOGIA'},
    {'id':107,'nombre':'MEDICO/A-GINECOLOGIA Y OBSTETRICIA O TOCOLOGIA'}, {'id':108,'nombre':'MEDICO/A-OFTALMOLOGIA'}, {'id':109,'nombre':'MEDICO/A-OTORRINOLARINGOLOGIA'},
    {'id':110,'nombre':'MEDICO/A-TRAUMATOLOGIA'}, {'id':111,'nombre':'MEDICO/A-UROLOGIA'}, {'id':112,'nombre':'MEDICO/A-CIRUJANO'},{'id':113,'nombre':'MEDICO/A-GENERAL'},{'id':114,'nombre':'MEDICO/A-RESIDENTE'},
    {'id':115,'nombre':'MEDICO/A-CLINICA MEDICA'}, {'id':116,'nombre':'MEDICO/A-HEPATOLOGO'}, {'id':117,'nombre':'MEDICO/A-MICROBIOLOGO'}, {'id':118,'nombre':'MEDICO/A-PATOLOGO'},
    {'id':119,'nombre':'MEDICO/A-RADIOLOGO'}, {'id':120,'nombre':'MEDICO/A-PALIATIVO'}, {'id':121,'nombre':'AFINES-TECNICO SUPERIOR EN PROMOCION DE SALUD'},
    {'id':122,'nombre':'AFINES-ADMINISTRATIVOS'}, {'id':123,'nombre':'AFINES-SERVICIOS GENERALES'}];
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

  getUsuarioNotificado(event){
    console.log(typeof this.registroFg.controls.fechaInicioMonitoreo.value);
    let cedula = event.target.value;
    if(typeof this.registroFg.controls.fechaInicioMonitoreo.value ==='object'){
      let day = this.registroFg.controls.fechaInicioMonitoreo.value.getDate();
      let month = this.registroFg.controls.fechaInicioMonitoreo.value.getMonth() + 1;
      let year = this.registroFg.controls.fechaInicioMonitoreo.value.getFullYear();

      if(month < 10){
        console.log(`${day}/0${month}/${year}`);
        this.registroFg.controls.fechaInicioMonitoreo.setValue(`${day}/0${month}/${year}`);
      }else{
        this.registroFg.controls.fechaInicioMonitoreo.setValue(`${day}/${month}/${year}`);
      } 
    }
    
    if(this.registroFg.controls.reingreso.value===true){
      this.consultarIdentificaciones(cedula, 'registro');
    }else{
      console.log(this.registroFg.controls.reingreso.value);
      this.service.getUsuarioNotificado(cedula, this.registroFg.controls.fechaInicioMonitoreo.value).subscribe(resultado => {
        if(resultado > 0){
          this.mensaje = "Disculpe, no podrá guardar este registro. Ya existe un registro para la persona con CI: "+cedula;
          this.registroFg.controls.cedula.setValue('');
          //this.registroFg.controls.fechaInicioMonitoreo.setValue('');
          //this.registroFg.controls.se.setValue(null);
          this.openMessageDialog();
        }else{
          //console.log("NO EXISTE "+resultado);
          this.consultarIdentificaciones(cedula, 'registro');
        }
      }, error => {
        console.log(error);
        this.mensaje = error.error;
        this.openMessageDialog();
      });
    }
  }

  consultarIdentificaciones(event, band) {
    if(typeof event ==='object'){
      this.nroDocumento = event.target.value;
    }else{
      this.nroDocumento = event;
    }
    
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
        this.service.getIdentificacionesByNumeroDocumento(this.nroDocumento.trim()).subscribe(response => {
            this.loading = false;
            if(response.obtenerPersonaPorNroCedulaResponse.return.error){

              this.fallaSII = true;
              this.mensaje = response.obtenerPersonaPorNroCedulaResponse.return.error;
              this.openMessageDialog();
            }
            else
            {
              if(band==='registro'){

                console.log(response.obtenerPersonaPorNroCedulaResponse);
                this.registroFg.controls.nombre.setValue(response.obtenerPersonaPorNroCedulaResponse.return.nombres);
                this.registroFg.controls.apellido.setValue(response.obtenerPersonaPorNroCedulaResponse.return.apellido);
                /*this.registroFg.controls.fechaNacimiento.setValue(response.obtenerPersonaPorNroCedulaResponse.return.fechNacim.substring(0, 4)+'-'+
                response.obtenerPersonaPorNroCedulaResponse.return.fechNacim.substring(5, 7)+'-'+response.obtenerPersonaPorNroCedulaResponse.return.fechNacim.substring(8, 10));*/
                this.registroFg.controls.fechaNacimiento.setValue(response.obtenerPersonaPorNroCedulaResponse.return.fechNacim.substring(8, 10)+'/'+
                response.obtenerPersonaPorNroCedulaResponse.return.fechNacim.substring(5, 7)+'/'+
                response.obtenerPersonaPorNroCedulaResponse.return.fechNacim.substring(0, 4));
                this.registroFg.controls.sexo.setValue(response.obtenerPersonaPorNroCedulaResponse.return.sexo);

                if(this.registroFg.controls.fechaNacimiento.value){
                  this.setearEdad(response.obtenerPersonaPorNroCedulaResponse.return.fechNacim.substring(0, 4)+'-'+response.obtenerPersonaPorNroCedulaResponse.return.fechNacim.substring(5, 7)+'-'+
                  response.obtenerPersonaPorNroCedulaResponse.return.fechNacim.substring(8, 10));
                }
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
                                                response.obtenerPersonaPorNroCedulaResponse.return.fechNacim.substring(5, 7)+'/'+response.obtenerPersonaPorNroCedulaResponse.return.fechNacim.substring(0, 4);*/
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
            this.fallaSII = true;
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
          this.ngOnDestroy();
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

  setearSeFis(event){
    let fechaSelec = new Date(event);

    if(fechaSelec >= new Date('2021-01-03') && fechaSelec <= new Date('2021-01-10')){
      this.monitoreoFg.controls.seFis.setValue(1);
    }
    if(fechaSelec >= new Date('2021-01-10') && fechaSelec <= new Date('2021-01-17')){
      this.monitoreoFg.controls.seFis.setValue(2);
    }
    if(fechaSelec >= new Date('2021-01-17') && fechaSelec <= new Date('2021-01-24')){
      this.monitoreoFg.controls.seFis.setValue(3);
    }
    if(fechaSelec >= new Date('2021-01-24') && fechaSelec <= new Date('2021-01-31')){
      this.monitoreoFg.controls.seFis.setValue(4);
    }
    if(fechaSelec >= new Date('2021-01-31') && fechaSelec <= new Date('2021-02-07')){
      this.monitoreoFg.controls.seFis.setValue(5);
    }
    if(fechaSelec >= new Date('2021-02-07') && fechaSelec <= new Date('2021-02-14')){
      this.monitoreoFg.controls.seFis.setValue(6);
    }
    if(fechaSelec >= new Date('2021-02-14') && fechaSelec <= new Date('2021-02-21')){
      this.monitoreoFg.controls.seFis.setValue(7);
    }
    if(fechaSelec >= new Date('2021-02-21') && fechaSelec <= new Date('2021-02-28')){
      this.monitoreoFg.controls.seFis.setValue(8);
    }
    if(fechaSelec >= new Date('2021-02-28') && fechaSelec <= new Date('2021-03-07')){
      this.monitoreoFg.controls.seFis.setValue(9);
    }
    if(fechaSelec >= new Date('2021-03-07') && fechaSelec <= new Date('2021-03-14')){
      this.monitoreoFg.controls.seFis.setValue(10);
    }
    if(fechaSelec >= new Date('2021-03-14') && fechaSelec <= new Date('2021-03-21')){
      this.monitoreoFg.controls.seFis.setValue(11);
    }
    if(fechaSelec >= new Date('2021-03-21') && fechaSelec <= new Date('2021-03-28')){
      this.monitoreoFg.controls.seFis.setValue(12);
    }
    if(fechaSelec >= new Date('2021-03-28') && fechaSelec <= new Date('2021-04-04')){
      this.monitoreoFg.controls.seFis.setValue(13);
    }
    if(fechaSelec >= new Date('2021-04-04') && fechaSelec <= new Date('2021-04-11')){
      this.monitoreoFg.controls.seFis.setValue(14);
    }
    if(fechaSelec >= new Date('2021-04-11') && fechaSelec <= new Date('2021-04-18')){
      this.monitoreoFg.controls.seFis.setValue(15);
    }
    if(fechaSelec >= new Date('2021-04-18') && fechaSelec <= new Date('2021-04-25')){
      this.monitoreoFg.controls.seFis.setValue(16);
    }
    if(fechaSelec >= new Date('2021-04-25') && fechaSelec <= new Date('2021-05-02')){
      this.monitoreoFg.controls.seFis.setValue(17);
    }
    if(fechaSelec >= new Date('2021-05-02') && fechaSelec <= new Date('2021-05-09')){
      this.monitoreoFg.controls.seFis.setValue(18);
    }
    if(fechaSelec >= new Date('2021-05-09') && fechaSelec <= new Date('2021-05-16')){
      this.monitoreoFg.controls.seFis.setValue(19);
    }
    if(fechaSelec >= new Date('2021-05-16') && fechaSelec <= new Date('2021-05-23')){
      this.monitoreoFg.controls.seFis.setValue(20);
    }
    if(fechaSelec >= new Date('2021-05-23') && fechaSelec <= new Date('2021-05-30')){
      this.monitoreoFg.controls.seFis.setValue(21);
    }
    if(fechaSelec >= new Date('2021-05-30') && fechaSelec <= new Date('2021-06-06')){
      this.monitoreoFg.controls.seFis.setValue(22);
    }
    if(fechaSelec >= new Date('2021-06-06') && fechaSelec <= new Date('2021-06-13')){
      this.monitoreoFg.controls.seFis.setValue(23);
    }
    if(fechaSelec >= new Date('2021-06-13') && fechaSelec <= new Date('2021-06-20')){
      this.monitoreoFg.controls.seFis.setValue(24);
    }
    if(fechaSelec >= new Date('2021-06-20') && fechaSelec <= new Date('2021-06-27')){
      this.monitoreoFg.controls.seFis.setValue(25);
    }
    if(fechaSelec >= new Date('2021-06-27') && fechaSelec <= new Date('2021-07-04')){
      this.monitoreoFg.controls.seFis.setValue(26);
    }
    if(fechaSelec >= new Date('2021-07-04') && fechaSelec <= new Date('2021-07-11')){
      this.monitoreoFg.controls.seFis.setValue(27);
    }
    if(fechaSelec >= new Date('2021-07-11') && fechaSelec <= new Date('2021-07-18')){
      this.monitoreoFg.controls.seFis.setValue(28);
    }
    if(fechaSelec >= new Date('2021-07-18') && fechaSelec <= new Date('2021-07-25')){
      this.monitoreoFg.controls.seFis.setValue(29);
    }
    if(fechaSelec >= new Date('2021-07-25') && fechaSelec <= new Date('2021-08-01')){
      this.monitoreoFg.controls.seFis.setValue(30);
    }
    if(fechaSelec >= new Date('2021-08-01') && fechaSelec <= new Date('2021-08-08')){
      this.monitoreoFg.controls.seFis.setValue(31);
    }
    if(fechaSelec >= new Date('2021-08-08') && fechaSelec <= new Date('2021-08-15')){
      this.monitoreoFg.controls.seFis.setValue(32);
    }
    if(fechaSelec >= new Date('2021-08-15') && fechaSelec <= new Date('2021-08-22')){
      this.monitoreoFg.controls.seFis.setValue(33);
    }
    if(fechaSelec >= new Date('2021-08-22') && fechaSelec <= new Date('2021-08-29')){
      this.monitoreoFg.controls.seFis.setValue(34);
    }
    if(fechaSelec >= new Date('2021-08-29') && fechaSelec <= new Date('2021-09-05')){
      this.monitoreoFg.controls.seFis.setValue(35);
    }
    if(fechaSelec >= new Date('2021-09-05') && fechaSelec <= new Date('2021-09-12')){
      this.monitoreoFg.controls.seFis.setValue(36);
    }
    if(fechaSelec >= new Date('2021-09-12') && fechaSelec <= new Date('2021-09-19')){
      this.monitoreoFg.controls.seFis.setValue(37);
    }
    if(fechaSelec >= new Date('2021-09-19') && fechaSelec <= new Date('2021-09-26')){
      this.monitoreoFg.controls.seFis.setValue(38);
    }
    if(fechaSelec >= new Date('2021-09-26') && fechaSelec <= new Date('2021-10-03')){
      this.monitoreoFg.controls.seFis.setValue(39);
    }
    if(fechaSelec >= new Date('2021-10-03') && fechaSelec <= new Date('2021-10-10')){
      this.monitoreoFg.controls.seFis.setValue(40);
    }
    if(fechaSelec >= new Date('2021-10-10') && fechaSelec <= new Date('2021-10-17')){
      this.monitoreoFg.controls.seFis.setValue(41);
    }
    if(fechaSelec >= new Date('2021-10-17') && fechaSelec <= new Date('2021-10-24')){
      this.monitoreoFg.controls.seFis.setValue(42);
    }
    if(fechaSelec >= new Date('2021-10-24') && fechaSelec <= new Date('2021-10-31')){
      this.monitoreoFg.controls.seFis.setValue(43);
    }
    if(fechaSelec >= new Date('2021-10-31') && fechaSelec <= new Date('2021-11-07')){
      this.monitoreoFg.controls.seFis.setValue(44);
    }
    if(fechaSelec >= new Date('2021-11-07') && fechaSelec <= new Date('2021-11-14')){
      this.monitoreoFg.controls.seFis.setValue(45);
    }
    if(fechaSelec >= new Date('2021-11-14') && fechaSelec <= new Date('2021-11-21')){
      this.monitoreoFg.controls.seFis.setValue(46);
    }
    if(fechaSelec >= new Date('2021-11-21') && fechaSelec <= new Date('2021-11-28')){
      this.monitoreoFg.controls.seFis.setValue(47);
    }
    if(fechaSelec >= new Date('2021-11-28') && fechaSelec <= new Date('2021-12-05')){
      this.monitoreoFg.controls.seFis.setValue(48);
    }
    if(fechaSelec >= new Date('2021-12-05') && fechaSelec <= new Date('2021-12-12')){
      this.monitoreoFg.controls.seFis.setValue(49);
    }
    if(fechaSelec >= new Date('2021-12-12') && fechaSelec <= new Date('2021-12-19')){
      this.monitoreoFg.controls.seFis.setValue(50);
    }
    if(fechaSelec >= new Date('2021-12-19') && fechaSelec <= new Date('2021-12-26')){
      this.monitoreoFg.controls.seFis.setValue(51);
    }
    if(fechaSelec >= new Date('2021-12-26') && fechaSelec <= new Date('2022-01-02')){
      this.monitoreoFg.controls.seFis.setValue(52);
    }
  }

  setearSeMuestra(event){
    let fechaSelec = new Date(event);

    if(fechaSelec >= new Date('2021-01-03') && fechaSelec <= new Date('2021-01-10')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(1);
    }
    if(fechaSelec >= new Date('2021-01-10') && fechaSelec <= new Date('2021-01-17')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(2);
    }
    if(fechaSelec >= new Date('2021-01-17') && fechaSelec <= new Date('2021-01-24')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(3);
    }
    if(fechaSelec >= new Date('2021-01-24') && fechaSelec <= new Date('2021-01-31')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(4);
    }
    if(fechaSelec >= new Date('2021-01-31') && fechaSelec <= new Date('2021-02-07')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(5);
    }
    if(fechaSelec >= new Date('2021-02-07') && fechaSelec <= new Date('2021-02-14')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(6);
    }
    if(fechaSelec >= new Date('2021-02-14') && fechaSelec <= new Date('2021-02-21')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(7);
    }
    if(fechaSelec >= new Date('2021-02-21') && fechaSelec <= new Date('2021-02-28')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(8);
    }
    if(fechaSelec >= new Date('2021-02-28') && fechaSelec <= new Date('2021-03-07')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(9);
    }
    if(fechaSelec >= new Date('2021-03-07') && fechaSelec <= new Date('2021-03-14')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(10);
    }
    if(fechaSelec >= new Date('2021-03-14') && fechaSelec <= new Date('2021-03-21')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(11);
    }
    if(fechaSelec >= new Date('2021-03-21') && fechaSelec <= new Date('2021-03-28')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(12);
    }
    if(fechaSelec >= new Date('2021-03-28') && fechaSelec <= new Date('2021-04-04')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(13);
    }
    if(fechaSelec >= new Date('2021-04-04') && fechaSelec <= new Date('2021-04-11')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(14);
    }
    if(fechaSelec >= new Date('2021-04-11') && fechaSelec <= new Date('2021-04-18')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(15);
    }
    if(fechaSelec >= new Date('2021-04-18') && fechaSelec <= new Date('2021-04-25')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(16);
    }
    if(fechaSelec >= new Date('2021-04-25') && fechaSelec <= new Date('2021-05-02')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(17);
    }
    if(fechaSelec >= new Date('2021-05-02') && fechaSelec <= new Date('2021-05-09')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(18);
    }
    if(fechaSelec >= new Date('2021-05-09') && fechaSelec <= new Date('2021-05-16')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(19);
    }
    if(fechaSelec >= new Date('2021-05-16') && fechaSelec <= new Date('2021-05-23')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(20);
    }
    if(fechaSelec >= new Date('2021-05-23') && fechaSelec <= new Date('2021-05-30')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(21);
    }
    if(fechaSelec >= new Date('2021-05-30') && fechaSelec <= new Date('2021-06-06')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(22);
    }
    if(fechaSelec >= new Date('2021-06-06') && fechaSelec <= new Date('2021-06-13')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(23);
    }
    if(fechaSelec >= new Date('2021-06-13') && fechaSelec <= new Date('2021-06-20')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(24);
    }
    if(fechaSelec >= new Date('2021-06-20') && fechaSelec <= new Date('2021-06-27')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(25);
    }
    if(fechaSelec >= new Date('2021-06-27') && fechaSelec <= new Date('2021-07-04')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(26);
    }
    if(fechaSelec >= new Date('2021-07-04') && fechaSelec <= new Date('2021-07-11')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(27);
    }
    if(fechaSelec >= new Date('2021-07-11') && fechaSelec <= new Date('2021-07-18')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(28);
    }
    if(fechaSelec >= new Date('2021-07-18') && fechaSelec <= new Date('2021-07-25')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(29);
    }
    if(fechaSelec >= new Date('2021-07-25') && fechaSelec <= new Date('2021-08-01')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(30);
    }
    if(fechaSelec >= new Date('2021-08-01') && fechaSelec <= new Date('2021-08-08')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(31);
    }
    if(fechaSelec >= new Date('2021-08-08') && fechaSelec <= new Date('2021-08-15')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(32);
    }
    if(fechaSelec >= new Date('2021-08-15') && fechaSelec <= new Date('2021-08-22')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(33);
    }
    if(fechaSelec >= new Date('2021-08-22') && fechaSelec <= new Date('2021-08-29')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(34);
    }
    if(fechaSelec >= new Date('2021-08-29') && fechaSelec <= new Date('2021-09-05')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(35);
    }
    if(fechaSelec >= new Date('2021-09-05') && fechaSelec <= new Date('2021-09-12')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(36);
    }
    if(fechaSelec >= new Date('2021-09-12') && fechaSelec <= new Date('2021-09-19')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(37);
    }
    if(fechaSelec >= new Date('2021-09-19') && fechaSelec <= new Date('2021-09-26')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(38);
    }
    if(fechaSelec >= new Date('2021-09-26') && fechaSelec <= new Date('2021-10-03')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(39);
    }
    if(fechaSelec >= new Date('2021-10-03') && fechaSelec <= new Date('2021-10-10')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(40);
    }
    if(fechaSelec >= new Date('2021-10-10') && fechaSelec <= new Date('2021-10-17')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(41);
    }
    if(fechaSelec >= new Date('2021-10-17') && fechaSelec <= new Date('2021-10-24')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(42);
    }
    if(fechaSelec >= new Date('2021-10-24') && fechaSelec <= new Date('2021-10-31')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(43);
    }
    if(fechaSelec >= new Date('2021-10-31') && fechaSelec <= new Date('2021-11-07')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(44);
    }
    if(fechaSelec >= new Date('2021-11-07') && fechaSelec <= new Date('2021-11-14')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(45);
    }
    if(fechaSelec >= new Date('2021-11-14') && fechaSelec <= new Date('2021-11-21')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(46);
    }
    if(fechaSelec >= new Date('2021-11-21') && fechaSelec <= new Date('2021-11-28')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(47);
    }
    if(fechaSelec >= new Date('2021-11-28') && fechaSelec <= new Date('2021-12-05')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(48);
    }
    if(fechaSelec >= new Date('2021-12-05') && fechaSelec <= new Date('2021-12-12')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(49);
    }
    if(fechaSelec >= new Date('2021-12-12') && fechaSelec <= new Date('2021-12-19')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(50);
    }
    if(fechaSelec >= new Date('2021-12-19') && fechaSelec <= new Date('2021-12-26')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(51);
    }
    if(fechaSelec >= new Date('2021-12-26') && fechaSelec <= new Date('2022-01-02')){
      this.clasificacionRiesgoFg.controls.sePrimeraMuestra.setValue(52);
    }
  }

  setearSeCierreCaso(event){
    let fechaSelec = new Date(event);

    if(fechaSelec >= new Date('2021-01-03') && fechaSelec <= new Date('2021-01-10')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(1);
    }
    if(fechaSelec >= new Date('2021-01-10') && fechaSelec <= new Date('2021-01-17')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(2);
    }
    if(fechaSelec >= new Date('2021-01-17') && fechaSelec <= new Date('2021-01-24')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(3);
    }
    if(fechaSelec >= new Date('2021-01-24') && fechaSelec <= new Date('2021-01-31')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(4);
    }
    if(fechaSelec >= new Date('2021-01-31') && fechaSelec <= new Date('2021-02-07')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(5);
    }
    if(fechaSelec >= new Date('2021-02-07') && fechaSelec <= new Date('2021-02-14')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(6);
    }
    if(fechaSelec >= new Date('2021-02-14') && fechaSelec <= new Date('2021-02-21')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(7);
    }
    if(fechaSelec >= new Date('2021-02-21') && fechaSelec <= new Date('2021-02-28')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(8);
    }
    if(fechaSelec >= new Date('2021-02-28') && fechaSelec <= new Date('2021-03-07')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(9);
    }
    if(fechaSelec >= new Date('2021-03-07') && fechaSelec <= new Date('2021-03-14')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(10);
    }
    if(fechaSelec >= new Date('2021-03-14') && fechaSelec <= new Date('2021-03-21')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(11);
    }
    if(fechaSelec >= new Date('2021-03-21') && fechaSelec <= new Date('2021-03-28')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(12);
    }
    if(fechaSelec >= new Date('2021-03-28') && fechaSelec <= new Date('2021-04-04')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(13);
    }
    if(fechaSelec >= new Date('2021-04-04') && fechaSelec <= new Date('2021-04-11')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(14);
    }
    if(fechaSelec >= new Date('2021-04-11') && fechaSelec <= new Date('2021-04-18')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(15);
    }
    if(fechaSelec >= new Date('2021-04-18') && fechaSelec <= new Date('2021-04-25')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(16);
    }
    if(fechaSelec >= new Date('2021-04-25') && fechaSelec <= new Date('2021-05-02')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(17);
    }
    if(fechaSelec >= new Date('2021-05-02') && fechaSelec <= new Date('2021-05-09')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(18);
    }
    if(fechaSelec >= new Date('2021-05-09') && fechaSelec <= new Date('2021-05-16')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(19);
    }
    if(fechaSelec >= new Date('2021-05-16') && fechaSelec <= new Date('2021-05-23')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(20);
    }
    if(fechaSelec >= new Date('2021-05-23') && fechaSelec <= new Date('2021-05-30')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(21);
    }
    if(fechaSelec >= new Date('2021-05-30') && fechaSelec <= new Date('2021-06-06')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(22);
    }
    if(fechaSelec >= new Date('2021-06-06') && fechaSelec <= new Date('2021-06-13')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(23);
    }
    if(fechaSelec >= new Date('2021-06-13') && fechaSelec <= new Date('2021-06-20')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(24);
    }
    if(fechaSelec >= new Date('2021-06-20') && fechaSelec <= new Date('2021-06-27')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(25);
    }
    if(fechaSelec >= new Date('2021-06-27') && fechaSelec <= new Date('2021-07-04')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(26);
    }
    if(fechaSelec >= new Date('2021-07-04') && fechaSelec <= new Date('2021-07-11')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(27);
    }
    if(fechaSelec >= new Date('2021-07-11') && fechaSelec <= new Date('2021-07-18')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(28);
    }
    if(fechaSelec >= new Date('2021-07-18') && fechaSelec <= new Date('2021-07-25')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(29);
    }
    if(fechaSelec >= new Date('2021-07-25') && fechaSelec <= new Date('2021-08-01')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(30);
    }
    if(fechaSelec >= new Date('2021-08-01') && fechaSelec <= new Date('2021-08-08')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(31);
    }
    if(fechaSelec >= new Date('2021-08-08') && fechaSelec <= new Date('2021-08-15')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(32);
    }
    if(fechaSelec >= new Date('2021-08-15') && fechaSelec <= new Date('2021-08-22')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(33);
    }
    if(fechaSelec >= new Date('2021-08-22') && fechaSelec <= new Date('2021-08-29')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(34);
    }
    if(fechaSelec >= new Date('2021-08-29') && fechaSelec <= new Date('2021-09-05')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(35);
    }
    if(fechaSelec >= new Date('2021-09-05') && fechaSelec <= new Date('2021-09-12')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(36);
    }
    if(fechaSelec >= new Date('2021-09-12') && fechaSelec <= new Date('2021-09-19')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(37);
    }
    if(fechaSelec >= new Date('2021-09-19') && fechaSelec <= new Date('2021-09-26')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(38);
    }
    if(fechaSelec >= new Date('2021-09-26') && fechaSelec <= new Date('2021-10-03')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(39);
    }
    if(fechaSelec >= new Date('2021-10-03') && fechaSelec <= new Date('2021-10-10')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(40);
    }
    if(fechaSelec >= new Date('2021-10-10') && fechaSelec <= new Date('2021-10-17')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(41);
    }
    if(fechaSelec >= new Date('2021-10-17') && fechaSelec <= new Date('2021-10-24')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(42);
    }
    if(fechaSelec >= new Date('2021-10-24') && fechaSelec <= new Date('2021-10-31')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(43);
    }
    if(fechaSelec >= new Date('2021-10-31') && fechaSelec <= new Date('2021-11-07')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(44);
    }
    if(fechaSelec >= new Date('2021-11-07') && fechaSelec <= new Date('2021-11-14')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(45);
    }
    if(fechaSelec >= new Date('2021-11-14') && fechaSelec <= new Date('2021-11-21')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(46);
    }
    if(fechaSelec >= new Date('2021-11-21') && fechaSelec <= new Date('2021-11-28')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(47);
    }
    if(fechaSelec >= new Date('2021-11-28') && fechaSelec <= new Date('2021-12-05')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(48);
    }
    if(fechaSelec >= new Date('2021-12-05') && fechaSelec <= new Date('2021-12-12')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(49);
    }
    if(fechaSelec >= new Date('2021-12-12') && fechaSelec <= new Date('2021-12-19')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(50);
    }
    if(fechaSelec >= new Date('2021-12-19') && fechaSelec <= new Date('2021-12-26')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(51);
    }
    if(fechaSelec >= new Date('2021-12-26') && fechaSelec <= new Date('2022-01-02')){
      this.clasificacionRiesgoFg.controls.seCierreCaso.setValue(52);
    }
  }

  setearFechasTabla(event, band){
    //console.log("Estoy");
    let fechaSelec = new Date(event);

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
    
    if(band == 'inicio'){
      fechaSelec.setDate(fechaSelec.getDate()+2);
    }else{
      fechaSelec.setDate(fechaSelec.getDate()+1);
    }
    
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
