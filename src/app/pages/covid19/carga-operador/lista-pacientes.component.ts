import { Component, OnInit } from "@angular/core";
import { Covid19Service } from '../../../services/Covid19Service';

import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
//import * as XLSXStyle from 'xlsx-style';
import { Router } from "@angular/router";

import * as Excel from "exceljs";

@Component({
    selector: "lista-pacientes-selector",
    templateUrl: "./lista-pacientes.component.html",
    providers: [Covid19Service]
  })
export class ListaPacientesComponent implements OnInit{

    cols: any[];
    pacientesList: any[];
    pacientesListCompleta: any[];
    pageSize: number = 10;
    start: number = 0;
    filter: string;
    totalRecords: number = 0;
    sortAsc: boolean = true;
    sortField: string;
    public loading: boolean;

    constructor(
        private service: Covid19Service,
        private _router: Router,
        //private _location: Location
      ) {
        this.loading = false;
      }

    ngOnInit() {
        this.cols = [{ field: 'numeroDocumento', header: 'Nro de Documento', width: '11%' },
        { field: 'nombre', header: 'Nombres', width: '20%' },
        { field: 'apellido', header: 'Apellidos', width: '20%' },
        { field: 'numeroCelular', header: 'Teléfono', width: '12%' },
        { field: 'departamentoDomicilio', header: 'Departamento', width: '14%' }];
        //{ field: 'direccionDomicilio', header: 'Domicilio', width: '17%' },
        //{ field: 'sexo', header: 'Tipo de Contacto', width: '9%' },
        //{ field: 'fechaUltimoContacto', header: 'Último Contacto', width: '15%' },
        //{ field: '', header: 'Acciones', width: '15%' }];
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
        this.listarPacientes();
        
    }
    
    listarPacientes(){
      this.service.listarPacientes(this.start, this.pageSize, this.filter, this.sortAsc, this.sortField).subscribe(pacientes => {
        this.pacientesList = pacientes.lista;
        this.totalRecords = pacientes.totalRecords;
    
        console.log(this.pacientesList);   
      });
    }

    getAllPacientes(){
      this.service.listarPacientes(0, 0, this.filter, this.sortAsc, this.sortField).subscribe(pacientes => {
        this.pacientesListCompleta = pacientes.lista;
        this.exportExcel(this.pacientesListCompleta);

        //this.exportXlsFormateado(this.pacientesListCompleta);
      });
    }

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

}