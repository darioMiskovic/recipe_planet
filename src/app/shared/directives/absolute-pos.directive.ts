import {Directive, ElementRef, HostBinding} from '@angular/core';

@Directive({
  selector: '[appAbsolutePos]'
})
export class AbsolutePosDirective {

 @HostBinding('class') elementClass = 'custom-spinner';

}


