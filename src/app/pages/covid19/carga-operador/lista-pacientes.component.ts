import { Component, OnInit } from "@angular/core";
import { Covid19Service } from '../../../services/Covid19Service';

import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

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
        //private _location: Location
      ) {
        this.loading = false;
      }

    ngOnInit() {
        this.cols = [{ field: 'numeroDocumento', header: 'Nro de Documento', width: '9%' },
        { field: 'nombre', header: 'Nombres', width: '10%' },
        { field: 'apellido', header: 'Apellidos', width: '10%' },
        { field: 'numeroCelular', header: 'Teléfono', width: '10%' },
        { field: 'departamentoDomicilio', header: 'Departamento', width: '11%' }];
        //{ field: 'domicilio', header: 'Domicilio', width: '17%' },
        //{ field: 'tipo', header: 'Tipo de Contacto', width: '9%' },
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
      });
    }

    exportExcel(listaUsuarios) {
        //import("xlsx").then(xlsx => {
            const worksheet = XLSX.utils.json_to_sheet(this.getColumnsExportExcel(listaUsuarios));
            //const worksheet = XLSX.utils.json_to_sheet(this.pacientesListCompleta);
            var wscols = [
              { width: 25 },  
              { width: 35 }, 
              { width: 35 },
              { width: 30 }
            ];
            worksheet["!cols"] = wscols;
            const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
            const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            this.saveAsExcelFile(excelBuffer, "listaPacientes");
        //});
      }
    
      getColumnsExportExcel(listaUsuarios) {
        let body = [];
        for(let u of listaUsuarios) {
            body.push({'Nro de Documento': u.numeroDocumento, 'Nombre': u.nombre, 'Apellido': u.apellido, 
            'Teléfono': u.numeroCelular, 'Departamento': u.departamentoDomicilio});
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

}