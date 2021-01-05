import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import {Location} from '@angular/common';
import { Subscription } from 'rxjs';
import { Covid19Service } from '../../../services/Covid19Service';

import {FormDatosBasicos} from '../model/formDatosBasicos.model';

import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';

import { StorageManagerService } from '../../login/shared/storage-manager.service';
import { CensoContacto } from "../model/censoContacto.model";
import { Paciente } from "../model/paciente.model";
import { PrimerContacto } from "../model/primerContacto.model";

declare var $: any;

//color: #ffffff !important;
//background-color: #800606 !important;

@Component({
  selector: "grilla-primer-contacto",
  templateUrl: "./grilla-primer-contacto.component.html",
  providers: [Covid19Service],
  styles: [`
        .outofstock {
            font-weight: 700;
            color: #FF5252;
            text-decoration: line-through;
        }      
        .lowstock {
            font-weight: 700;
            background-color: #fff4dc !important;
        }
        .rojoOscuro {
          color: #ffffff !important;
          background-color: #8a4343 !important;
        }
        :host ::ng-deep .row-accessories {
            background-color: rgba(0,0,0,.15) !important;
        }`
    ]
})
export class GrillaPrimerContactoComponent implements OnInit {

  public loading: boolean;
  public mensaje: string;

  //Formulario
  public formDatosBasicos: FormDatosBasicos;

  //Datos del formulario
  public cedula: string;
  public email: string;
  public domicilio: string;
  public telefono: string;
  public telefValido: boolean = false;
  public terminos: boolean;
  public tipoDocumentoOptions=[{value:0,label:'Cédula de Identidad'},{value:1,label:'Pasaporte'}];
  public tipoDocumento: any;
  public nombre: string;
  public apellido: string;
  public direccion: string;
  public codigo: string;

  private subscription: Subscription;
  public recentToken: string = ''
  public recaptchaAvailable = false;

  public origen: string;

  public idRegistro: number;
  public codigoVerif: string;

  public contrasenha: string;

  public codigoVerificacion: string;

  public response: any;

  cedulaObtenida:string;

  showActualizarDiagnostico=false;

  resultadoUltimoDiagnosticoOptions=[{value:"positivo", label: "Caso Confirmado"},
                              {value:"negativo", label: "Examen Negativo"},
                              {value:"sospechoso", label: "Caso Sospechoso"},
                              {value:"alta_confirmado", label: "Alta de Caso Confirmado"},
                              {value:"alta_aislamiento", label: "Alta de Aislamiento"},
                              {value:"fallecido", label: "Fallecido"}
                             ];
  actualizarDiagnosticoFormGroup: FormGroup;

  es = {
    firstDayOfWeek: 0,
    dayNames: [ "domingo","lunes","martes","miércoles","jueves","viernes","sábado" ],
    dayNamesShort: [ "dom","lun","mar","mié","jue","vie","sáb" ],
    dayNamesMin: [ "D","L","M","M","J","V","S" ],
    monthNames: [ "enero","febrero","marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre" ],
    monthNamesShort: [ "ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic" ],
    today: 'Hoy',
    clear: 'Borrar'
  };

  public tieneSintomasOptions=[{value:'Si',label:'Si'},{value:'No',label:'No'}];

  showCambiarNroCelular = false;
  msjCambiarNroCelular = '';
  nroCelularCambiar: string='';

  scrollableCols: any[];
  contactosList: any[];
  pageSize: number = 10;
  start: number = 0;
  filter: string;
  totalRecords: number = 0;
  sortAsc: boolean = true;
  sortField: string;

  idPaciente: number;
  showBorrarContacto: boolean = false;
  idContacto: number;
  showAgregarContacto: boolean = false;
  agregarContactoFormGroup: FormGroup;

  showEditarContacto: boolean = false;
  public cedulaPaciente: string;

  hoy: Date;

  showAgregarComentario: boolean = false;
  showNoSeContacto: boolean = false;
  showNoAtiende: boolean = false;
  showSuspenderContacto: boolean = false;

  clonedRows: { [s: string]: any; } = {};
  departamento;
  estado;
  tipoExposicion: string;
  fechaInicioSintomas: string;

  public motivos=[{value:'no_atiende',label:'No Atiende'},{value:'apagado',label:'Apagado/Sin Señal'},{value:'equivocado',label:'Número Equivocado'}];
  public binarioOptions=[{value:'SI',label:'SI'},{value:'NO',label:'NO'}];

