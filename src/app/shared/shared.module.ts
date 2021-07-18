import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MessageComponent} from "./message/message.component";
import {SpinnerComponent} from "./spinner/spinner.component";
import {TruncatePipe} from "./pipes/truncate.pipe";
import {ErrorComponent} from "./message/error/error.component";



@NgModule({
  declarations: [
    MessageComponent,
    ErrorComponent,
    SpinnerComponent,
    TruncatePipe
  ],
  imports: [
    CommonModule
  ],

  exports: [
    MessageComponent,
    ErrorComponent,
    SpinnerComponent,
    TruncatePipe
  ]
})
export class SharedModule { }
