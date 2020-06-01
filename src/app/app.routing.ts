import { ModuleWithProviders } from "@angular/core";
import { Routes, ActivatedRoute, RouterModule } from "@angular/router";
import { AppConfig } from "app/app.config";
/**
 *  COMPONENTES
 */
import { Page404Component } from "./pages/errors/page-404";
import { BuscadorComponent } from "./pages/buscador/buscador.component";
import { BuscadorResultadoComponent } from "./pages/buscador/buscador-resultado.component";
import { FooterComponent } from "./pages/footer/footer.component";
import { HeaderComponent } from "./pages/header/header.component";

/*PODERES*/
import { PoderesDelEstadoComponent } from "./pages/poderes/poderes-estados/poderes-del-estado.component";
import { OeeComponent } from "./pages/poderes/oee/oee.component";
import { OeeServicioComponent } from "./pages/poderes/oee-servicio/oeeServicio.component";
import { OtrasComponent } from "./pages/poderes/otras-instituciones/otras-instituciones.component";
/*PORTADA*/
import { PortadaComponent } from "./pages/portada/portada.component";
import { SectoresComponent } from './pages/portada/sectores/sectores.component';
import { SitiosInteresComponent } from './pages/portada/sitios-interes/sitios-interes.component';
import { TramitesComponent } from './pages/portada/tramites/tramites.component';
import { EstadisticasComponent } from './pages/portada/estadisticas/estadisticas.component';
import { CategoriasTramitesComponent } from "./pages/portada/categorias-tramites/categorias.component";
import { TramitesOnlineComponent } from "./pages/portada/tramites-online/tramites-online.component";
import { TramitesOnlineTemplateComponent } from "./pages/portada/tramites-online/tramites-online-template.component";
/*PAGINAS VARIOS*/
import { FirmaDigitalComponent } from "./pages/paginas-varios/firma-digital/firma-digital.component";
import { PortalComponent } from "./pages/paginas-varios/sobre-portal/sobre-portal.component";
import { GobiernoElectronicoComponent } from "./pages/paginas-varios/gobierno-electronico/gobierno-electronico.component";
import { MapaDelSitioComponent } from "./pages/paginas-varios/mapa-del-sitio/mapa-del-sitio.component";
import { TraductorGuaraniComponent } from "./pages/paginas-varios/traductor-guarani/traductor-guarani.component";
import { PlanesNacionalesComponent } from "./pages/paginas-varios/planes-nacionales/planes-nacionales.component";
import { LineamientosComponent } from "./pages/paginas-varios/lineamientos/lineamientos.component";
import { DatosComponent } from "./pages/paginas-varios/datos/datos.component";
import { DatosAbiertosComponent } from "./pages/paginas-varios/datos-abiertos/datos-abiertos.component";
import { DatosAbiertosCursoComponent } from "./pages/paginas-varios/datos-abiertos-curso/datos-abiertos-curso.component";
import { DatosAbiertosLicenciasComponent } from "./pages/paginas-varios/datos-abiertos-licencias/datos-abiertos-licencias.component";
import { ConsultaPublicaComponent } from "./pages/paginas-varios/consulta-publica/consulta-publica.component";
import { ConsultaPublicaResultadoComponent } from "./pages/paginas-varios/consulta-publica-resultado/consulta-publica-resultado.component";
import { ConsultaReclamoComponent } from "./pages/paginas-varios/consulta-reclamo/consulta-reclamo.component";
import { SuscripcionComponent } from "./pages/paginas-varios/suscripcion/suscripcion.component";
import { GuiaEstandarComponent } from "./pages/paginas-varios/guia-estandar/guia-estandar.component";
import { RestablecerClaveComponent } from "./pages/identidad-electronica/restablecer-clave/restablecer-clave.component";
import { CreacionCuentaComponent } from "./pages/identidad-electronica/crear-cuenta/creacion-cuenta.component";
import { ValidacionIdentidadComponent } from "./pages/identidad-electronica/validacion-identidad/validacion-identidad.component";
import { PasoFinalCreacionClaveComponent } from "./pages/identidad-electronica/paso-final-creacion-clave/paso-final-creacion-clave.component";
import { IdentidadElectronicaComponent } from "./pages/identidad-electronica/identidad-electronica.component";

import { HomeOperadorComponent } from "./pages/covid19/home-operador.component";
import { RegistroPacienteComponent } from "./pages/covid19/registro-paciente.component";