  public exposicionOptions=[{value:'CONTACTO',label:'CONTACTO'},{value:'SD',label:'SD'}, {value:'SIN NEXO',label:'SIN NEXO'}];

  pacientesList: any[];
  formGroup: FormGroup;
  comentariosFormGroup: FormGroup;
  motivosFormGroup: FormGroup;
  llamadaFormGroup: FormGroup;
  showLlamadaRealizada: boolean = false;
  primerContacto: PrimerContacto;

  edito: boolean = false;

  region: string;

  fallaSII: boolean = false;

  public contactoOptions=[{value:'todos',label:'Todos'},{value:'pendientes',label:'Pendientes'}];
  public contactoOption="pendientes";

  public departamentoOptions=[{id:1, nombre:'Concepción'},{id:2, nombre:'San Pedro'},
                              {id:3, nombre:'Cordillera'}, {id:4, nombre:'Guairá'},
                              {id:5, nombre:'Caaguazú'}, {id:6,nombre:'Caazapá'},
                              {id:7, nombre:'Itapúa'}, {id:8,nombre:'Misiones'},
                              {id:9, nombre:'Paraguarí'},{id:10, nombre:'Alto Paraná'},
                              {id:11, nombre:'Central'},{id:12, nombre:'Ñeembucú'},
                              {id:13, nombre:'Amambay'},{id:14, nombre:'Canindeyú'},
                              {id:15, nombre:'Presidente Hayes'}, {id:16, nombre:'Boquerón'},
                              {id:17, nombre:'Alto Paraguay'}, {id:18, nombre:'Capital'}];
  public departamentosFiltrados: any[];

  public historicoComentarios=[];
  public username;

  frozenCols: any[];

  constructor(
    private _router: Router,
    private service: Covid19Service,
    private _route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private storageManager: StorageManagerService,
    private _location: Location
  ) {
    this.loading = false;
  }

  ngOnInit() {
    const {usuario} = this.storageManager.getLoginData();
    this.region = usuario.regionSanitaria;
    this.username = usuario.username;

    this.actualizarDiagnosticoFormGroup = this.formBuilder.group({
      resultadoUltimoDiagnostico: [null,Validators.required],
      fechaUltimoDiagnostico: [null,Validators.required],
      fechaPrevistaFinAislamiento: [null],
      fechaPrevistaTomaMuestraLaboratorial: [null],
      localTomaMuestra:[''],
      tieneSintomas: [null],
    });

    this.agregarContactoFormGroup = this.formBuilder.group({
      nroDocumento: [null,Validators.required],
      nombres: [null,Validators.required],
      apellidos: [null,Validators.required],
      telefono: [null,Validators.required],
      domicilio: [null,Validators.required],
      fechaUltimoContacto: [null,Validators.required],
      paciente: [null],
      tipo: [null,Validators.required],
    });

    this.comentariosFormGroup = this.formBuilder.group({
      nexo: [null],
      comentarios: [null,Validators.required]
    });

    this.motivosFormGroup = this.formBuilder.group({
      motivoNoContacto: [null,Validators.required]
    });

    /*this._route.params.subscribe(params => {
      this.cedulaPaciente = params["cedula"];
    });*/

    /*this.cols = [{ field: 'fechaCierreCaso', header: 'Fecha de Cierre', width: '7%' },
        { field: 'nroDocumento', header: 'Nro de Documento', width: '7%'},
        { field: 'nombres', header: 'Nombres', width: '9%' },
        { field: 'apellidos', header: 'Apellidos', width: '11%' },
        { field: 'telefono', header: 'Teléfono', width: '8%' },
        { field: 'departamento', header: 'Departamento', width: '9%' },
        //{ field: 'distrito', header: 'Distrito', width: '8%' },
        { field: 'hospitalizado', header: 'Internado', width: '6%' },
        { field: 'fallecido', header: 'Fallecido', width: '6%' },
        { field: 'tipoExposicion', header: 'Tipo de Exposición', width: '9%' },
        { field: 'fechaInicioSintomas', header: 'Fecha de Inicio de Síntomas', width: '8%' },
        { field: 'estadoPrimeraLlamada', header: 'Estado de Llamada', width: '9%' }];
        //{ field: 'fechaUltimaLlamada', header: 'Fecha de Última Llamada', width: '8%' }];
        //{ field: '', header: 'Acciones', width: '15%' }];*/

        this.scrollableCols = [{ field: 'fechaCierreCaso', header: 'Fecha de Cierre'},
        { field: 'nroDocumento', header: 'Nro de Documento'},
        { field: 'codigoPaciente', header: 'Código de Paciente'},
        { field: 'nombre', header: 'Nombres'},
        { field: 'apellido', header: 'Apellidos'},
        { field: 'telefono', header: 'Teléfono'},
        { field: 'departamento', header: 'Departamento'},
        { field: 'distrito', header: 'Distrito'},
        { field: 'hospitalizado', header: 'Internado'},
        { field: 'fallecido', header: 'Fallecido'},
        { field: 'tipoExposicion', header: 'Tipo de Exposición'},
        { field: 'fechaInicioSintomas', header: 'Fecha de Inicio de Síntomas'},
        { field: 'estadoPrimeraLlamada', header: 'Estado de Llamada'}];

        this.frozenCols = [
          { field: 'acc', header: 'Acciones'}
        ];
   
  }

