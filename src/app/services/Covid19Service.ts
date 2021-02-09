import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { AppConfig } from "../../app/app.config";
import { HttpClient, HttpParams } from "@angular/common/http";
import { FormDatosBasicos } from "../../app/pages/covid19/model/formDatosBasicos.model";
import {ContactoTable} from '../pages/covid19/model/contacto-table.model';
import { FormDatosBasicosPB } from "../pages/covid19/model/formDatosBasicosPB.model";
import { PrimerContactoTable } from "../pages/covid19/model/primer-contacto-table.model";
import { FormCensoContactoTable } from "../pages/covid19/model/form-censo-contacto-table.model";
import { UsuarioTable } from "../pages/usuario/shared/usuario-table.model";

@Injectable()
export class Covid19Service {

  constructor(private config: AppConfig, private httpClient: HttpClient) {}

  private loading = new BehaviorSubject<boolean>(false);

    getLugaresServicio(): Observable<any[]>{
      return this.httpClient.get<any[]>(this.config.API +"/covid19api/aislamiento/lugaresServicio");
    }

    sendMessage(phone: string): Observable<any[]>{
      return this.httpClient.get<any[]>(this.config.API +"/covid19/sendMessage?phone="+phone);
    }

    guardarDatosBasicos(formDatosBasicos, rcToken): Observable<string> {
      return this.httpClient.post<string>(this.config.API + '/covid19api/ingresoPais/datosBasicosViajero/'+rcToken, formDatosBasicos);
    }

    registrarPaciente(formDatosBasicos): Observable<string> {
      return this.httpClient.post<string>(this.config.API + '/covid19api/aislamiento/datosBasicos', formDatosBasicos);
    }

    guardarDatosClinicos(formDatosClinicos): Observable<string> {
      return this.httpClient.post<string>(this.config.API + '/covid19api/aislamiento/datosClinicos', formDatosClinicos);
    }

    getDatosBasicos(idRegistro, codigoVerif): Observable<FormDatosBasicos> {
      return this.httpClient.get<FormDatosBasicos>(this.config.API + '/covid19api/aislamiento/datosBasicosAislamiento/'+idRegistro+"/"+codigoVerif);
    }

    validarTelefono(idRegistro, codigoVerif, contrasenha): Observable<any> {
      return this.httpClient.post<any>(this.config.API + '/covid19api/aislamiento/validarTelefono/'+idRegistro+"/"+codigoVerif, contrasenha);
    }


    validarTelefonoIngresoPais(idRegistro, codigoVerif): Observable<any> {
      return this.httpClient.post<any>(this.config.API + '/covid19api/ingresoPais/validarTelefono/'+idRegistro+"/"+codigoVerif, {});
    }

    getDatosBasicosByNumeroDocumentoAndCodigoVerificacion(numeroDocumento, codigoVerif): Observable<FormDatosBasicos> {
      return this.httpClient.get<FormDatosBasicos>(this.config.API + '/covid19api/ingresoPais/obtenerPersona/'+numeroDocumento+"/"+codigoVerif);
    }

    confirmarPersona(numeroDocumento, codigoVerif): Observable<any> {
      return this.httpClient.post<any>(this.config.API + '/covid19api/ingresoPais/confirmarPersona/'+numeroDocumento+"/"+codigoVerif,null);
    }

    guardarFichaPB(fichaPersonalBlanco): Observable<string> {
      return this.httpClient.post<string>(this.config.API + '/covid19api/aislamiento/fichaPersonalBlanco/', fichaPersonalBlanco);
    }

    editarFichaPB(fichaPersonalBlanco, idRegistroForm): Observable<string> {
      return this.httpClient.post<string>(this.config.API + '/covid19api/aislamiento/editarFichaPersonalBlanco/'+idRegistroForm, fichaPersonalBlanco);
    }

    actualizarSeguimientoPB(fichaPersonalBlanco, idRegistroForm): Observable<string> {
      return this.httpClient.post<string>(this.config.API + '/covid19api/aislamiento/actualizarSeguimientoPB/'+idRegistroForm, fichaPersonalBlanco);
    }

    guardarDatosBasicosOperador(formDatosBasicos): Observable<string> {
      return this.httpClient.post<string>(this.config.API + '/covid19api/cargaOperador/datosBasicos', formDatosBasicos);
    }

