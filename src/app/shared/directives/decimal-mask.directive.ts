import { Directive, ElementRef, HostListener, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Directive({
  selector: '[appDecimalMask]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DecimalMaskDirective),
      multi: true
    }
  ]
})
export class DecimalMaskDirective implements ControlValueAccessor {

  private onChange = (_: any) => {};
  private onTouched = () => {};

  constructor(private el: ElementRef) { }

  writeValue(value: any): void {
    if (value) {
      this.el.nativeElement.value = String(value).replace('.', ',');
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/[^0-9,]/g, '');
    this.el.nativeElement.value = value;
    this.onChange(value.replace(',', '.'));
  }

  @HostListener('blur')
  onBlur(): void {
    this.onTouched();
  }
}