import { MostrarDatosPacienteComponent } from "./pages/covid19/mostrar-datos-paciente.component";

import { MostrarDatosAlPacienteComponent } from "./pages/covid19/mostrar-datos-al-paciente.component";
import { DatosClinicosComponent } from "./pages/covid19/datos-clinicos.component";

import { MensajeFinalComponent } from "./pages/covid19/mensaje-final.component";
import { LoginComponent } from './pages/login/login.component';

import { RegistroIngresoPaisComponent } from "./pages/covid19/ingreso-pais/registro-ingreso-pais.component";
import { CargaCodigoComponent } from "./pages/covid19/ingreso-pais/carga-codigo.component";
import { DatosClinicosIngresoComponent } from "./pages/covid19/ingreso-pais/datos-clinicos-ingreso.component";
import { MensajeFinalIngresoComponent } from "./pages/covid19/ingreso-pais/mensaje-final-ingreso.component";

import { DatosBasicosOperadorComponent } from "./pages/covid19/carga-operador/datos-basicos-operador.component";
import { DatosClinicosOperadorComponent } from "./pages/covid19/carga-operador/datos-clinicos-operador.component";
import { MensajeFinalOperadorComponent } from "./pages/covid19/carga-operador/mensaje-final-operador.component";
import { ClaveSeguridadComponent } from "./pages/covid19/carga-operador/clave-seguridad.component";

import { OperadorIngresoPaisPaciente } from './pages/covid19/operador-ingreso-pais-paciente.component';

import { OperadorTomaMuestraLaboratorial } from './pages/covid19/operador-toma-muestra-laboratorial.component';
/**
 *  PLUGINS
 */
import { NoticiasIppyComponent } from "./plugins/noticiasippy/noticiasippy.component";
import { EncuestaComponent } from "./plugins/encuesta/encuesta.component";
import { ComprasComponent } from "./plugins/compras-publicas/compras-publicas.component";
import { BolsaTrabajoComponent } from "./plugins/bolsa-trabajo/bolsa-trabajo.component";
import { Paso1Component } from "./plugins/gestion-clave/paso1.component";
import { Paso2Component } from "./plugins/gestion-clave/paso2.component";
import { Paso3Component } from "./plugins/gestion-clave/paso3.component";
/**
 *  CIUDADANO
 */
import { LoginCiudadanoComponent } from "app/pages/ciudadano/login-ciudadano/login-ciudadano.component";
import { PerfilCiudadanoComponent } from "app/pages/ciudadano/perfil-ciudadano/perfil-ciudadano.component";
import { FormPerfilCiudadanoComponent } from "app/pages/ciudadano/form-perfil-ciudadano/form-perfil-ciudadano.component";
import { MenuCiudadanoComponent } from "app/pages/ciudadano/menu-ciudadano/menu-ciudadano.component";
import { MarcoLegalComponent } from "app/pages/ciudadano/marco-legal/marco-legal.component";
import { CarpetaCiudadanaComponent } from "app/pages/ciudadano/carpeta-ciudadana/carpeta-ciudadana.component";
import { OtrosTramitesEnLineaComponent } from "app/pages/ciudadano/otros-tramites-en-linea/otros-tramites-en-linea.component";
import { TramitesConEidComponent } from "app/pages/ciudadano/tramites-con-eid/tramites-con-eid.component";
import { VisorDocumentoComponent } from "./pages/ciudadano/visor-documento/visor-documento.component";
import { ValidarDocumentoComponent } from "./pages/ciudadano/validar-documento/validar-documento.component";
/**
 *  SERVICES
 */
import { PoderesDelEstadoService } from "./services/PoderesDelEstadoService";
// import { EncuestaService } from "./services/encuesta.service";
import { MessageService } from "./services/MessageService";
import { IETerminosComponent } from "./pages/identidad-electronica/ie-terminos/ie-terminos.component";
import { AgendarTurnoComponent } from "./pages/identidad-electronica/agendar-turno/agendar-turno.component";
import { IETerminosTemplateComponent } from "./pages/identidad-electronica/ie-terminos-template/ie-terminos-template.component";
import { IEPreguntasFrecuentesCreacionComponent } from "./pages/identidad-electronica/ie-preguntas-frecuentes-creacion/ie-preguntas-frecuentes-creacion.component";
import { EstadisticaComponent } from "./pages/identidad-electronica/estadistica/estadistica.component";
import { CategoriaTramiteResultadoComponent } from "./pages/portada/categoria-tramites-resultado/categoria-tramites-resultado.component";