  load($event: any) {
    if ($event) {
      this.filter = $event.globalFilter;
      this.start = $event.first;
      this.pageSize = $event.rows;
      this.sortField = $event.sortField;

      if ($event.sortOrder == 1)
        this.sortAsc = true;
      else
        this.sortAsc = false;
    }
    this.buscarContactos('pendientes');
  }

buscarContactos(opcionFiltro){
  
    this.service.getPacientesPrimerContacto(this.start, this.pageSize, this.filter, this.sortAsc, this.sortField, this.region, 
                                            opcionFiltro, this.username).subscribe(pacientes => {
      this.pacientesList = pacientes.lista;
      this.totalRecords = pacientes.totalRecords;
      console.log(this.pacientesList);
      
      /*this.contactosList = [{actualizado: "no",fechaCierre:"2020-10-30T11:14:18.911-0300", estado: "Internado", apellidos: "Ocampos", domicilio: "Dominicana 216", fechaModificacion: null,
      fechaUltimoContacto: "2020-10-20", id: 0, nombres: "Tito", nroDocumento: "1695901",
      paciente: 1, telefono: "0986108204", timestampCreacion: "2020-10-29T11:14:18.911-0300",
      tipo: "Pre Quirúrgico", departamento: "Central",distrito: "San Lorenzo"}, {actualizado: "no", fechaCierre:"2020-10-29T11:14:18.911-0300", estado: "Fallecido", apellidos: "Torres", domicilio: "Manduvirá 218", fechaModificacion: null,
      fechaUltimoContacto: "2020-10-22", id: 1, nombres: "Jorge", nroDocumento: "1695951",
      paciente: 1, telefono: "0986108204", timestampCreacion: "2020-10-29T11:14:18.911-0300",
      tipo: "Contacto", departamento: "Central", distrito: "Asunción"}, {actualizado: "no", fechaCierre:"2020-10-29T11:14:18.911-0300", estado: "Internado", apellidos: "Salinas", domicilio: "Ayolas 214", fechaModificacion: null,
      fechaUltimoContacto: "2020-10-19", id: 2, nombres: "Juan", nroDocumento: "1695851",
      paciente: 1, telefono: "0986108204", timestampCreacion: "2020-10-29T11:14:18.911-0300",
      tipo: "Sin nexo", departamento: "Central", distrito: "Asunción"}];
      this.totalRecords = 4;*/
    });
  
  
}

consultarIdentificaciones(event) {
  const nroDocumento = event.target.value;
  //if(formDatosBasicos.tipoDocumento==0 && formDatosBasicos.numeroDocumento){
  if(nroDocumento){
    if(nroDocumento.includes('.'))
    {
      this.mensaje = 'La cédula no debe poseer puntos.';
      this.openMessageDialog();
    }
    else
    {
      this.loading = true;
      //formDatosBasicos.numeroDocumento=formDatosBasicos.numeroDocumento.trim();
      this.service.getIdentificacionesByNumeroDocumento(nroDocumento.trim()).subscribe(response => {
          this.loading = false;
          if(response.obtenerPersonaPorNroCedulaResponse.return.error){
            this.fallaSII = true;
            this.mensaje = response.obtenerPersonaPorNroCedulaResponse.return.error;
            this.openMessageDialog();
          }
          else
          {
            this.formGroup.controls.nombre.setValue(response.obtenerPersonaPorNroCedulaResponse.return.nombres);
            this.formGroup.controls.apellido.setValue(response.obtenerPersonaPorNroCedulaResponse.return.apellido);
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

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  obtenerPersona(cedula): void {

    this.loading = true;
    this.cedula=null;
    this.codigoVerificacion=null;
    this.formDatosBasicos = null;
    this.service.getDatosPacienteByNumeroDocumento(cedula).subscribe(response => {
        this.loading = false;
        this.cedulaObtenida=cedula;
        this.response = response;
        this.mensaje= null;
    }, error => {
      if(error.status == 401)
      {
        this._router.navigate(["/"]);
      }
      else{
        this.loading = false;
        this.mensaje = "No se encontró una persona con este identificador";
        this.response = null;
      }
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

  actualizarDiagnostico(): void {
    this.loading = true;
    let diagnostico:any={};
    diagnostico.numeroDocumento=this.cedulaObtenida;
    diagnostico.resultadoUltimoDiagnostico=this.actualizarDiagnosticoFormGroup.controls.resultadoUltimoDiagnostico.value.value;
    diagnostico.fechaUltimoDiagnostico=this.actualizarDiagnosticoFormGroup.controls.fechaUltimoDiagnostico.value;
    diagnostico.fechaPrevistaFinAislamiento=this.actualizarDiagnosticoFormGroup.controls.fechaPrevistaFinAislamiento.value;

    diagnostico.fechaPrevistaTomaMuestraLaboratorial=this.actualizarDiagnosticoFormGroup.controls.fechaPrevistaTomaMuestraLaboratorial.value;
    diagnostico.localTomaMuestra=this.actualizarDiagnosticoFormGroup.controls.localTomaMuestra.value;

    diagnostico.tieneSintomas = this.actualizarDiagnosticoFormGroup.controls.tieneSintomas.value;

    if((this.actualizarDiagnosticoFormGroup.controls.fechaPrevistaTomaMuestraLaboratorial.value && !diagnostico.localTomaMuestra) || 
      (!this.actualizarDiagnosticoFormGroup.controls.fechaPrevistaTomaMuestraLaboratorial.value && diagnostico.localTomaMuestra)){
        this.loading = false;
        this.mensaje = "Favor completar fecha prevista y local de toma de muestra.";
        this.openMessageDialog();
    }else{
      this.service.actualizarDiagnosticoPaciente(diagnostico).subscribe(response => {
          this.loading = false;
          this.mensaje= "Diagnóstico del Paciente registrado exitosamente.";
          this.showActualizarDiagnostico=false;
          this.response.fechaUltimoDiagnostico=this.actualizarDiagnosticoFormGroup.controls.fechaUltimoDiagnostico.value;
          this.response.resultadoUltimoDiagnostico=this.actualizarDiagnosticoFormGroup.controls.resultadoUltimoDiagnostico.value.value;
          this.response.fechaPrevistaFinAislamiento=this.actualizarDiagnosticoFormGroup.controls.fechaPrevistaFinAislamiento.value;

          this.response.fechaPrevistaTomaMuestraLaboratorial=this.actualizarDiagnosticoFormGroup.controls.fechaPrevistaTomaMuestraLaboratorial.value;
          this.response.localTomaMuestra=this.actualizarDiagnosticoFormGroup.controls.localTomaMuestra.value;

          this.response.tieneSintomas=this.actualizarDiagnosticoFormGroup.controls.tieneSintomas.value;

          this.openMessageDialog();
      }, error => {
        if(error.status == 401)
        {
          this._router.navigate(["/"]);
        }
        else
        {
          this.loading = false;
          this.mensaje = error.error;
          this.openMessageDialog();
        }
      }
    );
  }
  }

  hasRol(rolName: string){
    let credentials=this.storageManager.getLoginData();
    if(credentials){
      for(let rol of credentials.usuario.rols)
      {
        if(rol.nombre==rolName)
        {
          return true;
        }
      }
      return false;
    }
    else
    {
      this._router.navigate(["/"]);
      return false;
    }
  }

  mostrarEditarContacto(contacto){
    this.showEditarContacto = true;
    this.idContacto = contacto.id;
    this.hoy = new Date();

    this.agregarContactoFormGroup.controls.nroDocumento.setValue(contacto.nroDocumento);
    this.agregarContactoFormGroup.controls.nombres.setValue(contacto.nombres);
    this.agregarContactoFormGroup.controls.apellidos.setValue(contacto.apellidos);
    this.agregarContactoFormGroup.controls.telefono.setValue(contacto.telefono);
    this.agregarContactoFormGroup.controls.domicilio.setValue(contacto.domicilio);
    let dateParts = contacto.fechaUltimoContacto.split("-");
    let fechaContactoString = dateParts[2]+"/"+dateParts[1]+"/"+dateParts[0]
    console.log(fechaContactoString);
    this.agregarContactoFormGroup.controls.fechaUltimoContacto.setValue(fechaContactoString);
    this.agregarContactoFormGroup.controls.tipo.setValue(contacto.tipo);
  }

  closeEditarContacto(){
    this.showEditarContacto = false;
  }

  editarContacto(){
    this.loading = true;
    let contacto = new CensoContacto();
    let paciente = new Paciente();
    contacto.id = this.idContacto;
    contacto.nroDocumento = this.agregarContactoFormGroup.controls.nroDocumento.value;
    contacto.nombres = this.agregarContactoFormGroup.controls.nombres.value;
    contacto.apellidos = this.agregarContactoFormGroup.controls.apellidos.value;
    contacto.telefono = this.agregarContactoFormGroup.controls.telefono.value;
    contacto.domicilio = this.agregarContactoFormGroup.controls.domicilio.value;
    contacto.tipo = this.agregarContactoFormGroup.controls.tipo.value;

    let dateParts = this.agregarContactoFormGroup.controls.fechaUltimoContacto.value.split("/");
    let fechaContacto = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
    contacto.fechaUltimoContacto = fechaContacto;
    paciente.id = this.idPaciente;
    contacto.paciente = paciente;

    this.service.editarContacto(contacto).subscribe(response => {
      this.loading = false;
      this.mensaje = "Se ha editado correctamente el contacto.";
      this.openMessageDialog();
      this.showEditarContacto = false;

      this.buscarContactos(this.contactoOption);
    }, error => {
      if(error.status == 401)
      {
        this._router.navigate(["/"]);
      }
      else
      {
        console.log(error);
        this.loading = false;
        this.mensaje = error.error;
        this.openMessageDialog();
      }
    }
    );
  }

  mostrarAgregarContacto(){
    this.showAgregarContacto = true;
    this.hoy = new Date();
  }

  closeAgregarContacto(){
    this.showAgregarContacto = false;
    this.agregarContactoFormGroup.controls.nroDocumento.setValue(null);
    this.agregarContactoFormGroup.controls.nombres.setValue(null);
    this.agregarContactoFormGroup.controls.apellidos.setValue(null);
    this.agregarContactoFormGroup.controls.telefono.setValue(null);
    this.agregarContactoFormGroup.controls.domicilio.setValue(null);
    this.agregarContactoFormGroup.controls.fechaUltimoContacto.setValue(null);
    this.agregarContactoFormGroup.controls.tipo.setValue(null);
  }

  agregarContacto(){
    this.loading = true;
    let contacto = new CensoContacto();
    let paciente = new Paciente();
    contacto.nroDocumento = this.agregarContactoFormGroup.controls.nroDocumento.value;
    contacto.nombres = this.agregarContactoFormGroup.controls.nombres.value;
    contacto.apellidos = this.agregarContactoFormGroup.controls.apellidos.value;
    contacto.telefono = this.agregarContactoFormGroup.controls.telefono.value;
    contacto.domicilio = this.agregarContactoFormGroup.controls.domicilio.value;
    let dateParts = this.agregarContactoFormGroup.controls.fechaUltimoContacto.value.split("/");
    let fechaContacto = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
    contacto.fechaUltimoContacto = fechaContacto;
    contacto.tipo = this.agregarContactoFormGroup.controls.tipo.value;

    paciente.id = this.idPaciente;
    contacto.paciente = paciente;

    this.service.agregarContacto(contacto).subscribe(response => {
      this.loading = false;
      this.mensaje = "Se ha creado correctamente el contacto.";
      this.openMessageDialog();
      this.showAgregarContacto = false;
      this.agregarContactoFormGroup.controls.nroDocumento.setValue(null);
      this.agregarContactoFormGroup.controls.nombres.setValue(null);
      this.agregarContactoFormGroup.controls.apellidos.setValue(null);
      this.agregarContactoFormGroup.controls.telefono.setValue(null);
      this.agregarContactoFormGroup.controls.domicilio.setValue(null);
      this.agregarContactoFormGroup.controls.fechaUltimoContacto.setValue(null);
      this.agregarContactoFormGroup.controls.tipo.setValue(null);

      this.buscarContactos(this.contactoOption);
    }, error => {
      if(error.status == 401)
      {
        this._router.navigate(["/"]);
      }
      else
      {
        console.log(error);
        this.loading = false;
        this.mensaje = error.error;
        this.openMessageDialog();
      }
    }
    );
  }

  confirmarBorrado(id){
    this.showBorrarContacto = true;
    this.idContacto = id;
  }

  closePopupBorrarContacto(){
    this.showBorrarContacto = false;
  }

  borrarContacto(){
    this.service.borrarContacto(this.idContacto).subscribe(response => {
      this.loading = false;
      this.mensaje = "Se ha borrado correctamente el contacto.";
      this.openMessageDialog();
      this.showBorrarContacto = false;

      this.buscarContactos(this.contactoOption);
    }, error => {
      if(error.status == 401)
      {
        this._router.navigate(["/"]);
      }
      else
      {
        this.loading = false;
        this.mensaje = error.error;
        this.openMessageDialog();
      }
    }
    );

  }

  mostrarAgregarComentario(rowData){
    this.primerContacto = rowData;
    this.showAgregarComentario = true;

    if(rowData.comentarios !== null){
      this.historicoComentarios = rowData.comentarios.split('|');
    }
  }

  agregarComentario(){
    let fecha = new Date();
    let mes = fecha.getMonth()+1;
    if(this.primerContacto.comentarios !== null){
      this.primerContacto.comentarios = fecha.getDate()+'/'+mes+'/'+fecha.getFullYear()+' - '+this.username+' - '+this.comentariosFormGroup.controls.comentarios.value+' | '+this.primerContacto.comentarios;
    }else{
      this.primerContacto.comentarios = fecha.getDate()+'/'+mes+'/'+fecha.getFullYear()+' - '+this.username+' - '+this.comentariosFormGroup.controls.comentarios.value;
    }
    
    this.service.editarPrimerContacto(this.primerContacto).subscribe(response => {
      this.loading = false;
      this.mensaje= "Comentarios agregados exitosamente.";
      this.showAgregarComentario = false;
      this.comentariosFormGroup.controls.comentarios.setValue(null);
      this.openMessageDialog();
  }, error => {
      if(error.status == 401)
      {
        this._router.navigate(["/"]);
      }
      else
      {
        this.loading = false;
        this.mensaje = error.error;
        this.openMessageDialog();
      }
  }
  );
  }

  closePopupAgregarComentario(){
    this.comentariosFormGroup.controls.comentarios.setValue(null);
    this.showAgregarComentario = false;
  }

  mostrarNoSeContacto(columns, rowData){
    console.log(columns);
    this.primerContacto = rowData;
    this.showNoSeContacto = true;
  }

  guardarNoSeContacto(){
    this.primerContacto.estadoPrimeraLlamada = this.motivosFormGroup.controls.motivoNoContacto.value;
    this.primerContacto.cantidadReintentos++;
    this.service.editarPrimerContacto(this.primerContacto).subscribe(response => {
      this.loading = false;
      this.mensaje= "Motivo guardado exitosamente.";
      this.buscarContactos(this.contactoOption);
      this.showNoSeContacto = false;
      this.openMessageDialog();
    }, error => {
      if(error.status == 401)
      {
        this._router.navigate(["/"]);
      }
      else
      {
        this.loading = false;
        this.mensaje = error.error;
        this.openMessageDialog();
      }
    }
    );
  }

  closePopupNoSeContacto(){
    this.showNoSeContacto = false;
  }

  mostrarLlamada(rowData){
    this.primerContacto = rowData;
    this.showLlamadaRealizada = true;
  }

  guardarLlamada(){
    this.primerContacto.estadoPrimeraLlamada ="llamada_realizada";
    this.service.editarPrimerContacto(this.primerContacto).subscribe(response => {
      this.loading = false;
      this.mensaje= "Estado de la llamada guardado exitosamente.";
      this.buscarContactos(this.contactoOption);
      this.showLlamadaRealizada = false;
      this.openMessageDialog();
    }, error => {
      if(error.status == 401)
      {
        this._router.navigate(["/"]);
      }
      else
      {
        this.loading = false;
        this.mensaje = error.error;
        this.openMessageDialog();
      }
    }
    );
  }

  closePopupLlamadaRealizada(){
    this.showLlamadaRealizada = false;
  }

  onRowEditInit(rowData) {
    this.edito = true;
    this.primerContacto = rowData;

    this.formGroup = new FormGroup({
      /*fechaCierreCaso: new FormControl(rowData.fechaCierreCaso, [
        Validators.required
      ]),
      fechaUltimaLlamada: new FormControl(rowData.fechaUltimaLlamada, [
        Validators.required
      ])*/
      nroDocumento: new FormControl(rowData.nroDocumento, [
        Validators.required
      ]),
      codigoPaciente: new FormControl(rowData.codigoPaciente, [
        Validators.required
      ]),
      nombre: new FormControl(rowData.nombre, [
        Validators.required
      ]),
      apellido: new FormControl(rowData.apellido, [
        Validators.required
      ]),
      telefono: new FormControl(rowData.telefono, [
        Validators.required
      ]),
      departamento: new FormControl({nombre:rowData.departamento}, [
        Validators.required
      ]),
      distrito: new FormControl({nombre:rowData.distrito}, [
        Validators.required
      ]),
      hospitalizado: new FormControl(rowData.hospitalizado, [
        Validators.required
      ]),
      fallecido: new FormControl(rowData.fallecido, [
        Validators.required
      ]),
      tipoExposicion: new FormControl(rowData.tipoExposicion, [
        Validators.required
      ]),
      fechaInicioSintomas: new FormControl(rowData.fechaInicioSintomas, [
        Validators.required
      ])
    });
  }

  onRowEditSave(rowData){

    this.primerContacto.nroDocumento = this.formGroup.controls.nroDocumento.value;
    this.primerContacto.codigoPaciente = this.formGroup.controls.codigoPaciente.value;
    this.primerContacto.nombre = this.formGroup.controls.nombre.value;
    this.primerContacto.apellido = this.formGroup.controls.apellido.value;
    this.primerContacto.departamento = this.formGroup.controls.departamento.value.nombre;
    this.primerContacto.distrito = this.formGroup.controls.distrito.value.nombre;
    this.primerContacto.telefono = this.formGroup.controls.telefono.value;
    this.primerContacto.hospitalizado = this.formGroup.controls.hospitalizado.value;
    this.primerContacto.fallecido = this.formGroup.controls.fallecido.value;
    this.primerContacto.tipoExposicion = this.formGroup.controls.tipoExposicion.value;
    this.primerContacto.fechaInicioSintomas = this.formGroup.controls.fechaInicioSintomas.value;

    /*this.primerContacto.fechaCierreCaso = this.formGroup.controls.fechaCierreCaso.value;
    this.primerContacto.fechaUltimaLlamada = this.formGroup.controls.fechaUltimaLlamada.value;*/
    //this.contactosList[row.id].actualizado = 'si';

    this.service.editarPrimerContacto(this.primerContacto).subscribe(response => {
        this.edito = false;
        this.loading = false;
        this.mensaje= "Registro editado exitosamente.";
        this.openMessageDialog();

        this.primerContacto.editado = true;
    }, error => {
        if(error.status == 401)
        {
          this._router.navigate(["/"]);
        }
        else
        {
          this.loading = false;
          this.mensaje = error.error;
          this.openMessageDialog();
        }
    }
  );
  }

  onRowEditCancel(){
    this.edito = false;
  }

  filtrarDepto(event) {
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

  noAtiende(){
    this.showNoAtiende = true;
  }

  suspenderContacto(){
    this.showSuspenderContacto = true;
  }

  closePopupNoAtiende(){
    this.showNoAtiende = false;
  }

  closePopupSuspender(){
    this.showSuspenderContacto = false;
  }

  closePopupNoSePudoContactar(){
    
  }

}
