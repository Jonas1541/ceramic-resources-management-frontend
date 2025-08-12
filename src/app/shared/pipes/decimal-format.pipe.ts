import { Pipe, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Pipe({
  name: 'decimalFormat',
  standalone: true
})
export class DecimalFormatPipe implements PipeTransform {

  constructor(private decimalPipe: DecimalPipe) {}

  transform(value: number | string, digitsInfo: string = '1.0-2'): string | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }
    return this.decimalPipe.transform(Number(value), digitsInfo, 'pt-BR');
  }

}