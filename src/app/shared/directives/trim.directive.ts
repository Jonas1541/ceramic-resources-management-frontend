import { Directive, HostListener, ElementRef } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appTrim]',
  standalone: true
})
export class TrimDirective {

  constructor(
    private el: ElementRef,
    private ngControl: NgControl
  ) { }

  @HostListener('blur')
  onBlur(): void {
    const control = this.ngControl.control;
    if (control && typeof control.value === 'string') {
      const trimmedValue = control.value.trim();
      control.setValue(trimmedValue);
    }
  }
}
