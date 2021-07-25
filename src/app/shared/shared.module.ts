import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageComponent } from './message/message.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { TruncatePipe } from './pipes/truncate.pipe';
import { AbsolutePosDirective } from './directives/absolute-pos.directive';
import { CloseBtnDirective } from './directives/close-btn.directive';

@NgModule({
  declarations: [
    MessageComponent,
    SpinnerComponent,
    TruncatePipe,
    AbsolutePosDirective,
    CloseBtnDirective,
  ],
  imports: [CommonModule],

  exports: [
    MessageComponent,
    SpinnerComponent,
    TruncatePipe,
    AbsolutePosDirective,
    CloseBtnDirective,
  ],
})
export class SharedModule {}
