import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'documentos',
  templateUrl: './documentos.component.html',
  styleUrls: ["./documentos.component.css"]
})

export class DocumentosComponent implements OnInit {

  documentosIE: any[] = [
    { 
      "name": "Consulta de Datos de Cédula (Policía Nacional)", "isSession": false, "linkExternal": false,
      "link": '/documentos/cedula-policial', 
      "title": "Podrás validar y verificar datos de una Cédula de Identidad con la información proveniente en línea desde el Departamento de Identificaciones de la Policía Nacional."
    },
    {
      "name": "Consulta de Asegurado (IPS)", "isSession": false, "linkExternal": false,
      "link": "/documentos/ips-asegurado",
      "title": "Consultá si una persona está o no inscripta como asegurada ante el IPS, y los datos respectivos en caso de estarlo."
    },
    {
      "name": "Consulta de Datos de RUC (SET)", "isSession": false, "linkExternal": false,
      "link": "/documentos/ruc-set",
      "title": "Accede a los datos de la Cédula Tributaria de contribuyentes provenientes de la Subsecretaría de Estado de Tributación (SET)."
    },
    {
      "name": "Certificado de Cumplimiento  Tributario (SET)", "isSession": false, "linkExternal": true,
      "link": "https://servicios.set.gov.py/eset-publico/certificadoCumplimientoIService.do",
      "title": "Obtené el Certificado de Cumplimiento Tributario emitido en línea por la Subsecretaría de Estado de Tributación (SET)"
    },
    {
      "name": "Consulta de Inscripción de  Empleado (Ministerio de Trabajo)", "isSession": false, "linkExternal": false,
      "link": "/documentos/inscripcion-empleado",
      "title": "Obtené la información de estar o no inscripto ante la Dirección de Registro Obrero Patronal del Ministerio de Trabajo, Empleo y Seguridad Social (MTEES)."
    },
    {
      "name": "Constancia de ser o no Funcionario Público (SFP)", "isSession": false, "linkExternal": false,
      "link": "/documentos/funcionario-publico",
      "title": "Obtené la constancia de ser o no ser funcionario público, proveniente de la Secretaría de la Función Pública (SFP) con datos consultados desde el SINARH y Nómina de Funcionarios Permanentes o Contratos."
    },
    {
      "name": "Consulta de Cédula de MIPYMES", "isSession": false, "linkExternal": false,
      "link": "/documentos/mipymes",
      "title": "Podrás validar y verificar datos de una Cédula de MIPYMES con la información del Viceministerio de Micro, Pequeñas y Medianas Empresas del Ministerio de Industria y Comercio."
    },
    {
      "name": "Descarga de Certificados de Cursos (SNPP)", "isSession": false, "linkExternal": false,
      "link": "/documentos/snpp",
      "title": ""
    },
    {
      "name": "Constancia de Acta de Nacimiento (Registro Civil)", "isSession": true, "linkExternal": false,
      "link": "/login-ciudadano",
      "title": ""
    },
    {
      "name": "Constancia de Acta de Matrimonio (Registro Civil)", "isSession": true, "linkExternal": false,
      "link": "/login-ciudadano",
      "title": ""
    },
    {
      "name": "Constancia de Acta de Defunción (Registro Civil)", "isSession": true, "linkExternal": false,
      "link": "/login-ciudadano",
      "title": ""
    },
    {
      "name": "Consulta de Salario del Asegurado (IPS)", "isSession": true, "linkExternal": false,
      "link": "/login-ciudadano",
      "title": ""
    },
    {
      "name": "Consulta de Nivel Académico (MEC)", "isSession": true, "linkExternal": false,
      "link": "/login-ciudadano",
      "title": ""
    },
    {
      "name": "Constancia de Acta de Nacimiento Hijo/a (Registro Civil)", "isSession": true, "linkExternal": false,
      "link": "/login-ciudadano",
      "title": ""
    },
    {
      "name": "Constancia de vacunación (MSPyBS)", "isSession": true, "linkExternal": false,
      "link": "/login-ciudadano",
      "title": ""
    },
    {
      "name": "Constancia de vacunación - Hijo/a (MSPyBS)", "isSession": true, "linkExternal": false,
      "link": "/login-ciudadano",
      "title": ""
    },
    {
      "name": "Consulta de Certificados (SNPP)", "isSession": true, "linkExternal": false,
      "link": "/login-ciudadano",
      "title": ""
    },
];
  
  constructor(
    private router: Router,
  ) { }  

  ngOnInit() {
    this.scrollTop();
  }

  redirect(doc) {
    if(doc.linkExternal) {
      window.location.href = doc.link;
      return true;
    } else {
      this.router.navigate([doc.link]);
    }
  }

  scrollTop() {
    let top = document.getElementById('topcab');
    if (top !== null) {
      top.scrollIntoView();
      top = null;
    }
  }
  
}
