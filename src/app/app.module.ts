import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from '@angular/common/http';
import { ScrollToModule } from "ng2-scroll-to";
import { ScrollToService } from "ng2-scroll-to-el";
import { FormsModule } from "@angular/forms";
import { MatSnackBarModule } from "@angular/material";
import { RecaptchaFormsModule } from "ng-recaptcha/forms";
import { routing, routesComponents, appRoutingProviders } from "./app.routing";
import { AppComponent } from "./app.component";
import { OwlModule } from "ng2-owl-carousel";
import { MaterialDesignFrameworkModule } from "angular6-json-schema-form";
import { NgxPaginationModule } from "ngx-pagination";
import { Ng2SearchPipeModule } from "ng2-search-filter";
import { Ng2OrderModule } from "ng2-order-pipe";
import { RecaptchaModule, RECAPTCHA_LANGUAGE } from "ng-recaptcha";
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

/*
  @autor: Luis Cardozo
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
  ],
  // dependencias de módulos
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
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
    ModalModule
  ],
  providers: [
    appRoutingProviders,
    ScrollToService,
    { provide: RECAPTCHA_LANGUAGE, useValue: "es" }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