import { ReportesIndexComponent } from "./pages/reportes/reportes-index/reportes-index.component";
import { RptTramitesOnlineInstitucionesComponent } from "./pages/reportes/rpt-tramites-online/rpt-tramites-online-instituciones.component";
import { RptTramitesPorCicloDeVidaComponent } from "./pages/reportes/rpt-tramites-ciclo-vida/rpt-tramites-ciclo-vida.component";
import { RptTramitesCategoriaComponent } from "./pages/reportes/rpt-tramites-categoria/rpt-tramites-categoria.component";
import { RptTramitesEtiquetaComponent } from "./pages/reportes/rpt-tramites-etiqueta/rpt-tramites-etiqueta.component";
import { RptSatisfaccionTramiteComponent } from "./pages/reportes/rpt-satisfaccion-tramite/rpt-satisfaccion-tramite.component";
import { RptPorcentajeTramitesOnlineComponent } from "./pages/reportes/rpt-porcentaje-tramites-online/rpt-porcentaje-tramites-online.component";
import { DocumentosComponent } from "./pages/documentos/documentos.component";
import { SolicitudDocumentoComponent } from "./pages/ciudadano/solicitud-documento/solicitud-documento.component";
import { ConsultaDocumentoComponent } from "./pages/ciudadano/consulta-documento/consulta-documento.component";
import { RptCantidadDocumentosComponent } from './pages/reportes/rpt-cantidad-documentos/rpt-cantidad-documentos.component';
import { RptTramitesSinTag } from "./pages/reportes/rpt-tramites-sin-tag/rpt-tramites-sin-tag.component";
import { RptListadoTmp } from "./pages/reportes/rpt-listado-tmp/rpt-listado-tmp.component";
import { InfoServicios } from "./pages/ciudadano/carpeta-ciudadana/carpeta-ciudadana-data.component";
import {ReporteNoUbicacionComponent} from "./pages/covid19/reporte-no-ubicacion/reporte-no-ubicacion.component";
import {HistoricoSaludComponent} from './pages/covid19/historico-salud/historico-salud.component';
import {HeaderBaseComponent} from './pages/covid19/header-base/header-base.component';
import {ActualizarEstadoSaludComponent} from './pages/covid19/actualizar-estado-salud/actualizar-estado-salud.component';

