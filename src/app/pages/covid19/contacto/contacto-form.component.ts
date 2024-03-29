import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription } from 'rxjs';
import { Covid19Service } from '../../../services/Covid19Service';

import {FormDatosBasicos} from '../model/formDatosBasicos.model';

import { FormGroup, Validators, FormBuilder } from "@angular/forms";

import {calendarEsLocale} from '../../../util/calendar-es-locale';
import { PrimerContacto } from "../model/primerContacto.model";
import { FichaPersonalBlanco } from "../model/fichaPersonalBlanco.model";
import { FormSeccionClasifRiesgo } from "../model/formSeccionClasifRiesgo.model";
import { FormSeccionPersonalBlanco } from "../model/formSeccionPersonalBlanco.model";
import { FormSeccionContactoContagio } from "../model/formSeccionContactoContagio.model";

declare var $: any;
@Component({
  selector: "contacto-form-selector",
  templateUrl: "./contacto-form.component.html",
  //styleUrls: ['./ficha-monitoreo.component.css'],
  providers: [Covid19Service]
})
export class ContactoFormComponent implements OnInit {

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
  public direccion: string;
  public codigo: string;

  //private subscription: Subscription;
  //public recentToken: string = ''
  //public recaptchaAvailable = false;

  public origen: string;
  public contrasenhaConfirm: string;

  public idRegistro: number;

  public clasRiesgoOptions=[{value:'alto',label:'Alto'},{value:'moderado',label:'Moderado'},{value:'bajo',label:'Bajo'}];

  public profesionOptions =[{value:'medico',label:'Médico/a'}, {value:'enfermero',label:'Enfermero/a'}];

  public catContagioOptions=[{value:'1',label:'ASISTENCIA a paciente con COVID-19'},{value:'2',label:'ASISTENCIA a paciente con COVID-19 Pre-QCO'}, {value:'3',label:'ASISTENCIA en albergues/hotel salud'},
  {value:'4',label:'ASISTENCIA en penitenciaría'},{value:'5',label:'CONTACTO con Personal de Salud con COVID-19'},{value:'6',label:'CONTACTO con Persona con COVID-19'}, {value:'7',label:'VIAJERO'},
  {value:'8',label:'OTRO'}];

  public tipoRegistroOptions=[{value:'ingreso_pais',label:'Ingreso al país'},{value:'aislamiento',label:'Caso sospechoso Covid-19'}];
  /*public departamentoOptions=[{value:0,label:'ASUNCIÓN'}, {value:1,label:'CONCEPCIÓN'},
                              {value:2,label:'SAN PEDRO'},
                              {value:3,label:'CORDILLERA'},{value:4,label:'GUAIRÁ'},
                              {value:5,label:'CAAGUAZÚ'},{value:6,label:'CAAZAPÁ'},
                              {value:7,label:'ITAPÚA'},{value:8,label:'MISIONES'},
                              {value:9,label:'PARAGUARÍ'},{value:10,label:'ALTO PARANÁ'},
                              {value:11,label:'CENTRAL'},{value:12,label:'ÑEEMBUCÚ'},
                              {value:13,label:'AMAMBAY'},{value:14,label:'CANINDEYÚ'},
                              {value:15,label:'PRESIDENTE HAYES'},{value:16,label:'ALTO PARAGUAY'},
                              {value:17,label:'BOQUERÓN'}];*/

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

regionesFiltradas: any[];

public tipoContactoOptions=[{value:'hogar',label:'Hogar'},
                              {value:'trabajo',label:'Lugar de trabajo'},{value:'comunidad',label:'Comunidad'},
                              {value:'centro_salud',label:'Centro de Salud'},{value:'otro',label:'Otro'}];

public sexoOptions=[{value:'M',label:'Masculino'},{value:'F',label:'Femenino'}];

  public ciudadOptions: any[];

  public recentToken: string = ''
  private subscription: Subscription;
  public recaptchaAvailable = false;

  public options: string;

  fechaHoy;
  //otroIndic=false;
  contactoFg: FormGroup;
  clasificacionRiesgoFg: FormGroup;

  nroDocumento;

