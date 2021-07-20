import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from "@angular/forms";
import {LoginFormComponent} from "./login-form/login-form.component";
import {RegisterFormComponent} from "./register-form/register-form.component";
import {AuthComponent} from "./auth.component";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AppRoutingModule} from "../app-routing.module";
import {AuthInterceptorService} from "./auth-interceptor.service";
import {SharedModule} from "../shared/shared.module";



@NgModule({
  declarations: [
    LoginFormComponent,
    RegisterFormComponent,
    AuthComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    SharedModule
  ],
  providers:[
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }
  ]
})
export class AuthModule { }
