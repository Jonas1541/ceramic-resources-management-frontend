import { Directive, ElementRef, HostListener, forwardRef, Input } from '@angular/core';
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

  @Input() decimalPlaces: number = 2;

  private onChange = (_: any) => { };
  private onTouched = () => { };

  constructor(private el: ElementRef, private decimalPipe: DecimalPipe) { }

  writeValue(value: any): void {
    if (value !== null && value !== undefined) {
      const format = `1.${this.decimalPlaces}-${this.decimalPlaces}`;
      const formattedValue = this.decimalPipe.transform(value, format, 'pt-BR');
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
    // Optional: Format on blur to ensure precision?
    // Doing so provides better UX so 0,1 becomes 0,1000
    const value = this.el.nativeElement.value;
    if (value) {
      // Convert PT-BR string to number for formatting
      const numericValue = parseFloat(value.replace('.', '').replace(',', '.'));
      if (!isNaN(numericValue)) {
        const format = `1.${this.decimalPlaces}-${this.decimalPlaces}`;
        const formatted = this.decimalPipe.transform(numericValue, format, 'pt-BR');
        if (formatted) {
          this.el.nativeElement.value = formatted;
          // DO NOT trigger onChange here if the numeric value hasn't changed, 
          // but usually safer to just let the user's input stand or normalize it.
        }
      }
    }
  }
}