//Listado de rutas para la aplicación
export const appRoutes: Routes = [
  { path: "noportada", component: PortadaComponent },
  { path: "portada", component: PortadaComponent, runGuardsAndResolvers: 'always' },
  //{ path: "sitemap.xml", loadChildren: 'app/pages/sitemap/sitemap.module#SitemapModule'},

  { path: "estado", component: PoderesDelEstadoComponent },
  { path: "estado/:urlPoder", component: PoderesDelEstadoComponent },
  { path: "estado/:urlPoder/:urlEntidad", component:OeeComponent },
  { path: "estado/:urlPoder/:urlEntidad/:urlOee", component: OeeComponent },
  { path: "oee/:urlOee", component: OeeComponent },
  { path: "oee/:urlOee/:idServicio", component: OeeServicioComponent },

  { path: "buscador/:tab/:origen/:busqueda", component: BuscadorResultadoComponent },
  { path: "categoria/:filtro/resultado", component: CategoriaTramiteResultadoComponent },
  { path: "sobre-portal", component: PortalComponent },
  { path: "suscripcion", component: SuscripcionComponent },
  { path: "consulta-reclamo", component: ConsultaReclamoComponent },
  { path: "tramites-online", component: TramitesOnlineComponent },
  { path: "categorias-tramites", component: CategoriasTramitesComponent },
  { path: "mapa-del-sitio", component: MapaDelSitioComponent },
  { path: "firma-digital", component: FirmaDigitalComponent },
  { path: "guarani", component: TraductorGuaraniComponent },
  { path: "traductor-guarani", component: TraductorGuaraniComponent },

  { path: "gobierno-electronico", component: GobiernoElectronicoComponent },
  { path: "planes-nacionales", component: PlanesNacionalesComponent },
  { path: "lineamientos", component: LineamientosComponent },
  { path: "datos", component: DatosComponent },
  { path: "datos-abiertos", component: DatosAbiertosComponent },
  { path: "datos-abiertos/curso", component: DatosAbiertosCursoComponent },
  { path: "datos-abiertos/licencias", component: DatosAbiertosLicenciasComponent },
  { path: "consultas-publicas-datos-abiertos", component: ConsultaPublicaComponent },
  { path: "consultas-publicas-datos-abiertos-resultados", component: ConsultaPublicaResultadoComponent },
  { path: "guia-estandar", component: GuiaEstandarComponent },

  // identidad electronica
  { path: "identidad-electronica", component: IdentidadElectronicaComponent },
  { path: "crear-cuenta", component: CreacionCuentaComponent },
  { path: "paso2/:cedula/:email", component: ValidacionIdentidadComponent },
  { path: "establecer-clave/:hash", component: PasoFinalCreacionClaveComponent },
  { path: "identidad-electronica/terminos", component: IETerminosComponent },
  { path: "identidad-electronica/preguntas-frecuentes-creacion", component: IEPreguntasFrecuentesCreacionComponent },
  { path: "estadistica", component:  EstadisticaComponent},
  { path: "restablecer-clave", component: RestablecerClaveComponent },
  { path: "identidad-electronica/agendar-turno", component: AgendarTurnoComponent },

  // ciudadano
  { path: "login-ciudadano", component: LoginCiudadanoComponent, runGuardsAndResolvers: 'always' },
  { path: "redirect", component: LoginCiudadanoComponent, runGuardsAndResolvers: 'always' },
  { path: "perfil-ciudadano", component: PerfilCiudadanoComponent },
  { path: "form-perfil-ciudadano", component: FormPerfilCiudadanoComponent },
  { path: "marco-legal", component: MarcoLegalComponent },

  { path: "carpeta-ciudadana", component: CarpetaCiudadanaComponent },
  { path: "solicitud-documento/:liquidacion", component: SolicitudDocumentoComponent },

  { path: "otros-tramites-en-linea", component: OtrosTramitesEnLineaComponent },
  // { path: "tramites-con-eid", component: TramitesConEidComponent },
  { path: "validar", component: ValidarDocumentoComponent },
  { path: "validar-documento", component: ValidarDocumentoComponent },
  { path: "visor/:ruta/:objId", component: VisorDocumentoComponent },
  { path: "visor/:ruta/:objId/:cv", component: VisorDocumentoComponent },

  { path: "documentos", component: CarpetaCiudadanaComponent },
  { path: "documentos/:tipo", component: ConsultaDocumentoComponent },

  /**estadisticas */
  { path: "estadisticas-portal", component: ReportesIndexComponent },
  { path: "estadisticas-portal/porcentaje-tramites-online", component: RptPorcentajeTramitesOnlineComponent },
  { path: "estadisticas-portal/tramites-institucion", component: RptTramitesOnlineInstitucionesComponent },
  { path: "estadisticas-portal/tramites-ciclo-vida", component: RptTramitesPorCicloDeVidaComponent },
  { path: "estadisticas-portal/tramites-categoria", component: RptTramitesCategoriaComponent },
  { path: "estadisticas-portal/tramites-etiqueta", component: RptTramitesEtiquetaComponent },
  { path: "estadisticas-portal/satisfaccion-tramites", component: RptSatisfaccionTramiteComponent },
  { path: "estadisticas-portal/cantidad-documentos", component: RptCantidadDocumentosComponent },
  { path: "listados", component: RptListadoTmp },
  { path: "listados/:tipo", component: RptTramitesSinTag },

  //{ path: "covid19", component: Covid19Component },

  { path: "covid19/home-operador", component: HomeOperadorComponent},

  { path: "covid19/aislamiento/registro-paciente", component: RegistroPacienteComponent },
  { path: "covid19/aislamiento/datos-paciente", component: MostrarDatosPacienteComponent },

  { path: "i/:idRegistro/:codigoVerif", component: MostrarDatosAlPacienteComponent },

  { path: "covid19/aislamiento/datos-clinicos/:idRegistro/:codigoVerif", component: DatosClinicosComponent },

  { path: "covid19/aislamiento/mensaje-final", component: MensajeFinalComponent},

  { path: "covid19/ingreso-pais/registro", component: RegistroIngresoPaisComponent},
  { path: "covid19/ingreso-pais/carga-codigo", component: CargaCodigoComponent },
  { path: "covid19/ingreso-pais/datos-clinicos/:idRegistro/:codigoVerif", component: DatosClinicosIngresoComponent },
  { path: "covid19/ingreso-pais/mensaje-final", component: MensajeFinalIngresoComponent},

  { path: "covid19/carga-operador/datos-basicos", component: DatosBasicosOperadorComponent},
  { path: "covid19/carga-operador/datos-clinicos/:idRegistro", component: DatosClinicosOperadorComponent },

  { path: "covid19/carga-operador/mensaje-final", component: MensajeFinalOperadorComponent},

  { path: "covid19/carga-operador/clave-seguridad/:idRegistro", component: ClaveSeguridadComponent},

  { path: "covid19/operador/registroPersona", component: OperadorIngresoPaisPaciente},

  { path: "covid19/operador/toma-muestra-laboratorial", component: OperadorTomaMuestraLaboratorial},

  { path: "covid19/operador/toma-muestra-laboratorial/:cedula", component: OperadorTomaMuestraLaboratorial},

  { path: "covid19",
    component: HeaderBaseComponent,
    children: [
      {
        path: "reportes/sin-ubicacion",
        component: ReporteNoUbicacionComponent,
      },
      {
        path: "historico-salud/:cedula",
        component: HistoricoSaludComponent,
      },
      {
        path: "actualizar-salud/:cedula",
        component: ActualizarEstadoSaludComponent,
      },
    ],
  },

  { path: "", component: LoginComponent },

  { path: "**", component: Page404Component }
];

