import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from '@angular/common/http';
import { ScrollToModule } from "ng2-scroll-to";
import { ScrollToService } from "ng2-scroll-to-el";
import { FormsModule } from "@angular/forms";
import { MatSnackBarModule } from "@angular/material";
import { routing, routesComponents, appRoutingProviders } from "./app.routing";
import { AppComponent } from "./app.component";
import { OwlModule } from "ng2-owl-carousel";
import { MaterialDesignFrameworkModule } from "angular6-json-schema-form";
import { NgxPaginationModule } from "ngx-pagination";
import { Ng2SearchPipeModule } from "ng2-search-filter";
import { Ng2OrderModule } from "ng2-order-pipe";

import { RecaptchaFormsModule } from "ng-recaptcha/forms";
import { RecaptchaModule, RECAPTCHA_LANGUAGE } from "ng-recaptcha";
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ToastrModule, ToastContainerModule } from 'ngx-toastr';

import { CapitalizePipe } from "./pipes/capitalize.pipe";
import { KeysPipe } from "./pipes/keys.pipe";
import { SafePipe } from "./pipes/safe.pipe";
import { SlugPipe } from "./pipes/slug.pipe";
import { SplitPipe } from "./pipes/split.pipe";
import { SafeHtmlPipe } from "./pipes/safehtml.pipe";
import { FilterdataPipe } from "./pipes/filterdata.pipe";
import { ArraySortPipe } from "./pipes/orderby.pipe";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { MyDatePickerModule } from "app/lib/angular4-datepicker/src/my-date-picker";
import "hammerjs";
import { RestablecerClaveComponent } from './pages/identidad-electronica/restablecer-clave/restablecer-clave.component';
import {DemoMaterialModule} from './material-module';
import { ChartjsModule } from '@ctrl/ngx-chartjs';
import { ModalModule } from './lib/modal-custom';
import { Covid19Component } from './pages/covid19/covid19.component';
import { CargaCodigoComponent } from './pages/covid19/carga-codigo.component';
import { DatosClinicosComponent } from './pages/covid19/datos-clinicos.component';
import { RegistroPacienteComponent } from './pages/covid19/registro-paciente.component';
import { DropdownModule } from 'primeng/dropdown';

import {CheckboxModule} from 'primeng/checkbox';

import {RadioButtonModule} from 'primeng/radiobutton';

import { QRCodeModule } from 'angularx-qrcode';
import { MostrarDatosPacienteComponent } from "./pages/covid19/mostrar-datos-paciente.component";

import { MostrarDatosAlPacienteComponent } from "./pages/covid19/mostrar-datos-al-paciente.component";

import { LoginComponent } from './pages/login/login.component';

import { MessagesModule } from 'primeng/messages';

import { MessageModule } from 'primeng/message';

import { WebStorageModule } from 'ngx-store';

import { CambiarClaveComponent } from './pages/login/cambiar-clave/cambiar-clave.component';

import { GenerarClaveComponent } from './pages/login/generar-clave/generar-clave.component';

import { PermisoComponent } from './pages/permiso/permiso.component';

import { RolComponent } from './pages/rol/rol.component';

import { RolCrearComponent } from './pages/rol/rol-crear/rol-crear.component';

import { UsuarioComponent } from './pages/usuario/usuario.component';

import { UsuarioCrearComponent } from './pages/usuario/usuario-crear/usuario-crear.component';

import { UsuarioEditarRolComponent } from './pages/usuario/usuario-editar-rol/usuario-editar-rol.component';

/*
  @autor:
  @date: 29/06/2017
*/
@NgModule({
  // Declaración de componentes
  declarations: [
    AppComponent,
    routesComponents,
    CapitalizePipe,
    SafePipe,
    SlugPipe,
    SplitPipe,
    SafeHtmlPipe,
    FilterdataPipe,
    KeysPipe,
    ArraySortPipe,
    RestablecerClaveComponent,
    Covid19Component,
    CargaCodigoComponent,
    DatosClinicosComponent,
    RegistroPacienteComponent,
    MostrarDatosPacienteComponent,
    MostrarDatosAlPacienteComponent,
    LoginComponent,
    CambiarClaveComponent,
    GenerarClaveComponent,
    PermisoComponent,
    RolComponent,
    RolCrearComponent,
    UsuarioComponent,
    UsuarioCrearComponent,
    UsuarioEditarRolComponent,
  ],
  // dependencias de módulos
  imports: [
    BrowserModule,
    HttpClientModule,
    ScrollToModule.forRoot(),
    routing,
    OwlModule,
    BrowserAnimationsModule,
    MaterialDesignFrameworkModule,
    Ng2SearchPipeModule,
    Ng2OrderModule,
    NgxPaginationModule,
    RecaptchaModule.forRoot(),
    RecaptchaFormsModule,
    MyDatePickerModule,
    NgbModule.forRoot(),
    MatSnackBarModule,
    DemoMaterialModule,
    ChartjsModule,
    ToastrModule.forRoot(),
    ToastContainerModule,
    ModalModule,
    RecaptchaV3Module,
    DropdownModule,
    CheckboxModule,
    RadioButtonModule,
    FormsModule,
    QRCodeModule,
    MessagesModule,
    MessageModule,
    WebStorageModule
  ],
  providers: [
    appRoutingProviders,
    ScrollToService,
    // web: 6LeaIdMUAAAAALRst4PI1YiD5PHdBmf0O56FJ6a7  secreta: 6LeaIdMUAAAAAPeDIInz4Erxo6lAM80rwZsxbs3r
    { provide: RECAPTCHA_LANGUAGE, useValue: "es" },
    { provide: RECAPTCHA_V3_SITE_KEY, useValue: '6LeaIdMUAAAAALRst4PI1YiD5PHdBmf0O56FJ6a7' },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
