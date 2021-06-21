import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import {getLocaleDateTimeFormat, Location} from '@angular/common';
import { Subscription } from 'rxjs';
import { Covid19Service } from '../../../services/Covid19Service';

import {FormDatosBasicos} from '../model/formDatosBasicos.model';

import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';

import { StorageManagerService } from '../../login/shared/storage-manager.service';
import { CensoContacto } from "../model/censoContacto.model";
import { Paciente } from "../model/paciente.model";
import { PrimerContacto } from "../model/primerContacto.model";

declare var $: any;

import * as FileSaver from 'file-saver';
import * as Excel from "exceljs";

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

  public motivos=[{value:'no_atiende',label:'No Atiende'},{value:'apagado',label:'Apagado/Sin Señal'},{value:'equivocado',label:'Número Equivocado'}, 
  {value:'no_brinda_informacion',label:'No brinda información'}, {value:'sin_numero',label:'Sin número de teléfono'}];
  public binarioOptions=[{value:'SI',label:'SI'},{value:'NO',label:'NO'}];

  public exposicionOptions=[{value:'CONTACTO',label:'CONTACTO'}, {value:'SIN NEXO',label:'SIN NEXO'},
  {value:'VIAJERO',label:'VIAJERO'},{value:'PRE-QUIRURGICO',label:'PRE-QUIRURGICO'}];

  public albergueOptions=[{value:'COMUNIDAD',label:'COMUNIDAD'},{value:'ALBERGUE',label:'ALBERGUE'}];
  public sintomasOptions=[{value:'SINTOMATICO',label:'SINTOMÁTICO'},{value:'ASINTOMATICO',label:'ASINTOMÁTICO'}];
  public perBlancoOptions=[{value:'SI_SI',label:'Si.En Servicio'},{value:'NO_NO',label:'No'},{value:'SI_NO',label:'Si.No está en Servicio'},
  {value:'SI_SD',label:'Si.Sin datos de Servicio'},{value:'NO_SD',label:'No.Sin datos de Servicio'},{value:'SD_SD',label:'Se Desconoce'}];

  pacientesList: any[];
  formGroup: FormGroup;
  comentariosFormGroup: FormGroup;
  motivosFormGroup: FormGroup;
  llamadaFormGroup: FormGroup;
  showLlamadaRealizada: boolean = false;
  primerContacto: PrimerContacto;

  edito: boolean = false;

  fallaSII: boolean = false;

  public contactoOptions=[{value:'todos',label:'Todos'},{value:'pendientes',label:'Pendientes'}];
  public contactoOption="pendientes";

  public departamentoOptions=[{id:1, nombre:'CONCEPCION'},{id:2, nombre:'SAN PEDRO'},
                              {id:3, nombre:'CORDILLERA'}, {id:4, nombre:'GUAIRÁ'},
                              {id:5, nombre:'CAAGUAZÚ'}, {id:6,nombre:'CAAZAPÁ'},
                              {id:7, nombre:'ITAPÚA'}, {id:8,nombre:'MISIONES'},
                              {id:9, nombre:'PARAGUARI'},{id:10, nombre:'ALTO PARANÁ'},
                              {id:11, nombre:'CENTRAL'},{id:12, nombre:'ÑEEMBUCÚ'},
                              {id:13, nombre:'AMAMBAY'},{id:14, nombre:'CANINDEYÚ'},
                              {id:15, nombre:'PRESIDENTE HAYES'}, {id:16, nombre:'BOQUERÓN'},
                              {id:17, nombre:'ALTO PARAGUAY'}, {id:18, nombre:'ASUNCION'}];
  public departamentosFiltrados: any[];

  public historicoComentarios=[];

  region: string;
  public username;
  public usuarioId;

  frozenCols: any[];

  public distritosOptions: any[];
  public distritosFiltrados: any[];
  public barriosOptions: any[];
  public barriosFiltrados: any[];
  public distritosUsuario = [];
  public rowId;

  esLiderReg: boolean = false;

  esOpAvanzado: boolean = false;
  filterFormGroup: FormGroup;

  codDepto;

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
    this.hoy = new Date();

    const {usuario} = this.storageManager.getLoginData();
    this.esLiderReg = this.hasRol("Lider Regional");
    this.esOpAvanzado = this.hasRol("Operador UER Avanzado");
    this.region = usuario.regionSanitaria;
    this.username = usuario.username;
    this.usuarioId = usuario.id;

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
        { field: 'barrio', header: 'Barrio'},
        { field: 'direccion', header: 'Dirección'},
        { field: 'referencia', header: 'Referencia'},
        { field: 'casaNumero', header: 'Nro de Casa'},
        { field: 'hospitalizado', header: 'Internado'},
        { field: 'fallecido', header: 'Fallecido'},
        { field: 'tipoExposicion', header: 'Tipo de Exposición'},
        { field: 'tieneSintomas', header: 'Sintomático/Asintomático'},
        { field: 'fechaInicioSintomas', header: 'Fecha de Inicio de Síntomas'},
        { field: 'lugarCuarentena', header: 'Comunidad/Albergue'},
        { field: 'estadoPrimeraLlamada', header: 'Estado de Llamada'}];

        this.frozenCols = [
          { field: 'acc', header: 'Acciones'}
        ];
  	this.filterFormGroup= this.formBuilder.group({
      region: [null],
      distrito: [null],
      barrio: [null],
      fechaCierre: [null],
      codigoPaciente: [null],
    }); 
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
    this.service.getDistritosUsuario(this.usuarioId).subscribe(distritos => {
      for (let i = 0; i < distritos.length; i++) {
        this.distritosUsuario.push(distritos[i].distritoId);
        //console.log(this.distritosUsuario);
        //let d = distritos[i];
        //this.distritosOptions[i] = {nombre: d.nomdist, value: d.coddist};
      }
      this.service.getPacientesPrimerContacto(this.start, this.pageSize, this.filter, this.sortAsc, this.sortField, this.region, 
        this.distritosUsuario, opcionFiltro, this.usuarioId, this.esLiderReg, this.esOpAvanzado, this.filterFormGroup.controls.region.value, 
        this.filterFormGroup.controls.distrito.value, this.filterFormGroup.controls.barrio.value, this.filterFormGroup.controls.fechaCierre.value, this.filterFormGroup.controls.codigoPaciente.value,null).subscribe(pacientes => {
        this.pacientesList = pacientes.lista;
        this.totalRecords = pacientes.totalRecords;
        console.log(this.pacientesList);
      });

    }, error => {
      console.log(error);
      if(error.status == 401){
          this._router.navigate(["/"]);
      }else{
        this.mensaje = error.error;
        this.openMessageDialog();
      }
    }
    );

    /*this.service.getPacientesPrimerContacto(this.start, this.pageSize, this.filter, this.sortAsc, this.sortField, this.region, 
                                            this.distritosUsuario, opcionFiltro, this.username).subscribe(pacientes => {
      this.pacientesList = pacientes.lista;
      this.totalRecords = pacientes.totalRecords;
      console.log(this.pacientesList);
    });*/
  }

  anularFechaSintomas(event){
    console.log(event);
    if(event.value=='ASINTOMATICO'){
      this.formGroup.controls.fechaInicioSintomas.setValue(null);
    }
  }

  selectDepto(event){
    this.formGroup.controls.distrito.setValue(null);
    this.formGroup.controls.barrio.setValue(null);
    let coddpto ="";
    this.codDepto="";

    console.log(event.id);
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

    if(event.id ===18){
      coddpto = '00';
    }

    this.codDepto = coddpto;

    /*this.service.getBarriosDepto(coddpto).subscribe(barrios => {
      this.barriosOptions = barrios;
      for (let i = 0; i < barrios.length; i++) {
        let d = barrios[i];
        this.barriosOptions[i] = { nombre: d.nombarrio, valor: d.codbarrio };
      }
    }, error => {
      console.log(error);
      this.mensaje = error.error;
      this.openMessageDialog();
    });*/
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

  eligeDistrito(event){
    console.log(event);

    this.service.getBarriosCiudad(this.codDepto, event.valor).subscribe(barrios => {
      this.barriosOptions = barrios;
      for (let i = 0; i < barrios.length; i++) {
        let d = barrios[i];
        this.barriosOptions[i] = { nombre: d.nombarrio, valor: d.codbarrio };
      }
    }, error => {
      console.log(error);
      this.mensaje = error.error;
      this.openMessageDialog();
    }
    );
  }

  filtrarBarrio(event){
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

  eligeBarrio(event){
    console.log(event);
  }

  getContactosXls(opcionFiltro){
    /*if(this.filter == null){
      this.mensaje = 'Debe filtrar por algún campo como por ejemplo por Fecha de Cierre.';
      this.openMessageDialog();
    }else{*/
      this.loading = true;
      this.service.getPrimerContactoXls(0, 0, this.filter, this.sortAsc, this.sortField, this.region, this.distritosUsuario, opcionFiltro, 
        this.usuarioId, this.esLiderReg, this.esOpAvanzado, this.filterFormGroup.controls.region.value, this.filterFormGroup.controls.distrito.value, this.filterFormGroup.controls.barrio.value, this.filterFormGroup.controls.fechaCierre.value);
      /*this.service.getPacientesPrimerContacto(0, 0, this.filter, this.sortAsc, this.sortField, this.region, 
        this.distritosUsuario, opcionFiltro, this.usuarioId, this.esLiderReg).subscribe(pacientes => {
          this.pacientesList = pacientes.lista;
          //this.exportXlsFormateado(this.pacientesList);
      });*/
      this.loading = false;
    //}
  }

  exportXlsFormateado(pacientes){
    let workbook = new Excel.Workbook();
    let worksheet = workbook.addWorksheet('Pacientes');

    worksheet.addRow(['LISTA DE PRIMERA LLAMADA']);
    worksheet.addRow(['FECHA DE GENERACIÓN:', new Date().toLocaleString()]);
    worksheet.getRow(1).font = { name: 'Arial Black', family: 4, size: 14, bold: true };

    worksheet.properties.defaultColWidth = 25;
    //worksheet.getColumn(1).width = 25;

    let header=["FECHA DE CIERRE", "NRO DE DOCUMENTO", "CÓDIGO DE PACIENTE", "NOMBRE", "APELLIDO", "TELÉFONO", "DEPARTAMENTO", "DISTRITO", "BARRIO", "DIRECCION",
    "REFERENCIA","NRO DE CASA", "INTERNADO", "FALLECIDO", "TIPO DE EXPOSICIÓN","SINTOMATICO/ASINTOMATICO", "FECHA DE INICIO DE SÍNTOMAS", "COMUNIDAD/ALBERGUE", "ESTADO DE PRIMERA LLAMADA", "LLAMADOR ASIGNADO", "COMENTARIOS"];
    worksheet.addRow(header);
    worksheet.getRow(3).fill = {type:'pattern', pattern: 'solid', fgColor: {argb:'00000000'}}
    worksheet.getRow(3).font = { color:{argb:'FFFFFFFF'}, name: 'Arial Black', family: 4, size: 11, bold: true };

    let filaNro = 4;
    for(let p of pacientes) {
        /*let fallecido = 'NO';
        if(p.fallecido)
          fallecido = 'SI';
        let internado = 'NO';
        if(p.hospitalizado)
          internado = 'SI';*/

      worksheet.addRow([p.fechaCierreCaso, p.nroDocumento, p.codigoPaciente, p.nombre != null ? p.nombre.toUpperCase(): p.nombre, p.apellido != null ? p.apellido.toUpperCase(): p.apellido, p.telefono, p.departamento, 
      p.distrito != null ? p.distrito.toUpperCase(): p.distrito, p.barrio, p.direccion, p.referencia, p.casaNumero, p.hospitalizado, p.fallecido, p.tipoExposicion, p.sintomaticoAsintomatico, p.fechaInicioSintomas, p.comunidadAlbergue, p.estadoPrimeraLlamada != null ? p.estadoPrimeraLlamada.toUpperCase(): p.estadoPrimeraLlamada,
      p.loginOperador, p.comentarios]);

      worksheet.getRow(filaNro).border = {
        top: { style:'double', color: {argb:'00000000'}},
        left: { style:'double', color: {argb:'00000000'}},
        bottom: { style:'double', color: {argb:'00000000'}},
        right: { style:'double', color: {argb:'00000000'}}
      }

      filaNro++;
    }

  workbook.xlsx.writeBuffer().then((data) => {
    let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    FileSaver.saveAs(blob, "lista_primera_llamada"+'-'+new Date().valueOf()+'.xlsx');

  });

  this.loading = false;
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
    let dateParts = contacto.fechaUltimoContacto.split("-");
    let fechaContactoString = dateParts[2]+"/"+dateParts[1]+"/"+dateParts[0]
    //console.log(fechaContactoString);
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
    let fecha = new Date().toLocaleString();
    //let mes = fecha.getMonth()+1;
    if(this.primerContacto.comentarios !== null){
      //this.primerContacto.comentarios = fecha.getDate()+'/'+mes+'/'+fecha.getFullYear()+' - '+this.username+' - '+this.comentariosFormGroup.controls.comentarios.value+' | '+this.primerContacto.comentarios;
      this.primerContacto.comentarios = fecha+' - '+this.username+' - '+this.comentariosFormGroup.controls.comentarios.value+' | '+this.primerContacto.comentarios;
    }else{
      //this.primerContacto.comentarios = fecha.getDate()+'/'+mes+'/'+fecha.getFullYear()+' - '+this.username+' - '+this.comentariosFormGroup.controls.comentarios.value;
      this.primerContacto.comentarios = fecha+' - '+this.username+' - '+this.comentariosFormGroup.controls.comentarios.value;
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
    let fecha = new Date().toLocaleString();
    if(this.primerContacto.comentarios !== null){
      this.primerContacto.comentarios = fecha+' - '+this.username+' - '+this.motivosFormGroup.controls.motivoNoContacto.value+' | '+this.primerContacto.comentarios;
    }else{
      this.primerContacto.comentarios = fecha+' - '+this.username+' - '+this.motivosFormGroup.controls.motivoNoContacto.value;
    }
    
    this.primerContacto.cantidadReintentos++;
    this.service.realizarLlamadaPrimerContacto(this.primerContacto).subscribe(response => {
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
    let fecha = new Date();
    let mes = fecha.getMonth()+1;
    this.primerContacto.estadoPrimeraLlamada ="llamada_realizada";

    this.primerContacto.cantidadReintentos +=1;

    if(this.primerContacto.comentarios !== null){
      this.primerContacto.comentarios += fecha.getDate()+'/'+mes+'/'+fecha.getFullYear()+' - '+this.username+' - '+'Llamada realizada';
    }else{
      this.primerContacto.comentarios = fecha.getDate()+'/'+mes+'/'+fecha.getFullYear()+' - '+this.username+' - '+'Llamada realizada';
    }
    //this.primerContacto.fechaUltimaLlamada = new Date().toLocaleString();
    this.service.realizarLlamadaPrimerContacto(this.primerContacto).subscribe(response => {
      this.loading = false;
      this.mensaje= "Estado de la llamada guardado exitosamente.";
      this.buscarContactos(this.contactoOption);
      this.showLlamadaRealizada = false;
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

  closePopupLlamadaRealizada(){
    this.showLlamadaRealizada = false;
  }

  onRowEditInit(rowData) {
    this.rowId = rowData.id;
    this.edito = true;
    this.primerContacto = null;
    this.primerContacto = rowData;

    this.formGroup = new FormGroup({
      /*fechaCierreCaso: new FormControl(rowData.fechaCierreCaso, [
        Validators.required
      ]),
      fechaUltimaLlamada: new FormControl(rowData.fechaUltimaLlamada, [
        Validators.required
      ])
      nroDocumento: new FormControl(rowData.nroDocumento, [
        Validators.required
      ]),
       nombre: new FormControl(rowData.nombre, [
        Validators.required
      ]),
      apellido: new FormControl(rowData.apellido, [
        Validators.required
      ]),
      codigoPaciente: new FormControl(rowData.codigoPaciente, [
        Validators.required
      ]),*/
      telefono: new FormControl(rowData.telefono),
      telefonoContacto: new FormControl(rowData.telefonoContacto),
      departamento: new FormControl({nombre:rowData.departamento, id: rowData.departamentoId}, [
        Validators.required
      ]),
      distrito: new FormControl({nombre:rowData.distrito, valor: rowData.distritoId}, [
        Validators.required
      ]),
      barrio: new FormControl({nombre:rowData.barrio, valor: rowData.barrioId}),
      direccion: new FormControl(rowData.direccion),
      referencia: new FormControl(rowData.referencia),
      casaNumero: new FormControl(rowData.casaNumero),
      hospitalizado: new FormControl(rowData.hospitalizado),
      fallecido: new FormControl(rowData.fallecido),
      personalBlanco: new FormControl(rowData.personalBlanco),
      tipoExposicion: new FormControl(rowData.tipoExposicion),
      fechaInicioSintomas: new FormControl(rowData.fechaInicioSintomas,[Validators.required]),
      sintomaticoAsintomatico: new FormControl(rowData.sintomaticoAsintomatico),
      comunidadAlbergue: new FormControl(rowData.comunidadAlbergue)
    });

    let coddpto ="";
    if(rowData.departamentoId < 10){
      coddpto = '0'+rowData.departamentoId;
    }else{
      coddpto = rowData.departamentoId;
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
    });

    if(rowData.departamentoId == 18){
      coddpto = '00';
    }

    //console.log(rowData.distritoId);
    let coddist ="";
    if(rowData.distritoId < 10){
      coddist = '00'+rowData.distritoId;
    }else{
      coddist = '0'+rowData.distritoId;
    }

    this.service.getBarriosCiudad(coddpto, coddist).subscribe(barrios => {
      this.barriosOptions = barrios;
      for (let i = 0; i < barrios.length; i++) {
        let d = barrios[i];
        this.barriosOptions[i] = { nombre: d.nombarrio, valor: d.codbarrio };
      }

      console.log(barrios);
    }, error => {
      console.log(error);
      this.mensaje = error.error;
      this.openMessageDialog();
    });
  }

  onRowEditSave(rowData){
    /*this.primerContacto.nroDocumento = this.formGroup.controls.nroDocumento.value;
    this.primerContacto.nombre = this.formGroup.controls.nombre.value;
    this.primerContacto.apellido = this.formGroup.controls.apellido.value;
    this.primerContacto.codigoPaciente = this.formGroup.controls.codigoPaciente.value;*/
    this.primerContacto.departamento = this.formGroup.controls.departamento.value.nombre;
    this.primerContacto.departamentoId = this.formGroup.controls.departamento.value.id;
    this.primerContacto.distrito = this.formGroup.controls.distrito.value.nombre;
    this.primerContacto.distritoId = this.formGroup.controls.distrito.value.valor;
    this.primerContacto.telefono = this.formGroup.controls.telefono.value;
    this.primerContacto.telefonoContacto = this.formGroup.controls.telefonoContacto.value;
    this.primerContacto.hospitalizado = this.formGroup.controls.hospitalizado.value;
    this.primerContacto.fallecido = this.formGroup.controls.fallecido.value;
    this.primerContacto.personalBlanco = this.formGroup.controls.personalBlanco.value;
    this.primerContacto.regionSanitaria = this.formGroup.controls.departamento.value.id;

    this.primerContacto.regionSanitariaId = this.formGroup.controls.departamento.value.id;

    console.log(this.formGroup.controls.barrio.value);
    
    if(this.formGroup.controls.barrio.value){
      if(this.formGroup.controls.barrio.value.valor == null && this.formGroup.controls.barrio.value.nombre == null){
        console.log('barrio nulo1');
        this.primerContacto.barrio = null;
        this.primerContacto.barrioId = '-1';
      }else if(this.formGroup.controls.barrio.value.valor =="-1"){
        this.primerContacto.barrio = null;
        this.primerContacto.barrioId = '-1';

        
      }else if(this.formGroup.controls.barrio.value.valor && this.formGroup.controls.barrio.value.nombre){
        console.log('barrio encontrado');
        this.primerContacto.barrio = this.formGroup.controls.barrio.value.nombre;
        this.primerContacto.barrioId = this.formGroup.controls.barrio.value.valor;
      }
    }/*else if(this.formGroup.controls.barrio.value){
      console.log('barrio manual');
      this.primerContacto.barrio = this.formGroup.controls.barrio.value;
      this.primerContacto.barrioId = null;
    }*/else{
      console.log('barrio nulo3');
      this.primerContacto.barrio = null;
      this.primerContacto.barrioId = '-1';
    }
    
    if(this.formGroup.controls.tipoExposicion.value){
      this.primerContacto.tipoExposicion = this.formGroup.controls.tipoExposicion.value;
    }else{
      this.primerContacto.tipoExposicion = 'SD';
    }

    this.primerContacto.sintomaticoAsintomatico = this.formGroup.controls.sintomaticoAsintomatico.value;
    this.primerContacto.comunidadAlbergue = this.formGroup.controls.comunidadAlbergue.value;
    this.primerContacto.fechaInicioSintomas = this.formGroup.controls.fechaInicioSintomas.value;

    this.primerContacto.direccion = this.formGroup.controls.direccion.value;
    this.primerContacto.referencia = this.formGroup.controls.referencia.value;
    this.primerContacto.casaNumero = this.formGroup.controls.casaNumero.value;

    /*this.primerContacto.fechaCierreCaso = this.formGroup.controls.fechaCierreCaso.value;
    this.primerContacto.fechaUltimaLlamada = this.formGroup.controls.fechaUltimaLlamada.value;*/
    //this.contactosList[row.id].actualizado = 'si';

    let fecha = new Date();
    let mes = fecha.getMonth()+1;
    if(this.primerContacto.comentarios !== null){
      this.primerContacto.comentarios += fecha.getDate()+'/'+mes+'/'+fecha.getFullYear()+' - '+this.username+' - '+'Modificación realizada';
    }else{
      this.primerContacto.comentarios = fecha.getDate()+'/'+mes+'/'+fecha.getFullYear()+' - '+this.username+' - '+'Modificación realizada';
    }

    this.service.editarPrimerContactoDgvsSincronizacion(this.primerContacto).subscribe(response => {
        this.edito = false;
        this.loading = false;
        this.mensaje= "Registro editado exitosamente.";
        this.openMessageDialog();
        this.primerContacto.editado = true;

        this.service.insertFrmFsarscov2(this.primerContacto).subscribe(response => {
          
        }, error => {
          if(error.status == 401){
            this._router.navigate(["/"]);
          }
          else{
            this.loading = false;
            this.mensaje = error.error;
            this.openMessageDialog();
          }
        });

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
