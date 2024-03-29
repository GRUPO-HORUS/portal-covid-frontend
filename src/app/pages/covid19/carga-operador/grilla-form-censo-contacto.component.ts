import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, NavigationExtras } from "@angular/router";
import {Location} from '@angular/common';
import { Subscription } from 'rxjs';
import { Covid19Service } from '../../../services/Covid19Service';

import {FormDatosBasicos} from '../model/formDatosBasicos.model';

import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';

import { StorageManagerService } from '../../login/shared/storage-manager.service';
import { CensoContacto } from "../model/censoContacto.model";
import { Paciente } from "../model/paciente.model";
import { PrimerContacto } from "../model/primerContacto.model";
import { FormCensoContacto } from "../model/formCensoContacto.model";

declare var $: any;

@Component({
  selector: "grilla-form-censo-contacto",
  templateUrl: "./grilla-form-censo-contacto.component.html",
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
        }`
    ]
})
export class GrillaFormCensoContactoComponent implements OnInit {
  public loading: boolean;
  public mensaje: string;

  //Formulario
  public formDatosBasicos: FormDatosBasicos;

  // datos del formulario
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
                              {value:"fallecido", label: "Fallecido"}];
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

  cols: any[];
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

  public motivosNoAtiende=[{value:'no_atiende',label:'No Atiende'},{value:'apagado',label:'Apagado/Sin Señal'},{value:'equivocado',label:'Número Equivocado'}];
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

  public contactoOptions=[{value:'todos',label:'Todos'},{value:'llamada_realizada',label:'Llamada Realizada'}];
  public contactoOption="llamada_realizada";

  public catContagioOptions=[{value:'asistencia_paciente',label:'Asistencia a paciente con COVID-19'}, {value:'contacto_personal_salud',label:'Contacto con Personal de Salud con COVID-19'},
  {value:'asistencia_penitenciaria',label:'Asistencia en penitenciaría'},{value:'asistencia_albergue',label:'Asistencia en albergues/hotel salud'},
  {value:'familiar_social',label:'Familiar Social'}, {value:'viajero',label:'Viajero'},{value:'sin_nexo',label:'Sin Nexo'}];

  public historicoComentarios=[];

  showRegistroFinalizado: boolean = false;

  showPopupNuevoContacto: boolean = false;
  contactoFg: FormGroup;

  /*public regionSanitariaOptions=[{id:1, nombre:'Concepción'},{id:2, nombre:'San Pedro Norte'},
                              {id:3, nombre:'San Pedro Sur'}, {id:4, nombre:'Cordillera'},
                              {id:5, nombre:'Guairá'}, {id:6, nombre:'Caaguazú'},
                              {id:7,nombre:'Caazapá'}, {id:8, nombre:'Itapúa'},
                              {id:9,nombre:'Misiones'},
                              {id:10, nombre:'Paraguarí'},{id:11, nombre:'Alto Paraná'},
                              {id:12, nombre:'Central'},{id:13, nombre:'Ñeembucú'},
                              {id:14, nombre:'Amambay'},{id:15, nombre:'Canindeyú'},
                              {id:16, nombre:'Presidente Hayes'}, {id:17, nombre:'Boquerón'},
                              {id:18, nombre:'Alto Paraguay'}, {id:19, nombre:'Capital'}];*/

public regionSanitariaOptions=[{id:1, nombre:'Concepción'},{id:2, nombre:'San Pedro'},
                              {id:3, nombre:'Cordillera'},
                              {id:4, nombre:'Guairá'}, {id:5, nombre:'Caaguazú'},
                              {id:6,nombre:'Caazapá'}, {id:7, nombre:'Itapúa'},
                              {id:8,nombre:'Misiones'},
                              {id:9, nombre:'Paraguarí'},{id:10, nombre:'Alto Paraná'},
                              {id:11, nombre:'Central'},{id:12, nombre:'Ñeembucú'},
                              {id:13, nombre:'Amambay'},{id:14, nombre:'Canindeyú'},
                              {id:15, nombre:'Presidente Hayes'}, {id:16, nombre:'Boquerón'},
                              {id:17, nombre:'Alto Paraguay'}, {id:18, nombre:'Capital'}];

regionesFiltradas: any[];
primerContactoId: number;
public sexoOptions=[{value:'M',label:'Masculino'},{value:'F',label:'Femenino'}];
public formCensoContactoList: any[];
public colsFormCensoContacto: any[];
showListFormCensoContacto: boolean = false;

showPopupBorrarFormCensoContacto: boolean = false;

formCensoContacto;

public username;
public usuarioId;
public usuarioDescr;
public distritosUsuario = [];
showDerivarCoordinador: boolean = false;
suspensionFormGroup: FormGroup;

public showReasignar: boolean = false;
public usersContactCenterList: any[];
public colsUsers;
public showConfirmarLiberar: boolean = false;

public showDerivarSupervisor: boolean = false;
public supervisoresContactCenterList: any[];

public idSupervisor;
public nombreSupervisor:string="";
public motivoDerivacion:string ="";
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
    this.usuarioId = usuario.id;

    this.usuarioDescr = usuario.nombre+" "+usuario.apellido;

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

    this.suspensionFormGroup = this.formBuilder.group({
      motivoSuspension: [null,Validators.required]
    });

    this.contactoFg = this.formBuilder.group({
      fechaContacto: [''],
      cedula: [''],
      nombre: [''],
      apellido: [''],
      fechaNacimiento: [''],
      telefono: ['', Validators.compose([Validators.required, Validators.minLength(9)])],
      direccion: [''],
      sexo: [''],
      regionSanitaria: [''],
      fechaExposicion: [''],
      catContagio:['']
      /*fechaInicioSintomas: ['', Validators.required],
      fechaCierreCaso: ['', Validators.required],*/
    });

    /*this._route.params.subscribe(params => {
      this.idPaciente = params["id"];
      this.cedulaPaciente = params["cedula"];
    });*/

    this.cols = [{ field: 'nroDocumento', header: 'Nro de Documento', width: '7%'},
        { field: 'nombre', header: 'Nombres', width: '9%' },
        { field: 'apellido', header: 'Apellidos', width: '10%' },
        { field: 'telefono', header: 'Teléfono', width: '8%' },
        { field: 'direccion', header: 'Dirección', width: '10%' },
        { field: 'regionSanitaria', header: 'Región Sanitaria', width: '9%' },
        { field: 'sexo', header: 'Sexo', width: '5%' },
        { field: 'fechaExposicion', header: 'Fecha de Exposición', width: '7%' },
        { field: 'categoriacontagio', header: 'Categoría de Contagio', width: '13%' },
        { field: 'motivoDerivacion', header: 'Motivo de Derivación', width: '11%' }];

    this.colsUsers = [{ field: 'cedula', header: 'Nro de Documento', width: '11%'},
        { field: 'nombre', header: 'Nombres', width: '15%' },
        { field: 'apellido', header: 'Apellidos', width: '15%' },
        { field: 'username', header: 'Username', width: '12%' }];
  }

  realizarLlamada(nroDocumento, id){
    this._router.navigate(["covid19/operador/primer-contacto/", nroDocumento, id]);
    //this._router.navigate(["covid19/operador/primer-contacto/", {state:{formCensoContacto: this.formCensoContacto}}]);
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
    //if($event.globalFilter){
    //this.buscarContactos();}
    this.buscarContactos();
  }

buscarContactos(){
  this.service.getDistritosUsuario(this.usuarioId).subscribe(distritos => {
    for (let i = 0; i < distritos.length; i++) {
      this.distritosUsuario.push(distritos[i].distritoId);
    }

    this.service.getPacientesFormCensoContacto(this.start, this.pageSize, this.filter, this.sortAsc, this.sortField, this.region, 
      this.usuarioId, null, this.distritosUsuario).subscribe(pacientes => {
        this.formCensoContactoList = pacientes.lista;
        this.totalRecords = pacientes.totalRecords;
        console.log(this.formCensoContactoList);
    }, error => {
      console.log(error);
      this.mensaje = error.error;
      this.openMessageDialog();
    });
  }, error => {
    console.log(error);
    this.mensaje = error.error;
    this.openMessageDialog();
  });
}

reservarRegistros(){
  this.service.getDistritosUsuario(this.usuarioId).subscribe(distritos => {
    for (let i = 0; i < distritos.length; i++) {
      this.distritosUsuario.push(distritos[i].distritoId);
      //let d = distritos[i];
      //this.distritosOptions[i] = {nombre: d.nomdist, value: d.coddist};
    }

    this.service.reservarRegistros(this.usuarioId, this.usuarioDescr).subscribe(distritos => {
      this.service.getPacientesFormCensoContacto(this.start, this.pageSize, this.filter, this.sortAsc, this.sortField, this.region, 
      this.usuarioId, null, this.distritosUsuario).subscribe(pacientes => {
        this.formCensoContactoList = pacientes.lista;
        this.totalRecords = pacientes.totalRecords;
        console.log(this.formCensoContactoList);
      });
    }, error => {
      console.log(error);
      this.mensaje = error.error;
      this.openMessageDialog();
    }
    );

  }, error => {
    console.log(error);
    this.mensaje = error.error;
    this.openMessageDialog();
  }
  );
}

confirmarLiberarLista(){
  this.showConfirmarLiberar = true;
}

liberarLista(){
  this.service.liberarRegistros(this.usuarioId).subscribe(registros => {
    this.formCensoContactoList =[];
    this.showConfirmarLiberar = false;
  }, error => {
    console.log(error);
    this.mensaje = error.error;
    this.openMessageDialog();
  }
  );
}

closePopupDerivar(){
  this.showDerivarCoordinador = false;
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

mostrarNuevoContacto(rowData){
  console.log(rowData);
  //this._router.navigate(['covid19/operador/nuevo-contacto',rowData.nroDocumento, rowData.nombre, rowData.apellido]);
  this.primerContactoId = rowData.id;
  this.showPopupNuevoContacto = true;

  this.contactoFg.controls.regionSanitaria.setValue({nombre:rowData.departamento});
}

guardarNuevoContacto(){
  let formCensoContacto = new FormCensoContacto();

  formCensoContacto.nroDocumento = this.contactoFg.controls.cedula.value;
  formCensoContacto.nombre = this.contactoFg.controls.nombre.value;
  formCensoContacto.apellido = this.contactoFg.controls.apellido.value;
  formCensoContacto.direccion = this.contactoFg.controls.direccion.value;
  formCensoContacto.telefono = this.contactoFg.controls.telefono.value;
  formCensoContacto.sexo = this.contactoFg.controls.sexo.value;
  formCensoContacto.regionSanitaria = this.contactoFg.controls.regionSanitaria.value.nombre;
  formCensoContacto.fechaExposicion = this.contactoFg.controls.fechaExposicion.value;
  formCensoContacto.categoriaContagio = this.contactoFg.controls.catContagio.value;
  formCensoContacto.censoContactoDistId = this.primerContactoId;

  this.service.guardarNuevoContacto(formCensoContacto).subscribe(response => {
    this.idRegistro = +response;
    //this._router.navigate(["covid19/carga-operador/datos-clinicos/",this.idRegistro]);
    this.loading = false;
    this.showPopupNuevoContacto = false;
    this.mensaje = "Contacto registrado exitosamente!";
    this.openMessageDialogExito();
      
  }, error => {
    console.log(error);
    this.loading = false;
    this.mensaje = error.error;
    this.openMessageDialog(); 
  }
  );
}

cerrarNuevoContacto(){
  this.showPopupNuevoContacto = false;
}

openMessageDialogExito() {
  setTimeout(function() { $("#modalExito").modal("toggle"); }, 1000);
}

/*mostrarListFormCensoContacto(rowData){
  this.showListFormCensoContacto = true;
  this.buscarFormCensoContacto(rowData.id);
}

buscarFormCensoContacto(primerContactoId){
  this.service.getPacientesFormCensoContacto(this.start, this.pageSize, this.filter, this.sortAsc, this.sortField, this.region, this.username, primerContactoId).subscribe(pacientes => {
    this.formCensoContactoList = pacientes.lista;
    this.totalRecords = pacientes.totalRecords;
    console.log(this.formCensoContactoList);
  });
}*/

closeListFormCensoContacto(){
  this.showListFormCensoContacto = false;
}

showBorrarFormCensoContacto(rowData){
  this.formCensoContacto = rowData;
  this.showPopupBorrarFormCensoContacto = true;
}

borrarFormCensoContacto(){
  this.service.borrarFormCensoContacto(this.formCensoContacto).subscribe(response => {
    this.idRegistro = +response;
    this.loading = false;
    this.showPopupBorrarFormCensoContacto = false;
    //this.buscarFormCensoContacto(this.formCensoContacto.primerContactoId)
    this.mensaje = "Contacto borrado exitosamente!";
    this.openMessageDialogExitoBorrado();
      
  }, error => {
    console.log(error);
    this.loading = false;
    this.mensaje = error.error;
    this.openMessageDialog(); 
  }
  );
}

closeBorrarFormCensoContacto(){
  this.showPopupBorrarFormCensoContacto = false;
}

openMessageDialogExitoBorrado() {
  setTimeout(function() { $("#modalExitoBorrado").modal("toggle"); }, 1000);
}

loadF($event: any) {
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
  //this.buscarFormCensoContacto(1);
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
      if(error.status == 401){
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

  hasRol(rolName: string)
  {
    let credentials=this.storageManager.getLoginData();
    if(credentials)
    {
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
    console.log(contacto.fechaUltimoContacto);
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

      this.buscarContactos();
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

      this.buscarContactos();
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

      this.buscarContactos();
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

  mostrarNoSeContacto(rowData){
    this.primerContacto = rowData;
    this.showNoSeContacto = true;
  }

  guardarNoSeContacto(){
    this.primerContacto.estadoPrimeraLlamada = this.motivosFormGroup.controls.motivoNoContacto.value;
    this.service.editarPrimerContacto(this.primerContacto).subscribe(response => {
      this.loading = false;
      this.mensaje= "Motivo guardado exitosamente.";
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
      this.buscarContactos();
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
      fechaCierreCaso: new FormControl(rowData.fechaCierreCaso, [
        Validators.required
      ]),
      nroDocumento: new FormControl(rowData.nroDocumento, [
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
      departamento: new FormControl(rowData.departamento, [
        Validators.required
      ]),
      distrito: new FormControl(rowData.distrito, [
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
    //console.log(row.id);
    this.primerContacto.nroDocumento = this.formGroup.controls.nroDocumento.value;
    this.primerContacto.nombre = this.formGroup.controls.nombre.value;
    this.primerContacto.apellido = this.formGroup.controls.apellido.value;
    this.primerContacto.distrito = this.formGroup.controls.distrito.value;
    this.primerContacto.departamento = this.formGroup.controls.departamento.value;
    this.primerContacto.telefono = this.formGroup.controls.telefono.value;
    this.primerContacto.hospitalizado = this.formGroup.controls.hospitalizado.value;
    this.primerContacto.fallecido = this.formGroup.controls.fallecido.value;
    this.primerContacto.tipoExposicion = this.formGroup.controls.tipoExposicion.value;
    this.primerContacto.fechaInicioSintomas = this.formGroup.controls.fechaInicioSintomas.value;
    this.primerContacto.fechaCierreCaso = this.formGroup.controls.fechaCierreCaso.value;
    //this.contactosList[row.id].actualizado = 'si';

    this.service.editarPrimerContacto(this.primerContacto).subscribe(response => {
        this.loading = false;
        this.mensaje= "Registro editado exitosamente.";
        this.edito = false;
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

  mostrarRegistroFinalizado(rowData){
    this.primerContacto = rowData;
    this.showRegistroFinalizado = true;
  }

  guardarRegistroFinalizado(){
    this.primerContacto.estadoPrimeraLlamada ="registro_finalizado";
    this.service.editarPrimerContacto(this.primerContacto).subscribe(response => {
      this.loading = false;
      this.mensaje= "Registro finalizado exitosamente.";
      this.buscarContactos();
      this.showRegistroFinalizado = false;
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

  closePopupRegistroFinalizado(){
    this.showLlamadaRealizada = false;
  }

  noAtiende(rowData){
    this.showNoAtiende = true;
    this.formCensoContacto = rowData;
  }

  guardarNoAtiende(){
    this.formCensoContacto.estadoPrimeraLlamada = this.motivosFormGroup.controls.motivoNoContacto.value;
    this.formCensoContacto.cantidadReintentos = this.formCensoContacto.cantidadReintentos + 1;
    this.formCensoContacto.fechaHoraActualizacion = new Date().toLocaleDateString();
    this.service.editarFormCensoContacto(this.formCensoContacto).subscribe(response => {
      this.loading = false;
      this.mensaje= "Motivo guardado exitosamente.";
      this.showNoAtiende = false;
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

  mostrarDerivarSupervisor(rowData){
    this.formCensoContacto = rowData;
    this.showDerivarSupervisor = true;
    this.service.getSupervisoresContactCenter(this.start, this.pageSize, this.filter, this.sortAsc, this.sortField).subscribe(supervisores => {
        this.supervisoresContactCenterList = supervisores.lista;
        this.totalRecords = supervisores.totalRecords;
        console.log(this.supervisoresContactCenterList);
      
    }, error => {
      console.log(error);
      this.mensaje = error.error;
      this.openMessageDialog();
    });
  }

  derivarSupervisor(idSupevisor, nombreSupervisor, apellidoSupervisor){
    this.idSupervisor = idSupevisor;
    this.nombreSupervisor = nombreSupervisor +' '+apellidoSupervisor;
    this.showDerivarCoordinador = true;
    this.motivoDerivacion="";
  }

  cerrarDerivarSupervisor(){
    this.showDerivarSupervisor = false;
  }

  mostrarReasignar(rowData){
    this.formCensoContacto = rowData;
    this.showReasignar = true;
    this.service.getUsuariosContactCenter(this.start, this.pageSize, this.filter, this.sortAsc, this.sortField).subscribe(usuarios => {
        this.usersContactCenterList = usuarios.lista;
        this.totalRecords = usuarios.totalRecords;
        console.log(this.usersContactCenterList);
      
    }, error => {
      console.log(error);
      this.mensaje = error.error;
      this.openMessageDialog();
    });
  }

  reasignar(idUsuario){
    this.formCensoContacto.usuarioActual = idUsuario;
    this.formCensoContacto.usuarioActualNombre = this.nombreSupervisor;
    this.formCensoContacto.motivoDerivacion = this.motivoDerivacion;
    this.service.editarFormCensoContacto(this.formCensoContacto).subscribe(response => {
      this.loading = false;
      this.mensaje= "Contacto Reasignado.";
      this.buscarContactos();
      this.showReasignar = false;
      this.openMessageDialog();
    }, error => {
      if(error.status == 401){
        this._router.navigate(["/"]);
      }
      else{
        this.loading = false;
        this.mensaje = error.error;
        this.openMessageDialog();
      }
    }
    );
  }

  cerrarReasignar(){
    this.showReasignar = false;
  }

  mostrarSuspenderContacto(rowData){
    this.formCensoContacto = rowData;
    this.showSuspenderContacto = true;
  }

  suspenderContacto(){
    this.formCensoContacto.estadoPrimeraLlamada ="suspendido";
    this.formCensoContacto.motivoDerivacion = this.suspensionFormGroup.controls.motivoSuspension.value;
    this.service.editarFormCensoContacto(this.formCensoContacto).subscribe(response => {
      this.loading = false;
      this.mensaje= "Contacto Suspendido.";
      this.buscarContactos();
      this.showSuspenderContacto = false;
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
    });
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
