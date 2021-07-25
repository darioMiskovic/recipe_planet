import { Directive, ElementRef, HostListener, OnInit } from '@angular/core';

@Directive({
  selector: '[appCloseBtn]',
})
export class CloseBtnDirective {
  constructor(private el: ElementRef) {}

  toggleClass(type: string) {
    switch (type) {
      case 'add':
        this.el.nativeElement.nextElementSibling.classList.add('activeModal');
        break;

      case 'remove':
        this.el.nativeElement.nextElementSibling.classList.remove(
          'activeModal'
        );
        break;

      default:
        this.el.nativeElement.parentElement.classList.remove('activeModal');
    }
  }

  @HostListener('click') onClick() {
    this.toggleClass('');
  }

  @HostListener('mouseenter') onMouseEnter() {
    this.toggleClass('add');
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.toggleClass('remove');
  }
}
