import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Subscription } from 'rxjs';
import { Covid19Service } from '../../services/Covid19Service';

import {FormDatosBasicos} from './model/formDatosBasicos.model';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { StorageManagerService } from '../login/shared/storage-manager.service';

declare var $: any;

@Component({
  selector: "operador-toma-muestra-laboratorial",
  templateUrl: "./operador-toma-muestra-laboratorial.component.html",
  providers: [Covid19Service]
})
export class OperadorTomaMuestraLaboratorial implements OnInit {

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

  // recaptcha
  // public captchaResponse: string;
  // public captcha: any;
  private subscription: Subscription;
  public recentToken: string = ''
  public recaptchaAvailable = false;

  public origen: string;

  public idRegistro: number;
  public codigoVerif: string;

  public contrasenha: string;
  public contrasenhaConfirm: string;

  public codigoVerificacion: string;

  public response: any;

  cedulaObtenida:string;

  showActualizarDiagnostico=false;
  resultadoUltimoDiagnosticoOptions=[{value:"positivo", label: "Examen Positivo"},
                              {value:"negativo", label: "Examen Negativo"},
                              {value:"sospechoso", label: "Caso Sospechoso"},
                              {value:"fallecido", label: "Fallecido"},
                              {value:"alta_confirmado", label: "Alta de Caso Confirmado"},
                              {value:"alta_aislamiento", label: "Alta de Aislamiento"}
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

  constructor(
    private _router: Router,
    private service: Covid19Service,
    private _route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private storageManager: StorageManagerService
  ) {
    this.loading = false;
    /*if (typeof localStorage !== "undefined") {
        localStorage.clear();
    }*/
  }

  ngOnInit() {  
    this.actualizarDiagnosticoFormGroup = this.formBuilder.group({
      resultadoUltimoDiagnostico: [null,Validators.required],
      fechaUltimoDiagnostico: [null,Validators.required]
    });
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
      else
      {
        this.loading = false;
        this.mensaje = "No se encontró una persona con este identificador";
        this.response = null;
      }
      //this.openMessageDialog();
      
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

  showPopupActualizarDiagnostico()
  {
    this.showActualizarDiagnostico=true;
    for(let resultadoUltimoDiagnostico of this.resultadoUltimoDiagnosticoOptions)
    {
      if(this.response.resultadoUltimoDiagnostico==resultadoUltimoDiagnostico.value)
      {
        this.actualizarDiagnosticoFormGroup.controls.resultadoUltimoDiagnostico.setValue(resultadoUltimoDiagnostico);
        break;
      }
    }
    this.actualizarDiagnosticoFormGroup.controls.fechaUltimoDiagnostico.setValue(this.response.fechaUltimoDiagnostico);
  }

  actualizarDiagnostico(): void {
    this.loading = true;
    let diagnostico:any={};
    diagnostico.numeroDocumento=this.cedulaObtenida;
    diagnostico.resultadoUltimoDiagnostico=this.actualizarDiagnosticoFormGroup.controls.resultadoUltimoDiagnostico.value.value;
    diagnostico.fechaUltimoDiagnostico=this.actualizarDiagnosticoFormGroup.controls.fechaUltimoDiagnostico.value;
    this.service.actualizarDiagnosticoPaciente(diagnostico).subscribe(response => {
        this.loading = false;
        this.mensaje= "Diagnóstico del Paciente registrado exitósamente.";
        this.showActualizarDiagnostico=false;
        this.response.fechaUltimoDiagnostico=this.actualizarDiagnosticoFormGroup.controls.fechaUltimoDiagnostico.value;
        this.response.resultadoUltimoDiagnostico=this.actualizarDiagnosticoFormGroup.controls.resultadoUltimoDiagnostico.value.value;
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

  closeActualizarDiagnostico()
  {
    this.showActualizarDiagnostico=false;
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

}
