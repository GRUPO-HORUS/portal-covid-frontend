import { Component, OnInit } from "@angular/core";
import { Covid19Service } from '../../../services/Covid19Service';

import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
//import * as XLSXStyle from 'xlsx-style';
import { Router } from "@angular/router";

import * as Excel from "exceljs";
import { StorageManagerService } from "../../login/shared/storage-manager.service";

import {calendarEsLocale} from '../../../util/calendar-es-locale';
import {FormGroup, FormControl } from '@angular/forms';

declare var $: any;

@Component({
    selector: "distribuir-llamadas-selector",
    templateUrl: "./distribuir-llamadas.component.html",
    providers: [Covid19Service]
  })
export class DistribuirLlamadasComponent implements OnInit{

    cols: any[];
    pacientesList: any[];
    pacientesListCompleta: any[];
    pageSize: number = 25;
    start: number = 0;
    filter: string;
    totalRecords: number = 0;
    sortAsc: boolean = true;
    sortField: string;
    public loading: boolean;

    public region: string;
    public usuarioId;
    public distritosUsuario = [];
    public mensaje: string;

    es = calendarEsLocale;

    operadoresList: any[];

    cantidadPendientes: number = null;
    fechaSelec;
    edito: boolean = false;
    distribucionList: any[]=[];
    rowId: number;

    totalAsignados: number=0;
    habilitarAsignar = false;
    file: File;
    showPopupImportExcelAsignacionPrimerContacto=false;
    public mensajeExcel: string;
    calendarFormGroup: FormGroup;

    constructor(
        private service: Covid19Service,
        private _router: Router,
        private storageManager: StorageManagerService
        //private _location: Location
      ) {
        this.loading = false;
	this.calendarFormGroup = new FormGroup({
        	fechaCierre: new FormControl(null),
      	});
      }

    ngOnInit() {
      const {usuario} = this.storageManager.getLoginData();
      this.region = usuario.regionSanitaria;
      this.usuarioId = usuario.id;

        this.cols = [{ field: 'nombre', header: 'Nombre', width: '25%' },
        { field: 'apellido', header: 'Apellido', width: '25%' },
        { field: 'asignadosActual', header: 'Asignados Actual', width: '15%' },
        { field: 'cant', header: 'Cantidad a asignar', width: '15%' }];
        /*{ field: 'direccionDomicilio', header: 'Domicilio', width: '17%' },
        { field: 'sexo', header: 'Tipo de Contacto', width: '9%' },
        { field: 'fechaUltimoContacto', header: 'Último Contacto', width: '15%' },
        { field: '', header: 'Acciones', width: '15%' }];*/
    }

    getCantidadPendientes(event){
      this.fechaSelec = new Date(event);
      this.service.getCantidadPendientes(this.fechaSelec, this.region).subscribe(pendientes => {
          console.log(pendientes);
          this.cantidadPendientes = pendientes;
        
      }, error => {
        console.log(error);
        this.mensaje = error.error;
        this.openMessageDialog();
      }  
      );
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
        if($event && this.fechaSelec){
          this.listarDistribucion();
        }
    }
    
    listarDistribucion(){
      this.service.getOperadoresRegionales(this.start, this.pageSize, this.filter, this.sortAsc, 
        this.sortField, this.region, this.fechaSelec).subscribe(operadores => {
          this.operadoresList = operadores.lista;
          this.totalRecords = operadores.totalRecords;
          console.log(this.operadoresList);

          this.totalAsignados = 0;
          for(let operador of this.operadoresList){
            this.totalAsignados+= operador.asignadosactual;
          }
        
      }, error => {
        console.log(error);
        this.mensaje = error.error;
        this.openMessageDialog();
      }  
      );
    }

    sincronizarConSalud(){
      this.loading = true;
      this.service.sincronizarConSalud().subscribe(respuesta => {
        //if(respuesta){
          this.mensaje = "Sincronización correcta";
          this.openMessageDialog();
          this.loading = false;
        //}
      }, error => {
        console.log(error);
        this.mensaje = error.error;
        this.openMessageDialog();
        this.loading = false;
      });
    }

    openMessageDialog() {
      setTimeout(function() { $("#miModal").modal("toggle"); }, 1000);
    }

    openConfirmDialog() {
      setTimeout(function() { $("#confirmModal").modal("toggle"); }, 1000);
    }

    getAllPacientes(){
      this.service.listarReingresos(0, 0, this.filter, this.sortAsc, this.sortField, this.region, this.distritosUsuario).subscribe(pacientes => {
        this.pacientesListCompleta = pacientes.lista;
        //this.exportExcel(this.pacientesListCompleta);

        this.exportXlsFormateado(this.pacientesListCompleta);
      });
    }

