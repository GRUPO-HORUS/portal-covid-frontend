import { ModuleWithProviders } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AppConfig } from "app/app.config";
/**
 *  COMPONENTES
 */
import { Page404Component } from "./pages/errors/page-404";
import { FooterComponent } from "./pages/footer/footer.component";
import { HeaderComponent } from "./pages/header/header.component";
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
 *  SERVICES
 */
import { MessageService } from "./services/MessageService";
import {ReporteNoUbicacionComponent} from "./pages/covid19/reporte-no-ubicacion/reporte-no-ubicacion.component";
import {HistoricoSaludComponent} from './pages/covid19/estado-salud/historico-salud/historico-salud.component';
import {HeaderBaseComponent} from './pages/covid19/header-base/header-base.component';
import {ActualizarEstadoSaludComponent} from './pages/covid19/estado-salud/actualizar-estado-salud/actualizar-estado-salud.component';
import {VisualizarEstadoSaludComponent} from './pages/covid19/estado-salud/visualizar-estado-salud/visualizar-estado-salud.component';
import { ContactosPaciente } from "./pages/covid19/contactos-paciente.component";
import { FichaMonitoreoComponent } from "./pages/covid19/carga-operador/ficha-monitoreo.component";
import { ContactoFormComponent } from "./pages/covid19/contacto/contacto-form.component";
import { Contactos } from "./pages/covid19/contacto/contactos.component";   //prueba
import { ActualizarSeguimientoComponent } from "./pages/covid19/carga-operador/actualizar-seguimiento.component";
import { PrimerContactoComponent } from "./pages/covid19/carga-operador/primer-contacto.component";
import { ListaPacientesComponent } from "./pages/covid19/carga-operador/lista-pacientes.component";
import { GrillaPrimerContactoComponent } from "./pages/covid19/carga-operador/grilla-primer-contacto.component";
import { GrillaPrimerContactoSincronizacionComponent } from "./pages/covid19/carga-operador/grilla-primer-contacto-sincronizacion.component";
import { EditarFichaMonitoreoComponent } from "./pages/covid19/carga-operador/editar-ficha-monitoreo.component";

import { GrillaCensoContactosComponent } from "./pages/covid19/carga-operador/grilla-censo-contactos.component";
import { GrillaFormCensoContactoComponent } from "./pages/covid19/carga-operador/grilla-form-censo-contacto.component";
import { DistribuirLlamadasComponent } from "./pages/covid19/carga-operador/distribuir-llamadas.component";

//Listado de rutas para la aplicación
export const appRoutes: Routes = [
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
  { path: "covid19/operador/contactos-paciente/:id/:cedula", component: ContactosPaciente},

  { path: "covid19/operador/ficha-monitoreo", component: FichaMonitoreoComponent},

  { path: "covid19/operador/nuevo-contacto/:cedula/:nombre/:apellido", component: ContactoFormComponent},

  { path: "covid19/operador/contactos", component: Contactos},

  { path: "covid19/operador/actualizar-seguimiento", component: ActualizarSeguimientoComponent},

  { path: "covid19/operador/primer-contacto/:cedula/:id", component: PrimerContactoComponent},

  { path: "covid19/operador/lista-pacientes", component: ListaPacientesComponent},

  { path: "covid19/operador/grilla-primer-contacto", component: GrillaPrimerContactoComponent},

  { path: "covid19/operador/grilla-primer-contacto-sincronizacion", component: GrillaPrimerContactoSincronizacionComponent},

  { path: "covid19/operador/editar-ficha-monitoreo/:cedula", component: EditarFichaMonitoreoComponent},

  { path: "covid19/operador/grilla-censo-contactos", component: GrillaCensoContactosComponent},

  { path: "covid19/operador/grilla-form-censo-contacto", component: GrillaFormCensoContactoComponent},

  { path: "covid19/operador/distribuir-llamadas", component: DistribuirLlamadasComponent},

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
      {
        path: "ultimo-reporte-salud/:cedula",
        component: VisualizarEstadoSaludComponent,
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
];

// Listado de providers para la aplicación
export const appRoutingProviders: any[] = [
  AppConfig,
  MessageService,
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes,{ useHash: true, scrollPositionRestoration: 'enabled' });