  public exposicionOptions=[{value:'CONTACTO',label:'CONTACTO'},{value:'SD',label:'SD'}, {value:'SIN NEXO',label:'SIN NEXO'}];
  public binarioOptions=[{value:'SI',label:'SI'},{value:'NO',label:'NO'}];
  es = calendarEsLocale;

  public departamentoOptions=[{id:1, nombre:'Concepción'},{id:2, nombre:'San Pedro'},
                              {id:3, nombre:'Cordillera'},
                              {id:4, nombre:'Guairá'}, {id:5, nombre:'Caaguazú'},
                              {id:6,nombre:'Caazapá'}, {id:7, nombre:'Itapúa'},
                              {id:8,nombre:'Misiones'}, {id:9, nombre:'Paraguarí'},
                              {id:10, nombre:'Alto Paraná'}, {id:11, nombre:'Central'},
                              {id:12, nombre:'Ñeembucú'},
                              {id:13, nombre:'Amambay'},{id:14, nombre:'Canindeyú'},
                              {id:15, nombre:'Presidente Hayes'}, {id:16, nombre:'Boquerón'},
                              {id:17, nombre:'Alto Paraguay'}, {id:18, nombre:'Capital'}];

departamentosFiltrados: any[];

//Formulario global
public fichaPersonalBlanco: FichaPersonalBlanco;

public cedula: string;
public nombre: string;
public apellido: string;

  constructor(
    private _router: Router,
    private service: Covid19Service,
    private _route: ActivatedRoute,
    private _formBuilder: FormBuilder
  ) {
    this.loading = false;
    if (typeof localStorage !== "undefined") {
      localStorage.clear();
    }
  }