//Listado de components para la aplicación
export const routesComponents = [
  Page404Component,
  HeaderComponent,
  FooterComponent,
  PortadaComponent,
  SectoresComponent,
  SitiosInteresComponent,
  TramitesComponent,
  EstadisticasComponent,
  BuscadorComponent,
  BuscadorResultadoComponent,
  PoderesDelEstadoComponent,
  OeeComponent,
  OeeServicioComponent,
  OtrasComponent,
  NoticiasIppyComponent,
  ComprasComponent,
  BolsaTrabajoComponent,
  EncuestaComponent,
  PortalComponent,
  CategoriasTramitesComponent,
  ConsultaReclamoComponent,
  MapaDelSitioComponent,
  GobiernoElectronicoComponent,
  FirmaDigitalComponent,
  IdentidadElectronicaComponent,
  IETerminosComponent,
  IETerminosTemplateComponent,
  IEPreguntasFrecuentesCreacionComponent,
  TraductorGuaraniComponent,
  PlanesNacionalesComponent,
  LineamientosComponent,
  DatosComponent,
  DatosAbiertosComponent,
  DatosAbiertosCursoComponent,
  ConsultaPublicaComponent,
  ConsultaPublicaResultadoComponent,
  Paso1Component,
  Paso2Component,
  Paso3Component,
  CreacionCuentaComponent,
  ValidacionIdentidadComponent,
  PasoFinalCreacionClaveComponent,
  DatosAbiertosLicenciasComponent,
  TramitesOnlineComponent,
  TramitesOnlineTemplateComponent,
  SuscripcionComponent,
  GuiaEstandarComponent,
  EstadisticaComponent,
  LoginCiudadanoComponent,
  FormPerfilCiudadanoComponent,
  PerfilCiudadanoComponent,
  MenuCiudadanoComponent,
  MarcoLegalComponent,
  OtrosTramitesEnLineaComponent,
  TramitesConEidComponent,
  CarpetaCiudadanaComponent,
  CategoriaTramiteResultadoComponent,
  ValidarDocumentoComponent,
  VisorDocumentoComponent,
  AgendarTurnoComponent,
  ReportesIndexComponent,
  RptPorcentajeTramitesOnlineComponent,
  RptTramitesOnlineInstitucionesComponent,
  RptTramitesPorCicloDeVidaComponent,
  RptTramitesCategoriaComponent,
  RptTramitesEtiquetaComponent,
  RptSatisfaccionTramiteComponent,
  RptTramitesSinTag,
  RptListadoTmp,
  DocumentosComponent,
  SolicitudDocumentoComponent,
  ConsultaDocumentoComponent,
  RptCantidadDocumentosComponent
];

// Listado de providers para la aplicación
export const appRoutingProviders: any[] = [
  AppConfig,
  InfoServicios,
  MessageService,
  PoderesDelEstadoService,
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes,{ useHash: true, scrollPositionRestoration: 'enabled' });