    onRowEditInit(rowData) {
      this.edito = true;
      this.rowId = rowData.id;

      /*this.primerContacto = rowData;
  
      this.formGroup = new FormGroup({
        codigoPaciente: new FormControl(rowData.codigoPaciente, [
          Validators.required
        ]),
        departamento: new FormControl({nombre:rowData.departamento, id: rowData.departamentoId}, [
          Validators.required
        ]),
        direccion: new FormControl(rowData.direccion, [
          Validators.required
        ]),
        fechaInicioSintomas: new FormControl(rowData.fechaInicioSintomas),
        comunidadAlbergue: new FormControl(rowData.comunidadAlbergue, [
          Validators.required
        ])
      });*/
    }

    onRowEditSave(rowData){
      /*if(rowData.cantAsignar > rowData.asignadosActual ){
        rowData.bandera = 'aumentar';
        //this.totalAsignados += rowData.cantAsignar - rowData.asignadosActual;
        this.distribucionList.push(rowData);
      }else if(rowData.cantAsignar < rowData.asignadosActual){
        //rowData.asignadosActual =  rowData.asignadosActual - rowData.cantAsignar;
        rowData.bandera = 'disminuir';
        this.distribucionList.push(rowData);
      }*/
      console.log(rowData);
      this.distribucionList.push(rowData);
    }

    onRowEditCancel(){
    }

    habilitaAsignar(){
      console.log(this.distribucionList);
      this.service.distribuirLlamadas(this.distribucionList).subscribe(response => {
        this.distribucionList= [];
        this.mensaje= "Registros asignados exitosamente.";
        this.openMessageDialog();
      }, error => {
        if(error.status == 401){
          this._router.navigate(["/"]);
        }
        else{
          this.loading = false;
          this.mensaje = error.error;
          this.openMessageDialog();}
      });
    }

    asignarDistribucion(){
      this.totalAsignados = 0;
      for(let j=0; j<this.distribucionList.length; j++){
        if(this.distribucionList[j].cantAsignar > this.distribucionList[j].asignadosactual ){
          this.totalAsignados += this.distribucionList[j].cantAsignar - this.distribucionList[j].asignadosactual;
          this.distribucionList[j].bandera = 'aumentar';
          this.distribucionList[j].fechaCierre = this.fechaSelec;
        }else if(this.distribucionList[j].cantAsignar < this.distribucionList[j].asignadosactual){
          this.distribucionList[j].bandera = 'disminuir';
          this.distribucionList[j].fechaCierre = this.fechaSelec;

          console.log(this.distribucionList[j]);
        }
      }

      if(this.cantidadPendientes < this.totalAsignados){
        this.mensaje= "No se puede asignar una cantidad mayor de registros que los que se encuentran pendientes.";
        this.openMessageDialog();
        this.totalAsignados = 0;
      }else if(this.cantidadPendientes > this.totalAsignados){
        let sobrantes = this.cantidadPendientes - this.totalAsignados;
        this.mensaje= "Atención. Quedarán "+sobrantes+" registros sin asignar.";
        this.openConfirmDialog();
      }else{
        this.habilitarAsignar = true;
      }

      if(this.habilitarAsignar){
        this.service.distribuirLlamadas(this.distribucionList).subscribe(response => {
          this.distribucionList= [];
          this.mensaje= "Registros asignados exitosamente.";
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
        });
      }
    }