    guardarDatosClinicosOperador(formDatosClinicos): Observable<string> {
      return this.httpClient.post<string>(this.config.API + '/covid19api/cargaOperador/datosClinicos', formDatosClinicos);
    }

    guardarFormPersonalBlanco(formPersonalBlanco):Observable<string>{
      return this.httpClient.post<string>(this.config.API + '/covid19api/aislamiento/datosPersonalBlanco', formPersonalBlanco);
    }

    guardarContactoContagio(contacto):Observable<string>{
      return this.httpClient.post<string>(this.config.API + '/covid19api/aislamiento/contactoContagio', contacto);
    }

    guardarFormSintomas(formSintomas):Observable<string>{
      return this.httpClient.post<string>(this.config.API + '/covid19api/aislamiento/datosSintomas', formSintomas);
    }

    guardarClasifRiesgo(clasifRiesgo):Observable<string>{
      return this.httpClient.post<string>(this.config.API + '/covid19api/aislamiento/clasifRiesgo', clasifRiesgo);
    }

    //Al crear contacto
    guardarPaciente(fichaPersonalBlanco): Observable<string> {
      return this.httpClient.post<string>(this.config.API + '/covid19api/aislamiento/guardarPaciente/', fichaPersonalBlanco);
    }

    actualizarDatosRealizarLlamada(fichaPersonalBlanco): Observable<string> {
      return this.httpClient.post<string>(this.config.API + '/covid19api/aislamiento/actualizarDatosRealizarLlamada', fichaPersonalBlanco);
    }

    guardarNuevoContacto(formCensoContacto): Observable<string> {
      return this.httpClient.post<string>(this.config.API + '/covid19api/aislamiento/guardarNuevoContacto/', formCensoContacto);
    }

    editarFormCensoContacto(formCensoContacto): Observable<string> {
      return this.httpClient.post<string>(this.config.API + '/covid19api/aislamiento/editarFormCensoContacto', formCensoContacto);
    }

    borrarFormCensoContacto(formCensoContacto): Observable<string> {
      return this.httpClient.post<string>(this.config.API + '/covid19api/aislamiento/borrarFormCensoContacto', formCensoContacto);
    }

    guardarFichaContacto(fichaPersonalBlanco): Observable<string> {
      return this.httpClient.post<string>(this.config.API + '/covid19api/aislamiento/guardarFichaContacto/', fichaPersonalBlanco);
    }

    getUsuarioNotificado(cedula, fechaInicioMonitoreo): Observable<any> {
      let params = new HttpParams();
      if(cedula){
        params = params.set('cedula', cedula);
      }
      if(fechaInicioMonitoreo){
        params = params.set('fechaInicioMonitoreo', fechaInicioMonitoreo);
      }

      return this.httpClient.get<any>(this.config.API + '/covid19api/aislamiento/getUsuarioNotificado/', {params});
    }

    getUsuariosContactCenter(start: number, pageSize: number, filter: string, sortAsc: boolean,
      sortField: string): Observable<UsuarioTable> {
     this.loading.next(true);

     let params = new HttpParams();

      if (filter)
        params = params.set('filter', filter);

      if (sortField)
        params = params.set('sortField', sortField);

      /*if(distritosUsuario.length > 0){
          let distritosParam="";
          for(let i=0; i<distritosUsuario.length; i++){
            if(i+1==distritosUsuario.length){
              distritosParam+= distritosUsuario[i];
            }else{
              distritosParam+= distritosUsuario[i]+",";
            }
          }
          params = params.set('distritosUsuario', distritosParam);
      }*/

     params = params.set('start', start.toString()).set('pageSize', pageSize.toString()).set('sortAsc', sortAsc.toString());
     return this.httpClient.get<UsuarioTable>(this.config.API + '/covid19api/aislamiento/listarUsuariosContactCenter/', {params});
   }

    reservarRegistros(idUsuario): Observable<string> {
      return this.httpClient.get<string>(this.config.API + '/covid19api/aislamiento/reservarRegistros/'+idUsuario);
    }

    liberarRegistros(idUsuario): Observable<string> {
      return this.httpClient.get<string>(this.config.API + '/covid19api/aislamiento/liberarRegistros/'+idUsuario);
    }

