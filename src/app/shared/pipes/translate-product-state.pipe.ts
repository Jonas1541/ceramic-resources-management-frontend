import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'translateProductState',
  standalone: true
})
export class TranslateProductStatePipe implements PipeTransform {

  transform(value: string): string {
    switch (value) {
      case 'GREENWARE':
        return 'Cru';
      case 'BISCUIT':
        return 'Biscoito';
      case 'GLAZED':
        return 'Glasurado';
      case 'SOLD':
        return 'Vendido';
      case 'DEFECT_DISPOSAL':
        return 'Descartado';
      default:
        return value;
    }
  }

}