    /*******/
  exportXlsFormateado(pacientes){
    let workbook = new Excel.Workbook();
    let worksheet = workbook.addWorksheet('Pacientes');

    worksheet.addRow(['LISTA DE PERSONAL DE BLANCO']);
    worksheet.addRow(['FECHA DE GENERACIÓN:', new Date().toLocaleString()]);
    worksheet.getRow(1).font = { name: 'Arial Black', family: 4, size: 14, bold: true };

    worksheet.properties.defaultColWidth = 26;
    //worksheet.getColumn(1).width = 25;

    let header=["FECHA INICIO MONITOREO", "SE", "NRO DE DOCUMENTO", "CÓDIGO PACIENTE","NOMBRE", "APELLIDO", "CELULAR", "DEPARTAMENTO", "DOMICILIO","FECHA DE NACIMIENTO",
    "SEXO", "EDAD","RANGO DE EDAD", "CIUDAD", "BARRIO", "FECHA EXPOSICIÓN",
    "FECHA INICIO DE SÍNTOMAS", "NRO DE DOCUMENTO CONTACTO", "NOMBRE CONTACTO", "APELLIDO CONTACTO",
    "SERVICIO DE SALUD", "REGIÓN SANITARIA", "PROFESIÓN", "FUNCIÓN", "REINGRESO", "ULTIMO REINGRESO", "FALLECIDO", "INTERNADO", "LUGAR INTERNACIÓN",
    "ESPECIALIDAD INTERNACIÓN", "CLASIFICACIÓN DE RIESGO", "CATEGORÍA CONTAGIO", "CLASIFICACIÓN FINAL", "LABORATORIO", "EXCLUSIÓN TRABAJO",
    "CONSTANCIA DE AISLAMIENTO", "FICHA EPIDEMIOLÓGICA", "SE DE FIS", "SE DE MUESTRA","FECHA DE MUESTRA",
    "RESULTADO DE MUESTRA", "EVOLUCIÓN FINAL", "FECHA CIERRE CASO", "SE CIERRE CASO", "SINTOMÁTICO", "EMBARAZADA", "PATOLOGIAS DE BASE", "MIGRADO"];
    worksheet.addRow(header);
    worksheet.getRow(3).fill = {type:'pattern', pattern: 'solid', fgColor: {argb:'00000000'}}
    worksheet.getRow(3).font = { color:{argb:'FFFFFFFF'}, name: 'Arial Black', family: 4, size: 11, bold: true };

    let filaNro = 4;
    for(let p of pacientes) {
        let reingreso = 'NO';
        if(p.reingreso){
          reingreso = 'SI';
        }

        let ultimoReingreso = 'NO';
        if(p.ultimoReingreso){
          ultimoReingreso = 'SI';
        }

        let fallecido = 'NO';
        if(p.fallecido){
          fallecido = 'SI';
        }
        let internado = 'NO';
        if(p.internado){
          internado = 'SI';
        }

        let laboratorio = '';
        if(p.laboratorioAntigeno){
          laboratorio = 'ANTIGENO';
        }
        
        if(p.laboratorioPcr){
          laboratorio = 'PCR';
        }
        
        if(p.laboratorioNinguno){
          laboratorio = 'NINGUNO';
        }
        let trabajoExclusion = 'NO';
        if(p.trabajoExclusion){
          trabajoExclusion = 'SI';
        }

        let constanciaAislamiento = 'NO';
        if(p.constanciaAislamiento){
          constanciaAislamiento = 'SI';
        }

        let fichaEpidemiologica = 'NO';
        if(p.fichaEpidemiologica){
          fichaEpidemiologica = 'SI';
        }

        let trabajoAutocontrol = 'NO';
        if(p.trabajoAutocontrol){
          trabajoAutocontrol = 'SI';
        }

        let trabajoNada = 'NO';
        if(p.trabajoNada){
          trabajoNada = 'SI';
        }

        let trabajoOtro = 'NO';
        if(p.trabajoOtro){
          trabajoOtro = 'SI';
        }

        let sintomatico = 'NO';
        if(p.sintomatico){
          sintomatico = 'SI';
        }

        let embarazada = 'NO';
        if(p.embarazada){
          embarazada = 'SI';
        }

        let patologiasBase = '';
        if(p.enfermedadBaseCardiopatiaCronica){
          patologiasBase += 'CARDIOPATIA CRÓNICA,';
        }

        if(p.enfermedadBasePulmonarCronico){
          patologiasBase += 'ENF PULMONAR CRÓNICA,';
        }

        if(p.enfermedadBaseRenalCronico){
          patologiasBase += 'ENF RENAL CRÓNICA,';
        }

        if(p.enfermedadBaseAsma){
          patologiasBase += 'ASMA,';
        }

        if(p.enfermedadBaseDiabetes){
          patologiasBase += 'DIABETES,';
        }

        if(p.enfermedadBaseNeurologica){
          patologiasBase += 'ENF NEUROLÓGICA,';
        }

        if(p.enfermedadBaseObesidad){
          patologiasBase += 'OBESIDAD,';
        }

        if(p.enfermedadBaseHepaticaGrave){
          patologiasBase += 'ENF HEPÁTICA GRAVE,';
        }

        if(p.enfermedadBaseInmunodeprimido){
          patologiasBase += 'INMUNODEPRIMIDO,';
        }

        if(p.enfermedadBaseOtros){
          patologiasBase += 'OTRAS: '+p.enfermedadBaseOtrosNombre != null ? p.enfermedadBaseOtrosNombre.toUpperCase()+",": p.enfermedadBaseOtrosNombre+",";
        }

        if(p.ningunaEnfermedadBase){
          patologiasBase += 'NINGUNA,';
        }

        let migrado = 'NO';
        if(p.migrado){
          migrado = 'SI';
        }

      patologiasBase = patologiasBase.substring(0,patologiasBase.length-1);

      worksheet.addRow([p.fechaInicioMonitoreo, p.se, p.numeroDocumento, p.codigoPaciente != null ? p.codigoPaciente.toUpperCase(): p.codigoPaciente, p.nombre != null ? p.nombre.toUpperCase(): p.nombre, p.apellido != null ? p.apellido.toUpperCase(): p.apellido, p.numeroCelular, 
      p.departamentoDomicilio != null ? p.departamentoDomicilio.toUpperCase(): p.departamentoDomicilio, p.direccionDomicilio != null ? p.direccionDomicilio.toUpperCase(): p.direccionDomicilio, 
      p.fechaNacimiento, p.sexo != null ? p.sexo.toUpperCase(): p.sexo, p.edad, p.rangoEdad != null ? p.rangoEdad.toUpperCase(): p.rangoEdad, p.ciudadDomicilio != null ? p.ciudadDomicilio.toUpperCase(): p.ciudadDomicilio, 
      p.barrio != null ? p.barrio.toUpperCase(): p.barrio, p.fechaExposicion, p.fechaInicioSintoma, p.nroDocumentoContacto, 
      p.nombreContacto != null ? p.nombreContacto.toUpperCase(): p.nombreContacto, p.apellidoContacto != null ? p.apellidoContacto.toUpperCase(): p.apellidoContacto, 
      p.servicioSalud != null ? p.servicioSalud.toUpperCase(): p.servicioSalud, p.regionSanitaria != null ? p.regionSanitaria.toUpperCase(): p.regionSanitaria,
      p.profesion != null ? p.profesion.toUpperCase(): p.profesion, p.funcion != null ? p.funcion.toUpperCase(): p.funcion, reingreso, ultimoReingreso, fallecido,
      internado, p.establecimientoInternacion != null ? p.establecimientoInternacion.toUpperCase(): p.establecimientoInternacion, p.especialidadInternacion != null ? p.especialidadInternacion.toUpperCase(): p.especialidadInternacion, 
      p.clasificacionRiesgo != null ? p.clasificacionRiesgo.toUpperCase(): p.clasificacionRiesgo, p.categoriaContagio != null ? p.categoriaContagio.toUpperCase(): p.categoriaContagio, 
      p.clasificacionFinal != null ? p.clasificacionFinal.toUpperCase(): p.clasificacionFinal, laboratorio,
      trabajoExclusion, constanciaAislamiento, fichaEpidemiologica, p.seFis, p.sePrimeraMuestra, p.fechaPrimeraMuestra,
      p.resultadoPrimeraMuestra != null ? p.resultadoPrimeraMuestra.toUpperCase(): p.resultadoPrimeraMuestra, p.evolucionFinal != null ? p.evolucionFinal.toUpperCase(): p.evolucionFinal,
      p.fechaCierreCaso, p.seCierreCaso, sintomatico, embarazada, patologiasBase, migrado]);

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
    FileSaver.saveAs(blob, "lista_pacientes"+'-'+new Date().valueOf()+'.xlsx');
  });
}
/*******/

    exportExcel(listaUsuarios) {

        //import("xlsx").then(xlsx => {
        //const worksheet = XLSX.utils.json_to_sheet(this.getColumnsExportExcel(listaUsuarios));
        let worksheet;
            
        const worksheet2 = XLSX.utils.sheet_add_json(worksheet, this.getColumnsExportExcel(listaUsuarios), {origin:"A3"});
        worksheet2.A1 ={t: 's', v: 'LISTA DE PERSONAL DE BLANCO'};
        worksheet2.A1.s = {bold: true};
        //worksheet2.A1.v = worksheet2.A1.v.bold();
        
        worksheet2.A2 ={t: 's', v: 'Fecha de Generación:'};
        worksheet2.B2 ={t: 's', v: new Date().toLocaleString()};
        var wscols = [
          { width: 18 },  
          { width: 15 },
          { width: 20 },
          { width: 15 },
          { width: 15 },
          { width: 20 },
          { width: 20 },
          { width: 7 },
          { width: 15 },
          { width: 15 },
          { width: 15 },
          { width: 15 },
          { width: 15 },
          { width: 12 },
        ];
        worksheet2["!cols"] = wscols;
        const workbook = { Sheets: { 'data': worksheet2 }, SheetNames: ['data'] };
            
        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array', cellStyles:true });
        this.saveAsExcelFile(excelBuffer, "listaPacientes");
        //});
  }
    
      getColumnsExportExcel(listaUsuarios) {
        let body = [];

        for(let u of listaUsuarios) {
            let reingreso = 'No';
            if(u.reingreso){
              reingreso = 'Si';
            }
            let fallecido = 'No';
            if(u.fallecido){
              fallecido = 'Si';
            }
            let internado = 'No';
            if(u.internado){
              internado = 'Si';
            }

            let laboratorioAntigeno = 'No';
            if(u.laboratorioAntigeno){
              laboratorioAntigeno = 'Si';
            }
            let laboratorioPcr = 'No';
            if(u.laboratorioPcr){
              laboratorioPcr = 'Si';
            }

            let trabajoExclusion = 'No';
            if(u.trabajoExclusion){
              trabajoExclusion = 'Si';
            }

            let trabajoAutocontrol = 'No';
            if(u.trabajoAutocontrol){
              trabajoAutocontrol = 'Si';
            }

            let trabajoNada = 'No';
            if(u.trabajoNada){
              trabajoNada = 'Si';
            }

            let trabajoOtro = 'No';
            if(u.trabajoOtro){
              trabajoOtro = 'Si';
            }
            body.push({'Nro de Documento': u.numeroDocumento, 'Nombre': u.nombre, 'Apellido': u.apellido, 
            'Celular': u.numeroCelular, 'Departamento': u.departamentoDomicilio, 'Domicilio': u.direccionDomicilio, 
            'Fecha de Nacimiento': u.fechaNacimiento,'Sexo': u.sexo, 'Fecha Exposición':u.fechaExposicion, 'Fecha Inicio de Síntomas':u.fechaInicioSintoma,
            'Nro de Documento Contacto':u.nroDocumentoContacto, 'Nombre Contacto':u.nombreContacto,
            'Apellido Contacto':u.apellidoContacto, 'Sexo Contacto':u.sexoContacto, 'Servicio Salud':u.servicioSalud,
            'Región Sanitaria':u.regionSanitaria, 'Profesión':u.profesion, 'Función':u.funcion, 'Reingreso':reingreso,
            'Fallecido':fallecido, 'Internado':internado, 'Establecimiento Internación':u.establecimientoInternacion,
            'Especialidad Internación':u.especialidadInternacion, 'Clasificación Riesgo':u.clasificacionRiesgo, 'Categoría Contagio':u.categoriaContagio, 'Clasificación Final':u.clasificacionFinal,
            'Antigeno':laboratorioAntigeno, 'PCR':laboratorioPcr, 'Trabajo Exclusión':trabajoExclusion, 'Trabajo Autocontrol':trabajoAutocontrol, 'Trabajo Nada':trabajoNada,
            'Trabajo Otro':trabajoOtro, 'Trabajo Otro Descripción':u.trabajoOtroDescripcion});
        }
        
        return body;
      }
    
      saveAsExcelFile(buffer: any, fileName: string): void {
        //import("file-saver").then(FileSaver => {
            let EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
            let EXCEL_EXTENSION = '.xlsx';
            const data: Blob = new Blob([buffer], {
                type: EXCEL_TYPE
            });
            FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
        //});
      }

      editarPaciente(nroDocumento){
        console.log(nroDocumento);
        this._router.navigate(["covid19/operador/editar-ficha-monitoreo/", nroDocumento]);
      }

      setFile(event: any)
      {
        this.file=event.files[0];
      }

      uploadExcelAsignacionPrimerContacto() {
    this.loading=true;
      this.service.uploadExcelAsignacionPrimerContacto(this.file).subscribe(response => {
	this.listarDistribucion();
        this.loading=false;
	  this.mensajeExcel = response;
	  this.mensajeExcel=(<any>this.mensajeExcel).replaceAll('\n','<br>');
	  this.mensaje = 'Archivo importado exitosamente. Revise el log.';
          this.openMessageDialog();
      });
  }

  openConfirmExcelExport()
  {
    this.mensaje= "Atención.Debe presionar Asignar para que se guarden los cambios. Se generará el excel con los cambios guardados.";
    setTimeout(function() { $("#confirmModalExportExcel").modal("toggle"); }, 1000);
  }
  
  getContactosXls(){
      this.loading = true;
      this.service.getPrimerContactoXls(0, 0, null, this.sortAsc, this.sortField, this.region, this.distritosUsuario, 'todos', this.usuarioId, this.hasRol("Lider Regional"), false, null, null, null, this.calendarFormGroup.controls.fechaCierre.value);
      this.loading = false;
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

}