    getPacientesFormCensoContacto(start: number, pageSize: number, filter: string, sortAsc: boolean,
      sortField: string, region, idUsuario, primerContactoId, distritosUsuario): Observable<FormCensoContactoTable> {
     this.loading.next(true);

     let params = new HttpParams();

      if (filter)
        params = params.set('filter', filter);

      if (sortField)
        params = params.set('sortField', sortField);

      if (idUsuario)
        params = params.set('idUsuario', idUsuario);

      if (primerContactoId)
        params = params.set('primerContactoId', primerContactoId);

      if(distritosUsuario.length > 0){
          let distritosParam="";
          for(let i=0; i<distritosUsuario.length; i++){
            if(i+1==distritosUsuario.length){
              distritosParam+= distritosUsuario[i];
            }else{
              distritosParam+= distritosUsuario[i]+",";
            }
          }
          params = params.set('distritosUsuario', distritosParam);
      }

     params = params.set('start', start.toString()).set('pageSize', pageSize.toString()).set('sortAsc', sortAsc.toString());
     return this.httpClient.get<FormCensoContactoTable>(this.config.API + '/covid19api/aislamiento/listarFormCensoContacto/'+region, {params});
   }

    getPacientesCensoContacto(start: number, pageSize: number, filter: string, sortAsc: boolean,
      sortField: string, region, distritosUsuario, opcionFiltro, username): Observable<PrimerContactoTable> {
     this.loading.next(true);

     let params = new HttpParams();

      if (filter)
        params = params.set('filter', filter);

      if (sortField)
        params = params.set('sortField', sortField);

      if (username)
        params = params.set('username', username);

      if(distritosUsuario.length > 0){
          let distritosParam="";
          for(let i=0; i<distritosUsuario.length; i++){
            if(i+1==distritosUsuario.length){
              distritosParam+= distritosUsuario[i];
            }else{
              distritosParam+= distritosUsuario[i]+",";
            }
          }
          params = params.set('distritosUsuario', distritosParam);
      }

     params = params.set('start', start.toString()).set('pageSize', pageSize.toString()).set('sortAsc', sortAsc.toString());
     return this.httpClient.get<PrimerContactoTable>(this.config.API + '/covid19api/aislamiento/listarCensoContacto/'+region+'/'+opcionFiltro, {params});
   }

    getPacientesPrimerContacto(start: number, pageSize: number, filter: string, sortAsc: boolean,
      sortField: string, region, distritosUsuario, opcionFiltro, username): Observable<PrimerContactoTable> {
     this.loading.next(true);

     let params = new HttpParams();

      if (filter)
        params = params.set('filter', filter);

      if (sortField)
        params = params.set('sortField', sortField);

      if (username)
        params = params.set('username', username);

      if(distritosUsuario.length > 0){
        let distritosParam="";
        for(let i=0; i<distritosUsuario.length; i++){
          if(i+1==distritosUsuario.length){
            distritosParam+= distritosUsuario[i];
          }else{
            distritosParam+= distritosUsuario[i]+",";
          }
        }
        params = params.set('distritosUsuario', distritosParam);
      }

     params = params.set('start', start.toString()).set('pageSize', pageSize.toString()).set('sortAsc', sortAsc.toString());
     return this.httpClient.get<PrimerContactoTable>(this.config.API + '/covid19api/aislamiento/listarPrimerContacto/'+region+'/'+opcionFiltro, {params});
   }

  guardarPrimerContacto(primerContacto): Observable<string> {
    return this.httpClient.post<string>(this.config.API + '/covid19api/aislamiento/guardarPrimerContacto/', primerContacto);
  }

  editarPrimerContacto(primerContacto): Observable<string> {
    return this.httpClient.post<string>(this.config.API + '/covid19api/aislamiento/editarPrimerContacto', primerContacto);
  }

  insertFrmFsarscov2(primerContacto): Observable<string> {
    return this.httpClient.post<string>(this.config.API + '/covid19/fsarscov2DgticCon/insertFrmFsarscov2', primerContacto);
  }

  listarPacientes(start: number, pageSize: number, filter: string, sortAsc: boolean,
      sortField: string, region, distritosUsuario): Observable<ContactoTable> {
     this.loading.next(true);

     let params = new HttpParams();

     if (filter)
       params = params.set('filter', filter);

     if (sortField)
       params = params.set('sortField', sortField);

       if(distritosUsuario.length > 0){
        let distritosParam="";
        for(let i=0; i<distritosUsuario.length; i++){
          if(i+1==distritosUsuario.length){
            distritosParam+= distritosUsuario[i];
          }else{
            distritosParam+= distritosUsuario[i]+",";
          }
        }
        params = params.set('distritosUsuario', distritosParam);
      }

     params = params.set('start', start.toString()).set('pageSize', pageSize.toString()).set('sortAsc', sortAsc.toString());
     return this.httpClient.get<ContactoTable>(this.config.API + '/covid19api/aislamiento/listarPacientes/'+region, {params});
  }