  ngOnInit() {

    this._route.params.forEach((urlParams) => {
      this.cedula = urlParams['cedula'];
      this.nombre = urlParams['nombre'];
      this.apellido = urlParams['apellido'];

    });

    this.fechaHoy = new Date().toLocaleDateString('fr-CA');
    //console.log(this.fechaHoy);
    this.formDatosBasicos = new FormDatosBasicos();

    this.formDatosBasicos.tipoDocumento = 0;

    this.options="{types: ['(cities)'], componentRestrictions: { country: 'PY' }}"

    window.scrollTo(0, 0);

    this.contactoFg = this._formBuilder.group({
      fechaContacto: [''],
      cedula: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      telefono: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      direccion: ['', Validators.required],
      sexo: ['', Validators.required],
      regionSanitaria: ['', Validators.required],
      /*hospitalizado: ['', Validators.required],
      fechaInicioSintomas: ['', Validators.required],
      departamento: ['', Validators.required],
      distrito: ['', Validators.required]
      tipoExposicion: ['', Validators.required],
      fallecido: ['', Validators.required],
      codPaciente: ['', Validators.required],
      fechaCierreCaso: ['', Validators.required],*/
    });

    /*this._route.params.subscribe(params => {
        this.formDatosBasicos.tipoInicio = params["tipoInicio"];
    });*/
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

  guardarFichaContacto(){
    this.loading = true;
    this.fichaPersonalBlanco = new FichaPersonalBlanco();

    this.fichaPersonalBlanco.formSeccionDatosBasicos = new FormDatosBasicos();
    this.fichaPersonalBlanco.formSeccionDatosBasicos.tipoDocumento = 'Cédula de Identidad';
    this.fichaPersonalBlanco.formSeccionDatosBasicos.numeroDocumento = this.contactoFg.controls.cedula.value;
    this.fichaPersonalBlanco.formSeccionDatosBasicos.nombre = this.contactoFg.controls.nombre.value;
    this.fichaPersonalBlanco.formSeccionDatosBasicos.apellido = this.contactoFg.controls.apellido.value;
    this.fichaPersonalBlanco.formSeccionDatosBasicos.numeroCelular = this.contactoFg.controls.telefono.value;
    this.fichaPersonalBlanco.formSeccionDatosBasicos.direccionDomicilio = this.contactoFg.controls.direccion.value;
    this.fichaPersonalBlanco.formSeccionDatosBasicos.departamentoDomicilio = this.contactoFg.controls.departamento.value.nombre;
    this.fichaPersonalBlanco.formSeccionDatosBasicos.barrio = this.contactoFg.controls.distrito.value;

    this.fichaPersonalBlanco.formSeccionClasifRiesgo = new FormSeccionClasifRiesgo();
    this.fichaPersonalBlanco.formSeccionClasifRiesgo.fechaInicioSintomas = this.contactoFg.controls.fechaInicioSintomas.value;
    if(this.contactoFg.controls.hospitalizado.value === 'SI'){
      this.fichaPersonalBlanco.formSeccionClasifRiesgo.internado = true;
    }else{
      this.fichaPersonalBlanco.formSeccionClasifRiesgo.internado = false;
    }

    this.fichaPersonalBlanco.formSeccionPersonalBlanco = new FormSeccionPersonalBlanco();
    this.fichaPersonalBlanco.formSeccionPersonalBlanco.regionSanitaria = this.contactoFg.controls.regionSanitaria.value.nombre;

    this.fichaPersonalBlanco.formSeccionContactoContagio = new FormSeccionContactoContagio();
    this.fichaPersonalBlanco.formSeccionContactoContagio.nroDocumento = this.cedula;
    this.fichaPersonalBlanco.formSeccionContactoContagio.nombre = this.nombre;
    this.fichaPersonalBlanco.formSeccionContactoContagio.apellido = this.apellido;

    this.service.guardarFichaContacto(this.fichaPersonalBlanco).subscribe(response => {
        this.idRegistro = +response;
        //this._router.navigate(["covid19/carga-operador/datos-clinicos/",this.idRegistro]);
        this.loading = false;
        this.mensaje = "Ficha registrada exitosamente!";
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

  filtrarDepartamento(event) {
    let filtered : any[] = [];
    let query = event.query;
    for(let i = 0; i < this.departamentoOptions.length; i++) {
        let departamento = this.departamentoOptions[i];

        if (departamento.nombre.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
          filtered.push(departamento);
        }
    }
    
    this.departamentosFiltrados = filtered;
  }

  filtrarRegion(event) {
    let filtered : any[] = [];
    let query = event.query;
    for(let i = 0; i < this.regionSanitariaOptions.length; i++) {
        let region = this.regionSanitariaOptions[i];

        if (region.nombre.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
          filtered.push(region);
        }
    }
    
    this.regionesFiltradas = filtered;
  }

  registrar(formDatosBasicos): void {
    localStorage.setItem('tipoDocumento', formDatosBasicos.tipoDocumento);
    localStorage.setItem('numeroDocumento', formDatosBasicos.numeroDocumento);
    localStorage.setItem('nombre', formDatosBasicos.nombre);
    localStorage.setItem('apellido', formDatosBasicos.apellido);
    localStorage.setItem('numeroCelular', formDatosBasicos.numeroCelular);
    localStorage.setItem('direccion', formDatosBasicos.direccionDomicilio);
    localStorage.setItem('email', formDatosBasicos.correoElectronico);

    /*if(this.recaptchaAvailable){
      this.formDatosBasicos.rcToken = this.recentToken;
    }*/
    
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
                this.contactoFg.controls.nombre.setValue(response.obtenerPersonaPorNroCedulaResponse.return.nombres);
                this.contactoFg.controls.apellido.setValue(response.obtenerPersonaPorNroCedulaResponse.return.apellido);
                this.contactoFg.controls.fechaNacimiento.setValue(response.obtenerPersonaPorNroCedulaResponse.return.fechNacim.substring(8, 10)+'/'+
                response.obtenerPersonaPorNroCedulaResponse.return.fechNacim.substring(5, 7)+'/'+
                response.obtenerPersonaPorNroCedulaResponse.return.fechNacim.substring(0, 4));
                this.contactoFg.controls.sexo.setValue(response.obtenerPersonaPorNroCedulaResponse.return.sexo);
              }/*else{
                this.casoConfirmadoFg.controls.nombre.setValue(response.obtenerPersonaPorNroCedulaResponse.return.nombres);
                this.casoConfirmadoFg.controls.apellido.setValue(response.obtenerPersonaPorNroCedulaResponse.return.apellido);
                this.casoConfirmadoFg.controls.sexo.setValue(response.obtenerPersonaPorNroCedulaResponse.return.sexo);
              }*/
              
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
