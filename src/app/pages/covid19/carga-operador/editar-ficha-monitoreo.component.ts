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
  public contrasenhaConfirm: string;

  public idRegistro: number;

  public sexoOptions=[{value:'M',label:'Masculino'},{value:'F',label:'Femenino'}];

  public clasRiesgoOptions=[{value:'alto',label:'Alto'},{value:'moderado',label:'Moderado'},{value:'bajo',label:'Bajo'}];

  public profesionOptions =[{value:'medico',label:'Médico/a'}, {value:'enfermero',label:'Enfermero/a'}];

  public catContagioOptions=[{value:'asistencia_paciente',label:'ASISTENCIA a paciente con COVID-19'},{value:'asistencia_paciente_preqco',label:'ASISTENCIA a paciente con COVID-19 Pre-QCO'}, {value:'asistencia_albergue',label:'ASISTENCIA en albergues/hotel salud'},
  {value:'asistencia_penitenciaria',label:'ASISTENCIA en penitenciaría'},{value:'contacto_personal_salud',label:'CONTACTO con Personal de Salud con COVID-19'},{value:'contacto_persona',label:'CONTACTO con Persona con COVID-19'}, {value:'viajero',label:'VIAJERO'},
  {value:'otro',label:'OTRO'}];

  public tipoRegistroOptions=[{value:'ingreso_pais',label:'Ingreso al país'},{value:'aislamiento',label:'Caso sospechoso Covid-19'}];

  public regionSanitariaOptions=[{id:1, nombre:'Concepción'},{id:2, nombre:'San Pedro'},
                              {id:3, nombre:'Cordillera'},{id:4, nombre:'Guairá'},
                              {id:5, nombre:'Caaguazú'},{id:6,nombre:'Caazapá'},
                              {id:7, nombre:'Itapúa'},{id:8,nombre:'Misiones'},
                              {id:9, nombre:'Paraguarí'},{id:10, nombre:'Alto Paraná'},
                              {id:11, nombre:'Central'},{id:12, nombre:'Ñeembucú'},
                              {id:13, nombre:'Amambay'},{id:14, nombre:'Canindeyú'},
                              {id:15, nombre:'Presidente Hayes'},{id:16, nombre:'Alto Paraguay'},
                              {id:17, nombre:'Boquerón'}, {id:18, nombre:'Capital'}];

  public clasifFinalOptions=[{value:'descartado',label:'Descartado'},{value:'confirmado',label:'Confirmado'}];
  public ciudadOptions: any[];

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
  serviciosSalud: any[];
  serviSaludFiltrados: any[];

  es = calendarEsLocale;

  lugares: any[];
  regionesFiltradas: any[];

  establecimientosFiltrados: any[];

  cedulaPaciente;

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

      this.obtenerPaciente(this.cedulaPaciente);
    });

    this.options="{types: ['(cities)'], componentRestrictions: { country: 'PY' }}";

    this.service.getLugaresServicio().subscribe(lugares => {
      this.lugares = lugares;
      
      /*for (let i = 0; i < ciudades.length; i++) {
        let c = ciudades[i];
        this.ciudadOptions[i] = { label: c.descripcion, value: c.idCiudad };
      }*/
         
    }, error => {
      console.log(error);
      this.mensaje = error.error;
      this.openMessageDialog();
    }
    );
    //this.lugares = [{id:1,nombre:'INERAM'},{id:2,nombre:'Hospital de Barrio Obrero'}, {id:3,nombre:'IPS'}];
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
      otrosLugares: [[], Validators.required],
      reingreso: [null],
      fallecido: [null],
      internado: [null],
      establecimiento: [],
      especialidad: []
    });

    this.casoConfirmadoFg = this._formBuilder.group({
      cedula: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      sexo: ['', Validators.required]
    });

    this.monitoreoFg = this._formBuilder.group({
      /*cedula: ['', Validators.required],
      nombre: ['', Validators.required]*/
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
      dolorGarganta14: [null, Validators.required]

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

    this.setearFechasTabla(this.fechaHoy, 'inicio');

    /*this._route.params.subscribe(params => {
        this.formDatosBasicos.tipoInicio = params["tipoInicio"];
    });*/
  }

  obtenerPaciente(cedula): void {
    this.loading = true;
    this.formDatosBasicos = null;
    this.service.getPacienteEditar(cedula).subscribe(response => {
        this.loading = false;
        this.registroFg.controls.cedula.setValue(cedula);
        this.registroFg.controls.nombre.setValue(response.nombre);
        this.registroFg.controls.apellido.setValue(response.apellido);
        this.registroFg.controls.sexo.setValue(response.sexo);
        //this.registroFg.controls.fechaNacimiento.setValue(response.fechaNacimiento);
        this.registroFg.controls.fechaNacimiento.setValue(response.fechaNacimiento.substring(8, 10)+'/'+
                response.fechaNacimiento.substring(5, 7)+'/'+
                response.fechaNacimiento.substring(0, 4));

        console.log(response);
        //this.consultarIdentificaciones(cedula,'registro');
        this.registroFg.controls.direccion.setValue(response.direccionDomicilio);
        this.registroFg.controls.telefono.setValue(response.numeroCelular);

        this.registroFg.controls.servicioSalud.setValue({nombre:response.servicioSalud});
        this.registroFg.controls.regionSanitaria.setValue({nombre:response.regionSanitaria});
        this.registroFg.controls.profesion.setValue(response.profesion);
        this.registroFg.controls.funcion.setValue(response.funcion);
        this.registroFg.controls.otrosLugares.setValue(response.otrosLugares);
        this.registroFg.controls.reingreso.setValue(response.reingreso);
        this.registroFg.controls.fallecido.setValue(response.fallecido);
        this.registroFg.controls.internado.setValue(response.internado);
        this.registroFg.controls.establecimiento.setValue({nombre:response.establecimientoInternacion});
        this.registroFg.controls.especialidad.setValue(response.especialidadInternacion);

        this.casoConfirmadoFg.controls.cedula.setValue(response.numeroDocumentoContacto);
        this.casoConfirmadoFg.controls.nombre.setValue(response.nombreContacto);
        this.casoConfirmadoFg.controls.apellido.setValue(response.apellidoContacto);
        this.casoConfirmadoFg.controls.sexo.setValue(response.sexoContacto);
        //this.consultarIdentificaciones(response.numeroDocumentoContacto,'contacto');

        this.monitoreoFg.controls.fechaSintomas.setValue(response.fechaInicioSintoma); 
        this.monitoreoFg.controls.fechaExposicion.setValue(response.fechaExposicion);

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
    if(!this.registroFg.controls.internado.value){
      this.registroFg.controls.establecimiento.setValue(null);
      this.registroFg.controls.especialidad.setValue(null);
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

    this.fichaPersonalBlanco.formSeccionPersonalBlanco = new FormSeccionPersonalBlanco();
    this.fichaPersonalBlanco.formSeccionPersonalBlanco.profesion = this.registroFg.controls.profesion.value;
    let lugarServicio = new LugarServicio();
    lugarServicio = this.registroFg.controls.servicioSalud.value;
    this.fichaPersonalBlanco.formSeccionPersonalBlanco.servicioSalud = lugarServicio.nombre;
    let regionSanitaria = new LugarServicio();
    regionSanitaria = this.registroFg.controls.regionSanitaria.value;
    this.fichaPersonalBlanco.formSeccionPersonalBlanco.regionSanitaria = regionSanitaria.nombre;
    this.fichaPersonalBlanco.formSeccionPersonalBlanco.funcion = this.registroFg.controls.funcion.value;
    this.fichaPersonalBlanco.formSeccionPersonalBlanco.otrosLugares = this.registroFg.controls.otrosLugares.value;
    this.fichaPersonalBlanco.formSeccionPersonalBlanco.reingreso = this.registroFg.controls.reingreso.value;
    this.fichaPersonalBlanco.formSeccionPersonalBlanco.fallecido = this.registroFg.controls.fallecido.value;
    this.fichaPersonalBlanco.formSeccionPersonalBlanco.internado = this.registroFg.controls.internado.value;
    if(this.registroFg.controls.establecimiento.value !== null){
      this.fichaPersonalBlanco.formSeccionPersonalBlanco.establecimientoInternacion = this.registroFg.controls.establecimiento.value.nombre;
    }
    if(this.registroFg.controls.especialidad.value !== null){
      this.fichaPersonalBlanco.formSeccionPersonalBlanco.especialidadInternacion = this.registroFg.controls.especialidad.value;
    }

    this.fichaPersonalBlanco.formSeccionContactoContagio = new FormSeccionContactoContagio();
    this.fichaPersonalBlanco.formSeccionContactoContagio.nroDocumento = this.casoConfirmadoFg.controls.cedula.value;
    this.fichaPersonalBlanco.formSeccionContactoContagio.nombre = this.casoConfirmadoFg.controls.nombre.value;
    this.fichaPersonalBlanco.formSeccionContactoContagio.apellido = this.casoConfirmadoFg.controls.apellido.value;
    this.fichaPersonalBlanco.formSeccionContactoContagio.sexo = this.casoConfirmadoFg.controls.sexo.value;

    this.fichaPersonalBlanco.formSeccionReporteSalud = new FormSeccionReporteSalud();
    this.fichaPersonalBlanco.formSeccionReporteSalud.fecha1 = this.monitoreoFg.controls.fecha1.value;
    this.fichaPersonalBlanco.formSeccionReporteSalud.fecha2 = this.monitoreoFg.controls.fecha2.value;
    this.fichaPersonalBlanco.formSeccionReporteSalud.fecha3 = this.monitoreoFg.controls.fecha3.value;
    this.fichaPersonalBlanco.formSeccionReporteSalud.fecha4 = this.monitoreoFg.controls.fecha4.value;
    this.fichaPersonalBlanco.formSeccionReporteSalud.fecha5 = this.monitoreoFg.controls.fecha5.value;
    this.fichaPersonalBlanco.formSeccionReporteSalud.fecha6 = this.monitoreoFg.controls.fecha6.value;
    this.fichaPersonalBlanco.formSeccionReporteSalud.fecha7 = this.monitoreoFg.controls.fecha7.value;
    this.fichaPersonalBlanco.formSeccionReporteSalud.fecha8 = this.monitoreoFg.controls.fecha8.value;
    this.fichaPersonalBlanco.formSeccionReporteSalud.fecha9 = this.monitoreoFg.controls.fecha9.value;
    this.fichaPersonalBlanco.formSeccionReporteSalud.fecha10 = this.monitoreoFg.controls.fecha10.value;
    this.fichaPersonalBlanco.formSeccionReporteSalud.fecha11 = this.monitoreoFg.controls.fecha11.value;
    this.fichaPersonalBlanco.formSeccionReporteSalud.fecha12 = this.monitoreoFg.controls.fecha12.value;
    this.fichaPersonalBlanco.formSeccionReporteSalud.fecha13 = this.monitoreoFg.controls.fecha13.value;
    this.fichaPersonalBlanco.formSeccionReporteSalud.fecha14 = this.monitoreoFg.controls.fecha14.value;
    this.fichaPersonalBlanco.formSeccionReporteSalud.tos1 = this.monitoreoFg.controls.tos1.value;
    this.fichaPersonalBlanco.formSeccionReporteSalud.fiebre1 = this.monitoreoFg.controls.fiebre1.value;
    this.fichaPersonalBlanco.formSeccionReporteSalud.dolorGarganta1 = this.monitoreoFg.controls.dolorGarganta1.value;
    /*this.fichaPersonalBlanco.formSeccionReporteSalud.tos2 = this.monitoreoFg.controls.tos2.value;
    this.fichaPersonalBlanco.formSeccionReporteSalud.tos3 = this.monitoreoFg.controls.tos3.value;
    this.fichaPersonalBlanco.formSeccionReporteSalud.tos4 = this.monitoreoFg.controls.tos4.value;
    this.fichaPersonalBlanco.formSeccionReporteSalud.tos5 = this.monitoreoFg.controls.tos5.value;
    this.fichaPersonalBlanco.formSeccionReporteSalud.tos6 = this.monitoreoFg.controls.tos6.value;
    this.fichaPersonalBlanco.formSeccionReporteSalud.tos7 = this.monitoreoFg.controls.tos7.value;
    this.fichaPersonalBlanco.formSeccionReporteSalud.tos8 = this.monitoreoFg.controls.tos8.value;
    this.fichaPersonalBlanco.formSeccionReporteSalud.tos9 = this.monitoreoFg.controls.tos9.value;
    this.fichaPersonalBlanco.formSeccionReporteSalud.tos10 = this.monitoreoFg.controls.tos10.value;
    this.fichaPersonalBlanco.formSeccionReporteSalud.tos11 = this.monitoreoFg.controls.tos11.value;
    this.fichaPersonalBlanco.formSeccionReporteSalud.tos12 = this.monitoreoFg.controls.tos12.value;
    this.fichaPersonalBlanco.formSeccionReporteSalud.tos13 = this.monitoreoFg.controls.tos13.value;
    this.fichaPersonalBlanco.formSeccionReporteSalud.tos14 = this.monitoreoFg.controls.tos14.value;*/

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

    this.service.editarFichaPB(this.fichaPersonalBlanco).subscribe(response => {
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

  guardarFormSintomas(idRegistro){
    this.service.guardarFormSintomas(this.formDatosBasicos).subscribe(response => {
      this.loading = false;
      this.mensaje = "Se ha registrado con Éxito";
      localStorage.setItem('token',response);
        
    }, error => {
      console.log(error);
      this.loading = false;
      this.mensaje = error.error;
      this.openMessageDialog(); 
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
    for(let i = 0; i < this.regionSanitariaOptions.length; i++) {
        let region = this.regionSanitariaOptions[i];

        if (region.nombre.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(region);
        }
    }
    
    this.regionesFiltradas = filtered;
  }

  filtrarServicio(event) {
    //in a real application, make a request to a remote url with the query and return filtered results, for demo we filter at client side
    this.serviciosSalud = [{'id':4,'nombre':'Hospital Materno Infantil San Pablo'},{'id':5,'nombre':'Instituto Medicina Tropical'},{'id':6,'nombre':'Hospital de Trauma'}];
    let filtered : any[] = [];
    let query = event.query;
    for(let i = 0; i < this.serviciosSalud.length; i++) {
        let servicio = this.serviciosSalud[i];

        if (servicio.nombre.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(servicio);
        }
    }
    
    this.serviSaludFiltrados = filtered;
  }

  filtrarEstablecimiento(event) {
    let establecimientos = [{'id':4,'nombre':'Hospital Materno Infantil San Pablo'},{'id':5,'nombre':'Instituto Medicina Tropical'},{'id':6,'nombre':'Hospital de Trauma'}];
    let filtered : any[] = [];
    let query = event.query;

    for(let i = 0; i < establecimientos.length; i++) {
        let servicio = establecimientos[i];

        if (servicio.nombre.toLowerCase().indexOf(query.toLowerCase()) == 0) {
          filtered.push(servicio);
        }
    }

    this.establecimientosFiltrados = filtered;
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
    //console.log(event);
    var fechaSelec = new Date(event);
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
    }else{
      this.monitoreoFg.controls.fecha1.setValue(dd + '/' + mm);
    }
    
    
    fechaSelec.setDate(fechaSelec.getDate()+2);
    var dd = fechaSelec.getDate();
    var mm = fechaSelec.getMonth() + 1;
    var y = fechaSelec.getFullYear();
    //var formattedDate = dd + '-' + mm + '-' + y;
    if(dd < 10){
      this.monitoreoFg.controls.fecha2.setValue('0'+dd + '/' + mm);
    }else{
      this.monitoreoFg.controls.fecha2.setValue(dd + '/' + mm);
    }
    

    fechaSelec.setDate(fechaSelec.getDate()+1);
    var dd = fechaSelec.getDate();
    var mm = fechaSelec.getMonth() + 1;
    var y = fechaSelec.getFullYear();
    if(dd < 10){
      this.monitoreoFg.controls.fecha3.setValue('0'+dd + '/' + mm);
    }else{
      this.monitoreoFg.controls.fecha3.setValue(dd + '/' + mm);
    }

    fechaSelec.setDate(fechaSelec.getDate()+1);
    var dd = fechaSelec.getDate();
    var mm = fechaSelec.getMonth() + 1;
    var y = fechaSelec.getFullYear();
    if(dd < 10){
      this.monitoreoFg.controls.fecha4.setValue('0'+dd + '/' + mm);
    }else{
      this.monitoreoFg.controls.fecha4.setValue(dd + '/' + mm);
    }

    fechaSelec.setDate(fechaSelec.getDate()+1);
    var dd = fechaSelec.getDate();
    var mm = fechaSelec.getMonth() + 1;
    var y = fechaSelec.getFullYear();
    if(dd < 10){
      this.monitoreoFg.controls.fecha5.setValue('0'+dd + '/' + mm);
    }else{
      this.monitoreoFg.controls.fecha5.setValue(dd + '/' + mm);
    }

    fechaSelec.setDate(fechaSelec.getDate()+1);
    var dd = fechaSelec.getDate();
    var mm = fechaSelec.getMonth() + 1;
    var y = fechaSelec.getFullYear();
    if(dd < 10){
      this.monitoreoFg.controls.fecha6.setValue('0'+dd + '/' + mm);
    }else{
      this.monitoreoFg.controls.fecha6.setValue(dd + '/' + mm);
    }

    fechaSelec.setDate(fechaSelec.getDate()+1);
    var dd = fechaSelec.getDate();
    var mm = fechaSelec.getMonth() + 1;
    var y = fechaSelec.getFullYear();
    if(dd < 10){
      this.monitoreoFg.controls.fecha7.setValue('0'+dd + '/' + mm);
    }else{
      this.monitoreoFg.controls.fecha7.setValue(dd + '/' + mm);
    }

    fechaSelec.setDate(fechaSelec.getDate()+1);
    var dd = fechaSelec.getDate();
    var mm = fechaSelec.getMonth() + 1;
    var y = fechaSelec.getFullYear();
    if(dd < 10){
      this.monitoreoFg.controls.fecha8.setValue('0'+dd + '/' + mm);
    }else{
      this.monitoreoFg.controls.fecha8.setValue(dd + '/' + mm);
    }

    fechaSelec.setDate(fechaSelec.getDate()+1);
    var dd = fechaSelec.getDate();
    var mm = fechaSelec.getMonth() + 1;
    var y = fechaSelec.getFullYear();
    if(dd < 10){
      this.monitoreoFg.controls.fecha9.setValue('0'+dd + '/' + mm);
    }else{
      this.monitoreoFg.controls.fecha9.setValue(dd + '/' + mm);
    }

    fechaSelec.setDate(fechaSelec.getDate()+1);
    var dd = fechaSelec.getDate();
    var mm = fechaSelec.getMonth() + 1;
    var y = fechaSelec.getFullYear();
    if(dd < 10){
      this.monitoreoFg.controls.fecha10.setValue('0'+dd + '/' + mm);
    }else{
      this.monitoreoFg.controls.fecha10.setValue(dd + '/' + mm);
    }

    fechaSelec.setDate(fechaSelec.getDate()+1);
    var dd = fechaSelec.getDate();
    var mm = fechaSelec.getMonth() + 1;
    var y = fechaSelec.getFullYear();
    if(dd < 10){
      this.monitoreoFg.controls.fecha11.setValue('0'+dd + '/' + mm);
    }else{
      this.monitoreoFg.controls.fecha11.setValue(dd + '/' + mm);
    }

    fechaSelec.setDate(fechaSelec.getDate()+1);
    var dd = fechaSelec.getDate();
    var mm = fechaSelec.getMonth() + 1;
    var y = fechaSelec.getFullYear();
    if(dd < 10){
      this.monitoreoFg.controls.fecha12.setValue('0'+dd + '/' + mm);
    }else{
      this.monitoreoFg.controls.fecha12.setValue(dd + '/' + mm);
    }

    fechaSelec.setDate(fechaSelec.getDate()+1);
    var dd = fechaSelec.getDate();
    var mm = fechaSelec.getMonth() + 1;
    var y = fechaSelec.getFullYear();
    if(dd < 10){
      this.monitoreoFg.controls.fecha13.setValue('0'+dd + '/' + mm);
    }else{
      this.monitoreoFg.controls.fecha13.setValue(dd + '/' + mm);
    }

    fechaSelec.setDate(fechaSelec.getDate()+1);
    var dd = fechaSelec.getDate();
    var mm = fechaSelec.getMonth() + 1;
    var y = fechaSelec.getFullYear();
    if(dd < 10){
      this.monitoreoFg.controls.fecha14.setValue('0'+dd + '/' + mm);
    }else{
      this.monitoreoFg.controls.fecha14.setValue(dd + '/' + mm);
    }
  }

}
