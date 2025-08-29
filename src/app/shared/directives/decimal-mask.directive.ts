import { Directive, ElementRef, HostListener, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { DecimalPipe } from '@angular/common';

@Directive({
  selector: '[appDecimalMask]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DecimalMaskDirective),
      multi: true
    },
    DecimalPipe
  ]
})
export class DecimalMaskDirective implements ControlValueAccessor {

  private onChange = (_: any) => {};
  private onTouched = () => {};

  constructor(private el: ElementRef, private decimalPipe: DecimalPipe) { }

  writeValue(value: any): void {
    if (value !== null && value !== undefined) {
      const formattedValue = this.decimalPipe.transform(value, '1.2-2', 'pt-BR');
      this.el.nativeElement.value = formattedValue;
    } else {
      this.el.nativeElement.value = '';
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
    
    const commaCount = (value.match(/,/g) || []).length;
    if (commaCount > 1) {
      const firstCommaIndex = value.indexOf(',');
      value = value.substring(0, firstCommaIndex + 1) + value.substring(firstCommaIndex + 1).replace(/,/g, '');
    }

    this.el.nativeElement.value = value;
    this.onChange(value);
  }

  @HostListener('blur')
  onBlur(): void {
    this.onTouched();
  }
}
