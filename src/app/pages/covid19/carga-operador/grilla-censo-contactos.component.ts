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
import { FormCensoContacto } from "../model/formCensoContacto.model";
import { FichaPersonalBlanco } from "../model/fichaPersonalBlanco.model";
import { FormSeccionContactoContagio } from "../model/formSeccionContactoContagio.model";

declare var $: any;

@Component({
  selector: "grilla-censo-contactos",
  templateUrl: "./grilla-censo-contactos.component.html",
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
        :host ::ng-deep .row-accessories {
            background-color: rgba(0,0,0,.15) !important;
        }`
    ]
})
export class GrillaCensoContactosComponent implements OnInit {

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

  public origen: string;

  public idRegistro: number;
  public codigoVerif: string;

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

  public contactoOptions=[{value:'todos',label:'Todos'},{value:'llamada_realizada',label:'Llamada Realizada'}];
  public contactoOption="llamada_realizada";

  public catContagioOptions=[{value:'familiar_social',label:'Familiar'}, {value:'vecino',label:'Vecino'}, 
  {value:'companhero_trabajo',label:'Compañero de trabajo'}, {value:'companhero_estudio',label:'Compañero de estudio'}, 
  {value:'amigo',label:'Amigo'}];

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

public departamentoOptions=[{id:1, nombre:'CONCEPCIÓN'},{id:2, nombre:'SAN PEDRO'},
                              {id:3, nombre:'CORDILLERA'}, {id:4, nombre:'GUAIRÁ'},
                              {id:5, nombre:'CAAGUAZÚ'}, {id:6,nombre:'CAAZAPÁ'},
                              {id:7, nombre:'ITAPÚA'}, {id:8,nombre:'MISIONES'},
                              {id:9, nombre:'PARAGUARÍ'},{id:10, nombre:'ALTO PARANÁ'},
                              {id:11, nombre:'CENTRAL'},{id:12, nombre:'ÑEEMBUCÚ'},
                              {id:13, nombre:'AMAMBAY'},{id:14, nombre:'CANINDEYÚ'},
                              {id:15, nombre:'PRESIDENTE HAYES'}, {id:16, nombre:'BOQUERÓN'},
                              {id:17, nombre:'ALTO PARAGUAY'}, {id:18, nombre:'CAPITAL'}];

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

formCensoContacto: FormCensoContacto;

public username;
public usuarioId;
public nombreU;
public distritosUsuario = [];
public distritosFiltrados: any[];
public distritosOptions: any[];

public departamentosFiltrados: any[];
public rowId;
public fichaPersonalBlanco: FichaPersonalBlanco;

pageSizeF: number = 5;
startF: number = 0;
filterF: string;
totalRecordsF: number = 0;
sortAscF: boolean = true;
sortFieldF: string;

scrollableCols: any[];
frozenCols: any[];

esLiderReg: boolean = false;

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
    this.esLiderReg = this.hasRol("Lider Regional");
    this.region = usuario.regionSanitaria;
    this.username = usuario.username;
    this.usuarioId = usuario.id;
    this.nombreU = usuario.nombre+" "+usuario.apellido;

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

    this.contactoFg = this.formBuilder.group({
      fechaContacto: [''],
      cedula: ['', Validators.required],
      nombre: ['',Validators.required],
      apellido: ['',Validators.required],
      fechaNacimiento: [''],
      telefono: ['', Validators.compose([Validators.required, Validators.minLength(9)])],
      direccion: [''],
      sexo: [''],
      regionSanitaria: [''],
      fechaExposicion: [''],
      catContagio:[''],
      institucion:[''],
      distrito:[]
      /*fechaInicioSintomas: ['', Validators.required],
      fechaCierreCaso: ['', Validators.required],*/
    });
    /*this._route.params.subscribe(params => {
      this.idPaciente = params["id"];
      this.cedulaPaciente = params["cedula"];
    });*/

    this.scrollableCols = [{ field: 'fechaCierreCaso', header: 'Fecha de Cierre', width: '6%' },
        { field: 'nroDocumento', header: 'Nro de Documento', width: '8%'},
        { field: 'nombres', header: 'Nombres', width: '11%' },
        { field: 'apellidos', header: 'Apellidos', width: '11%' },
        { field: 'telefono', header: 'Teléfono', width: '8%' },
        { field: 'departamento', header: 'Departamento', width: '8%' },
        //{ field: 'distrito', header: 'Distrito', width: '8%' },
        { field: 'hospitalizado', header: 'Internado', width: '8%' },
        { field: 'fallecido', header: 'Fallecido', width: '6%' },
        { field: 'personalBlanco', header: 'Personal de Blanco', width: '9%' },
        { field: 'fechaInicioSintomas', header: 'Fecha Inicio de Síntomas', width: '8%' },
        { field: 'estadoLlamadaCensoContacto', header: 'Estado de Llamada', width: '11%' },
        { field: 'cantidadContactos', header: 'Cantidad Contactos', width: '6%' },
        { field: 'loginOperador', header: 'Operador Asignado', width: '8%' }];
        //{ field: '', header: 'Acciones', width: '15%' }];

    this.frozenCols = [{ field: 'acc', header: 'Acciones'}];

    
    this.colsFormCensoContacto = [{ field: 'nroDocumento', header: 'Nro de Documento', width: '7%'},
        { field: 'nombres', header: 'Nombres', width: '10%' },
        { field: 'apellidos', header: 'Apellidos', width: '10%' },
        { field: 'telefono', header: 'Teléfono', width: '8%' },
        { field: 'direccion', header: 'Dirección', width: '11%' },
        { field: 'regionSanitaria', header: 'Región Sanitaria', width: '10%' },
        { field: 'distrito', header: 'Distrito', width: '10%' },
        { field: 'sexo', header: 'Sexo', width: '6%' },
        { field: 'fechaExposicion', header: 'Fecha de Exposición', width: '8%' },
        { field: 'categoriacontagio', header: 'Categoría de Contagio', width: '12%' }];
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
    this.buscarContactos('llamada_realizada');
  }

buscarContactos(opcionFiltro){
  this.service.getDistritosUsuario(this.usuarioId).subscribe(distritos => {
    for (let i = 0; i < distritos.length; i++) {
      this.distritosUsuario.push(distritos[i].distritoId);
      //let d = distritos[i];
      //this.distritosOptions[i] = {nombre: d.nomdist, value: d.coddist};
    }

    this.service.getPacientesCensoContacto(this.start, this.pageSize, this.filter, this.sortAsc, this.sortField, this.region, 
      this.distritosUsuario, opcionFiltro, this.usuarioId, this.esLiderReg).subscribe(pacientes => {
      this.pacientesList = pacientes.lista;
      this.totalRecords = pacientes.totalRecords;
      console.log(this.pacientesList);
      
    });
  }, error => {
    console.log(error);
    this.mensaje = error.error;
    this.openMessageDialog();
  }
  );
}

getCensoContactosXls(opcionFiltro){
    this.loading = true;
    this.service.getCensoContactosXls(0, 0, this.filter, this.sortAsc, this.sortField, this.region, this.distritosUsuario, 
      opcionFiltro,this.usuarioId, this.esLiderReg);
    /*this.service.getPacientesPrimerContacto(0, 0, this.filter, this.sortAsc, this.sortField, this.region, 
      this.distritosUsuario, opcionFiltro, this.usuarioId, this.esLiderReg).subscribe(pacientes => {
        this.pacientesList = pacientes.lista;
        //this.exportXlsFormateado(this.pacientesList);
    });*/
    this.loading = false;
}

asignarmeContacto(rowData){
  this.primerContacto = rowData;
  //this.primerContacto.operadorAsignado =this.usuarioId;
  this.primerContacto.operadorContactCenter =this.usuarioId;
  this.primerContacto.operadorContactCenterNombre =this.nombreU;
    this.service.editarPrimerContacto(this.primerContacto).subscribe(response => {
      this.loading = false;
      this.mensaje= "Contacto asignado exitosamente.";
      this.buscarContactos(this.contactoOption);
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
    });
}

desasignarmeContacto(rowData){
  this.primerContacto = rowData;
  //this.primerContacto.operadorAsignado = null;
  this.primerContacto.operadorContactCenter = null;
  this.primerContacto.operadorContactCenterNombre = null;
    this.service.editarPrimerContacto(this.primerContacto).subscribe(response => {
      this.loading = false;
      this.mensaje= "Contacto liberado exitosamente.";
      this.buscarContactos(this.contactoOption);
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
      this.service.getIdentificacionesByNumeroDocumento(nroDocumento.trim()).subscribe(response => {
          this.loading = false;
          if(response.obtenerPersonaPorNroCedulaResponse.return.error){
            this.fallaSII = true;
            this.mensaje = response.obtenerPersonaPorNroCedulaResponse.return.error;
            this.openMessageDialog();
          }
          else{
            this.contactoFg.controls.nombre.setValue(response.obtenerPersonaPorNroCedulaResponse.return.nombres);
            this.contactoFg.controls.apellido.setValue(response.obtenerPersonaPorNroCedulaResponse.return.apellido);
            this.contactoFg.controls.sexo.setValue(response.obtenerPersonaPorNroCedulaResponse.return.sexo);
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

selectDepto(event){
  this.contactoFg.controls.distrito.setValue(null);
  let coddpto ="";
  if(event.id < 10){
    coddpto = '0'+event.id;
  }else{
    coddpto = event.id;
  }
  
  this.service.getDistritosDepto(coddpto).subscribe(distritos => {
    this.distritosOptions = distritos;
    for (let i = 0; i < distritos.length; i++) {
      let d = distritos[i];
      this.distritosOptions[i] = { nombre: d.nomdist, valor: d.coddist };
    }
       
  }, error => {
    console.log(error);
    this.mensaje = error.error;
    this.openMessageDialog();
  }
  );
}

onRowEditInit(rowData) {
  this.rowId = rowData.id;
  this.edito = true;
  this.formCensoContacto = rowData;

  this.formGroup = new FormGroup({
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
    direccion: new FormControl(rowData.direccion, [
      Validators.required
    ]),
    regionSanitaria: new FormControl({nombre:rowData.regionSanitaria}, [
      Validators.required
    ]),
    distrito: new FormControl({nombre:rowData.distrito}, [
      Validators.required
    ]),
    sexo: new FormControl(rowData.sexo, [
      Validators.required
    ]),
    fechaExposicion: new FormControl(rowData.fechaExposicion, [
      Validators.required
    ]),
    categoriaContagio: new FormControl(rowData.categoriaContagio, [
      Validators.required
    ])
  });

  let coddpto ="";
    if(rowData.regionSanitariaId < 10){
      coddpto = '0'+rowData.regionSanitariaId;
    }else{
      coddpto = rowData.regionSanitariaId;
    }

    this.service.getDistritosDepto(coddpto).subscribe(distritos => {
      this.distritosOptions = distritos;
      for (let i = 0; i < distritos.length; i++) {
        let d = distritos[i];
        this.distritosOptions[i] = { nombre: d.nomdist, valor: d.coddist };
      }
         
    }, error => {
      console.log(error);
      this.mensaje = error.error;
      this.openMessageDialog();
    }
    );
}

onRowEditSave(rowData){
  //console.log(row.id);
  this.formCensoContacto.nroDocumento = this.formGroup.controls.nroDocumento.value;
  this.formCensoContacto.nombre = this.formGroup.controls.nombre.value;
  this.formCensoContacto.apellido = this.formGroup.controls.apellido.value;
  this.formCensoContacto.telefono = this.formGroup.controls.telefono.value;
  this.formCensoContacto.direccion = this.formGroup.controls.direccion.value;

  this.formCensoContacto.regionSanitariaId = this.formGroup.controls.regionSanitaria.value.id;
  this.formCensoContacto.regionSanitaria = this.formGroup.controls.regionSanitaria.value.nombre;
  this.formCensoContacto.distritoId = this.formGroup.controls.distrito.value.valor;
  this.formCensoContacto.distrito = this.formGroup.controls.distrito.value.nombre;
  
  this.formCensoContacto.sexo = this.formGroup.controls.sexo.value;
  this.formCensoContacto.categoriaContagio = this.formGroup.controls.categoriaContagio.value;
  this.formCensoContacto.fechaExposicion = this.formGroup.controls.fechaExposicion.value;
  //this.contactosList[row.id].actualizado = 'si';

  this.service.editarFormCensoContacto(this.formCensoContacto).subscribe(response => {
      this.loading = false;
      this.mensaje= "Registro editado exitosamente.";
      this.edito = false;
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

onRowEditCancel(){
  this.edito = false;
}

mostrarListFormCensoContacto(rowData){
  //console.log(rowData.id);
  this.showListFormCensoContacto = true;
  this.primerContactoId = rowData.id;
  this.primerContacto = rowData;
  this.buscarFormCensoContacto(this.primerContactoId);
}

buscarFormCensoContacto(primerContactoId){
  this.service.getContactosFormCensoContacto(this.startF, this.pageSizeF, this.filterF, this.sortAscF, this.sortFieldF, 
    this.usuarioId, primerContactoId).subscribe(pacientes => {
    this.formCensoContactoList = pacientes.lista;
    this.totalRecordsF = pacientes.totalRecords;
    console.log(this.formCensoContactoList);
  });
}

mostrarNuevoContacto(){
  //console.log(rowData);
  //this.primerContactoId = rowData.id;
  this.showPopupNuevoContacto = true;

  //this.contactoFg.controls.regionSanitaria.setValue({nombre:rowData.departamento});
  //this.contactoFg.controls.distrito.setValue({nombre:rowData.distrito});
  this.contactoFg.controls.regionSanitaria.setValue({nombre:this.primerContacto.departamento});
  this.contactoFg.controls.distrito.setValue({nombre:this.primerContacto.distrito});

  let coddpto ="";
  /*if(rowData.departamentoId < 10){
    coddpto = '0'+rowData.departamentoId;
  }else{
    coddpto = rowData.departamentoId;
  }*/
  if(this.primerContacto.departamentoId < 10){
    coddpto = '0'+this.primerContacto.departamentoId;
  }else{
    coddpto = this.primerContacto.departamentoId+'';
  }

  this.service.getDistritosDepto(coddpto).subscribe(distritos => {
    this.distritosOptions = distritos;
    for (let i = 0; i < distritos.length; i++) {
      let d = distritos[i];
      this.distritosOptions[i] = { nombre: d.nomdist, valor: d.coddist };
    }
       
  }, error => {
    console.log(error);
    this.mensaje = error.error;
    this.openMessageDialog();
  }
  );
}

guardarNuevoContacto(){
  let formCensoContacto = new FormCensoContacto();

  formCensoContacto.nroDocumento = this.contactoFg.controls.cedula.value;
  formCensoContacto.nombre = this.contactoFg.controls.nombre.value;
  formCensoContacto.apellido = this.contactoFg.controls.apellido.value;
  formCensoContacto.direccion = this.contactoFg.controls.direccion.value;
  formCensoContacto.telefono = this.contactoFg.controls.telefono.value;
  formCensoContacto.sexo = this.contactoFg.controls.sexo.value;
  
  formCensoContacto.fechaExposicion = this.contactoFg.controls.fechaExposicion.value;
  formCensoContacto.categoriaContagio = this.contactoFg.controls.catContagio.value;
  formCensoContacto.primerContactoId = this.primerContactoId;

  formCensoContacto.regionSanitariaId = this.contactoFg.controls.regionSanitaria.value.valor;
  formCensoContacto.regionSanitaria = this.contactoFg.controls.regionSanitaria.value.nombre;
  formCensoContacto.distritoId = this.contactoFg.controls.distrito.value.valor;
  formCensoContacto.distrito = this.contactoFg.controls.distrito.value.nombre;
  formCensoContacto.institucion = this.contactoFg.controls.institucion.value;

  formCensoContacto.usuarioActual = this.usuarioId;
  formCensoContacto.usuarioActualNombre = this.nombreU;

  //Crear paciente
  /*this.fichaPersonalBlanco = new FichaPersonalBlanco();
  this.fichaPersonalBlanco.formSeccionDatosBasicos = new FormDatosBasicos();
  this.fichaPersonalBlanco.formSeccionDatosBasicos.tipoDocumento = "Cédula de Identidad";
  this.fichaPersonalBlanco.formSeccionDatosBasicos.numeroDocumento = this.contactoFg.controls.cedula.value;
  this.fichaPersonalBlanco.formSeccionDatosBasicos.nombre = this.contactoFg.controls.nombre.value;
  this.fichaPersonalBlanco.formSeccionDatosBasicos.apellido = this.contactoFg.controls.apellido.value;
  this.fichaPersonalBlanco.formSeccionDatosBasicos.direccionDomicilio = this.contactoFg.controls.direccion.value;
  this.fichaPersonalBlanco.formSeccionDatosBasicos.numeroCelular = this.contactoFg.controls.telefono.value;
  this.fichaPersonalBlanco.formSeccionDatosBasicos.sexo = this.contactoFg.controls.sexo.value;
  this.fichaPersonalBlanco.formSeccionContactoContagio = new FormSeccionContactoContagio();
  this.fichaPersonalBlanco.formSeccionContactoContagio.fechaExposicion = this.contactoFg.controls.fechaExposicion.value;
  this.fichaPersonalBlanco.formSeccionContactoContagio.categoriaContagio = this.contactoFg.controls.catContagio.value;
  this.fichaPersonalBlanco.formSeccionPersonalBlanco =new FormSeccionPersonalBlanco();
  this.fichaPersonalBlanco.formSeccionPersonalBlanco.regionSanitaria = this.contactoFg.controls.regionSanitaria.value.nombre;*/

  this.service.guardarNuevoContacto(formCensoContacto).subscribe(response => {
    this.idRegistro = +response;
    //this._router.navigate(["covid19/carga-operador/datos-clinicos/",this.idRegistro]);
    this.loading = false;
    this.showPopupNuevoContacto = false;

    this.contactoFg.controls.cedula.setValue("");
    this.contactoFg.controls.nombre.setValue("");
    this.contactoFg.controls.apellido.setValue("");
    this.contactoFg.controls.direccion.setValue("");
    this.contactoFg.controls.telefono.setValue("");
    this.contactoFg.controls.institucion.setValue("");
    this.contactoFg.controls.sexo.setValue(null);
    this.contactoFg.controls.fechaExposicion.setValue(null);
    this.contactoFg.controls.catContagio.setValue(null);

    this.mensaje = "Contacto registrado exitosamente!";
    this.openMessageDialogExito();
    this.buscarFormCensoContacto(formCensoContacto.primerContactoId);
      
  }, error => {
    //console.log(error);
    this.loading = false;
    if(error.status == 401){
        this._router.navigate(["/"]);
    }else{
      this.mensaje = error.error;
      this.openMessageDialog(); 
    }
  }
  );
}

filtrarDistrito(event) {
  let filtered : any[] = [];
  let query = event.query;
  for(let i = 0; i < this.distritosOptions.length; i++) {
      let distrito = this.distritosOptions[i];

      if (distrito.nombre.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
        filtered.push(distrito);
      }
  }
  
  this.distritosFiltrados = filtered;
}

cerrarNuevoContacto(){
  this.contactoFg.controls.cedula.setValue(null);
  this.contactoFg.controls.nombre.setValue(null);
  this.contactoFg.controls.apellido.setValue(null);
  this.contactoFg.controls.sexo.setValue(null);
  this.contactoFg.controls.direccion.setValue(null);
  this.contactoFg.controls.telefono.setValue(null);
  this.showPopupNuevoContacto = false;
}

openMessageDialogExito() {
  setTimeout(function() { $("#modalExito").modal("toggle"); }, 1000);
}

loadF($event: any) {
  if ($event) {
    this.filterF = $event.globalFilter;
    this.startF = $event.first;
    this.pageSizeF = $event.rows;
    this.sortFieldF = $event.sortField;

    if ($event.sortOrder == 1)
      this.sortAscF = true;
    else
      this.sortAscF = false;
  }
  this.buscarFormCensoContacto(this.primerContactoId);
}

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
    this.buscarFormCensoContacto(this.formCensoContacto.primerContactoId)
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
      for(let rol of credentials.usuario.rols){
        if(rol.nombre==rolName){
          return true;
        }
      }
      return false;
    }
    else{
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

  mostrarNoSeContacto(rowData){
    this.primerContacto = rowData;
    this.showNoSeContacto = true;
  }

  guardarNoSeContacto(){
    this.primerContacto.estadoLlamadaCensoContacto = this.motivosFormGroup.controls.motivoNoContacto.value;
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

  mostrarRegistroFinalizado(rowData){
    this.primerContacto = rowData;
    this.showRegistroFinalizado = true;
  }

  guardarRegistroFinalizado(){
    this.primerContacto.estadoPrimeraLlamada ="registro_finalizado";
    this.service.editarPrimerContacto(this.primerContacto).subscribe(response => {
      this.loading = false;
      this.mensaje= "Registro finalizado exitosamente.";
      this.buscarContactos(this.contactoOption);
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