    setearClave(idRegistro, clave): Observable<string> {
      return this.httpClient.post<string>(this.config.API + '/covid19api/cargaOperador/claveSeguridad/'+idRegistro, clave);
    }

    getDistritosUsuario(usuarioId): Observable<any[]>{
      return this.httpClient.get<any[]>(this.config.API +"/covid19api/aislamiento/distritosUsuario/"+usuarioId);
    }

    getDistritosDepto(coddpto): Observable<any[]>{
      return this.httpClient.get<any[]>(this.config.API +"/covid19api/aislamiento/distritosDepto/"+coddpto);
    }

    getBarriosDepto(coddpto): Observable<any[]>{
      return this.httpClient.get<any[]>(this.config.API +"/covid19api/aislamiento/barriosDepto/"+coddpto);
    }

    getCiudadesPorDepto(idDepto): Observable<any[]>{
      return this.httpClient.get<any[]>(this.config.API +"/covid19/ciudades/"+idDepto);
    }

    getPacienteEditar(cedula): Observable<FormDatosBasicosPB> {
      return this.httpClient.get<FormDatosBasicosPB>(this.config.API + '/covid19api/aislamiento/getPacienteEditar/'+cedula);
    }

    getPacienteActualizarSeguimiento(cedula): Observable<FormDatosBasicosPB> {
      return this.httpClient.get<FormDatosBasicosPB>(this.config.API + '/covid19api/aislamiento/getPacienteActualizarSeguimiento/'+cedula);
    }

    getDatosPacienteByNumeroDocumento(numeroDocumento): Observable<FormDatosBasicos> {
      return this.httpClient.get<FormDatosBasicos>(this.config.API + '/covid19api/aislamiento/obtenerPaciente/'+numeroDocumento);
    }

    getIdentificacionesByNumeroDocumento(numeroDocumento): Observable<any> {
      return this.httpClient.get<any>(this.config.API + '/covid19/sii/identificaciones/'+numeroDocumento);
    }

    actualizarDiagnosticoPaciente(diagnosticoPaciente): Observable<any> {
      return this.httpClient.post<string>(this.config.API + '/covid19api/cargaOperador/paciente/actualizarDiagnostico', diagnosticoPaciente);
    }

    reenviarSms(cedula): Observable<any> {
      return this.httpClient.post<string>(this.config.API + '/covid19api/cargaOperador/paciente/reenviarSms', cedula);
    }

    cambiarNroCelular(datosPaciente): Observable<any> {
      return this.httpClient.post<string>(this.config.API + '/covid19api/cargaOperador/paciente/cambiarNroCelular', datosPaciente);
    }

    getContactosPaciente(idPaciente:number, start: number, pageSize: number, filter: string, sortAsc: boolean,
      sortField: string): Observable<ContactoTable> {
     this.loading.next(true);

     let params = new HttpParams();

     if (idPaciente)
       params = params.set('idPaciente', idPaciente.toString());

     if (filter)
       params = params.set('filter', filter);

     if (sortField)
       params = params.set('sortField', sortField);

     params = params.set('start', start.toString()).set('pageSize', pageSize.toString()).set('sortAsc', sortAsc.toString());
     return this.httpClient.get<ContactoTable>(this.config.API + '/covid19/contactos/getContactosPaciente', {params});
   }

  borrarContacto(idContacto): Observable<any> {
    return this.httpClient.post<string>(this.config.API + '/covid19/contactos/borrar', idContacto);
  }

  agregarContacto(contacto): Observable<any> {
    return this.httpClient.post<string>(this.config.API + '/covid19/contactos', contacto);
  }

  editarContacto(contacto): Observable<any> {
    return this.httpClient.post<string>(this.config.API + '/covid19/contactos/'+contacto.id, contacto);
  }

  crearExamenLaboratorial(examen): Observable<any> {
    return this.httpClient.post<string>(this.config.API + '/covid19api/cargaOperador/paciente/crearExamenLaboratorial', examen);
  }

 }



